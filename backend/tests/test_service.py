"""Tests for the client auth header and the service cache / resilience rules."""

import httpx
import pytest

from app.cache import CacheState, ProductCache
from app.inventree_client import InvenTreeClient, InvenTreeError
from app.mapping import transform_inventree
from app.service import ProductService

from .fixtures import SAMPLE_PARAMETERS, SAMPLE_PARTS


async def test_client_sends_token_auth_header(settings):
    """The client must authenticate to InvenTree with a token header."""
    seen_headers: dict[str, str] = {}

    def handler(request: httpx.Request) -> httpx.Response:
        seen_headers["auth"] = request.headers.get("Authorization", "")
        if request.url.path == "/api/part/":
            return httpx.Response(200, json=SAMPLE_PARTS)
        if request.url.path == "/api/part/parameter/":
            return httpx.Response(200, json=SAMPLE_PARAMETERS)
        return httpx.Response(404, json=[])

    client = InvenTreeClient(
        base_url="http://127.0.0.1:8080",
        token="secret-token-value",
        transport=httpx.MockTransport(handler),
    )
    try:
        parts = await client.get_parts()
    finally:
        await client.aclose()

    assert seen_headers["auth"] == "Token secret-token-value"
    assert len(parts) == 3


async def test_client_raises_inventree_error_on_http_error():
    def handler(request: httpx.Request) -> httpx.Response:
        return httpx.Response(500, json={"detail": "boom"})

    client = InvenTreeClient(
        base_url="http://127.0.0.1:8080",
        token="t",
        transport=httpx.MockTransport(handler),
    )
    try:
        with pytest.raises(InvenTreeError):
            await client.get_parts()
    finally:
        await client.aclose()


class _FakeClient:
    """Stand-in client whose calls always fail, to drive the stale path."""

    async def get_parts(self):
        raise InvenTreeError("unreachable")

    async def get_part_parameters(self):
        raise InvenTreeError("unreachable")


async def test_service_serves_stale_cache_when_inventree_unreachable(settings):
    cache = ProductCache(ttl_seconds=0)  # ttl 0 => always expired => forces refresh
    cache.set(transform_inventree(SAMPLE_PARTS, SAMPLE_PARAMETERS, settings))
    service = ProductService(_FakeClient(), cache, settings)

    products, state = await service.get_products()

    assert state is CacheState.STALE
    assert len(products) == 1  # the last good (compliant) catalogue


async def test_service_returns_unavailable_when_no_cache_and_unreachable(settings):
    cache = ProductCache(ttl_seconds=0)
    service = ProductService(_FakeClient(), cache, settings)

    products, state = await service.get_products()

    assert state is CacheState.UNAVAILABLE
    assert products == []


async def test_service_category_filter(settings):
    cache = ProductCache(ttl_seconds=300)
    cache.set(transform_inventree(SAMPLE_PARTS, SAMPLE_PARAMETERS, settings))
    service = ProductService(_FakeClient(), cache, settings)

    in_category, state = await service.get_products(category="pod-kits")
    assert state is CacheState.FRESH
    assert len(in_category) == 1

    none, _ = await service.get_products(category="nic-shots")
    assert none == []
