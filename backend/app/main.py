"""FastAPI application for the Meridian Vapes storefront.

Endpoints:
    GET /api/health
    GET /api/products            (optional ?category= filter)
    GET /api/products/{slug}

Responses carry an X-Cache-Status header (fresh | stale | unavailable) so the
caller can tell when the catalogue is being served from a stale cache because
InvenTree was unreachable. The product bodies themselves stay a clean array /
object so the storefront contract is unchanged.
"""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI, Query, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .cache import CacheState, ProductCache
from .config import Settings, get_settings
from .inventree_client import InvenTreeClient
from .logging_config import configure_logging, get_logger
from .models import CacheStatus, HealthResponse, PublicProduct
from .service import ProductService

logger = get_logger(__name__)

CACHE_HEADER = "X-Cache-Status"


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings: Settings = get_settings()
    configure_logging(settings.log_level)

    client = InvenTreeClient(
        base_url=settings.inventree_url,
        token=settings.inventree_token.get_secret_value(),
        timeout_seconds=settings.request_timeout_seconds,
    )
    cache = ProductCache(ttl_seconds=settings.cache_ttl_seconds)
    app.state.settings = settings
    app.state.service = ProductService(client, cache, settings)

    logger.info(
        "meridian api starting",
        extra={
            "inventree_configured": settings.inventree_configured,
            "cache_ttl_seconds": settings.cache_ttl_seconds,
            "cors_origins": settings.cors_origin_list,
        },
    )
    try:
        yield
    finally:
        await client.aclose()
        logger.info("meridian api stopped")


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="Meridian Vapes API",
        version="0.1.0",
        summary="Compliance-filtered product catalogue for the Meridian Vapes storefront.",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_methods=["GET"],
        allow_headers=["Accept", "Content-Type"],
        allow_credentials=False,
    )

    def _service(request: Request) -> ProductService:
        return request.app.state.service

    @app.get("/api/health", response_model=HealthResponse)
    async def health(request: Request) -> HealthResponse:
        settings: Settings = request.app.state.settings
        service = _service(request)
        cache = service.cache
        products = cache.get()
        if products is None:
            state = CacheState.UNAVAILABLE
        elif cache.is_fresh():
            state = CacheState.FRESH
        else:
            state = CacheState.STALE
        return HealthResponse(
            status="ok",
            inventree_configured=settings.inventree_configured,
            cache=CacheStatus(
                state=state.value,
                product_count=len(products or []),
                age_seconds=cache.age_seconds(),
                ttl_seconds=cache.ttl_seconds,
            ),
        )

    @app.get("/api/products", response_model=list[PublicProduct])
    async def list_products(
        request: Request,
        response: Response,
        category: str | None = Query(default=None),
    ) -> list[PublicProduct]:
        products, state = await _service(request).get_products(category=category)
        response.headers[CACHE_HEADER] = state.value
        return products

    @app.get("/api/products/{slug}", response_model=PublicProduct)
    async def get_product(request: Request, response: Response, slug: str):
        product, state = await _service(request).get_product(slug)
        if product is None:
            return JSONResponse(
                status_code=404,
                content={"detail": "product not found"},
                headers={CACHE_HEADER: state.value},
            )
        response.headers[CACHE_HEADER] = state.value
        return product

    return app


app = create_app()
