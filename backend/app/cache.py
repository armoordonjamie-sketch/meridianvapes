"""In-memory time to live cache for the product list.

Holds the last good result so that, if InvenTree blips, the storefront keeps
serving the most recent known-good catalogue instead of failing. A monotonic
clock is used so the cache is unaffected by wall clock changes.
"""

from __future__ import annotations

import time
from enum import Enum

from .models import PublicProduct


class CacheState(str, Enum):
    """Where a served result came from."""

    FRESH = "fresh"            # served from a live InvenTree read within the TTL
    STALE = "stale"            # InvenTree unreachable; served the last good cache
    UNAVAILABLE = "unavailable"  # InvenTree unreachable and nothing cached yet


class ProductCache:
    """Single-slot cache for the full product list."""

    def __init__(self, ttl_seconds: float) -> None:
        self._ttl = ttl_seconds
        self._data: list[PublicProduct] | None = None
        self._fetched_at: float | None = None

    def is_fresh(self) -> bool:
        if self._data is None or self._fetched_at is None:
            return False
        return (time.monotonic() - self._fetched_at) < self._ttl

    def get(self) -> list[PublicProduct] | None:
        """Return the last good data, or None if nothing has been cached."""
        return self._data

    def set(self, data: list[PublicProduct]) -> None:
        self._data = data
        self._fetched_at = time.monotonic()

    def age_seconds(self) -> float | None:
        if self._fetched_at is None:
            return None
        return time.monotonic() - self._fetched_at

    @property
    def ttl_seconds(self) -> float:
        return self._ttl
