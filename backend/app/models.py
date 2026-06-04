"""Public Pydantic models.

The public product shape is deliberately small and factual. There are NO
promotional fields (no discount, offer, savings, "best", countdown). Compliance
is part of the model: every product carries mhra_notified, and disposables are
excluded upstream so they never reach this shape at all.
"""

from __future__ import annotations

from pydantic import BaseModel, Field


class PublicProduct(BaseModel):
    """A single product as served to the storefront."""

    id: str
    slug: str
    name: str
    category: str
    price_gbp: float = Field(ge=0)
    in_stock: bool
    stock_level: int = Field(ge=0)
    description: str
    image_url: str | None = None
    mhra_notified: bool


class CacheStatus(BaseModel):
    """Cache state surfaced on the health endpoint."""

    state: str  # fresh | stale | unavailable
    product_count: int
    age_seconds: float | None = None
    ttl_seconds: float


class HealthResponse(BaseModel):
    """Response body for GET /api/health."""

    status: str
    inventree_configured: bool
    cache: CacheStatus
