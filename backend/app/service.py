"""Product service: fetch from InvenTree, map, cache, serve.

This is the layer the routes call. It owns the cache and the resilience rule:
if InvenTree is unreachable, serve the last good cache flagged as stale rather
than failing. The storefront must never go down because the stock system blipped.
"""

from __future__ import annotations

import asyncio

from .cache import CacheState, ProductCache
from .config import Settings
from .inventree_client import InvenTreeClient, InvenTreeError
from .logging_config import get_logger
from .mapping import transform_inventree
from .models import PublicProduct

logger = get_logger(__name__)


class ProductService:
    """Fetches, maps and caches the public catalogue."""

    def __init__(self, client: InvenTreeClient, cache: ProductCache, settings: Settings) -> None:
        self._client = client
        self._cache = cache
        self._settings = settings
        self._lock = asyncio.Lock()

    async def _refresh(self) -> list[PublicProduct]:
        parts = await self._client.get_parts()
        parameters = await self._client.get_part_parameters()
        products = transform_inventree(parts, parameters, self._settings)
        self._cache.set(products)
        return products

    async def get_products(
        self,
        category: str | None = None,
    ) -> tuple[list[PublicProduct], CacheState]:
        """Return (products, state). Never raises on upstream failure."""
        if self._cache.is_fresh():
            return self._filter(self._cache.get() or [], category), CacheState.FRESH

        # Single-flight refresh: only one coroutine hits InvenTree at a time.
        async with self._lock:
            if self._cache.is_fresh():
                return self._filter(self._cache.get() or [], category), CacheState.FRESH
            try:
                products = await self._refresh()
                return self._filter(products, category), CacheState.FRESH
            except InvenTreeError:
                last_good = self._cache.get()
                if last_good is not None:
                    logger.warning("serving stale catalogue; InvenTree unreachable")
                    return self._filter(last_good, category), CacheState.STALE
                logger.error("InvenTree unreachable and no cached catalogue available")
                return [], CacheState.UNAVAILABLE

    async def get_product(self, slug: str) -> tuple[PublicProduct | None, CacheState]:
        """Return (product or None, state) for a single slug."""
        products, state = await self.get_products()
        match = next((p for p in products if p.slug == slug), None)
        return match, state

    @staticmethod
    def _filter(products: list[PublicProduct], category: str | None) -> list[PublicProduct]:
        if not category:
            return products
        wanted = category.strip().lower()
        return [p for p in products if p.category == wanted]

    # --- introspection for the health endpoint -------------------------------
    @property
    def cache(self) -> ProductCache:
        return self._cache
