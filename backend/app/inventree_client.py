"""Async httpx wrapper around the InvenTree REST API.

InvenTree is reached over localhost only. Authentication uses a token in the
Authorization header. The token is read from configuration as a SecretStr and is
never logged.
"""

from __future__ import annotations

import httpx

from .logging_config import get_logger

logger = get_logger(__name__)


class InvenTreeError(Exception):
    """Raised when InvenTree cannot be reached or returns an error status."""


class InvenTreeClient:
    """Thin async client for the handful of InvenTree endpoints we need."""

    def __init__(
        self,
        base_url: str,
        token: str,
        timeout_seconds: float = 10.0,
        transport: httpx.BaseTransport | None = None,
    ) -> None:
        self._base_url = base_url.rstrip("/")
        # `transport` is an injection point for tests (httpx.MockTransport).
        # In normal operation it is None and httpx uses its default transport.
        self._client = httpx.AsyncClient(
            base_url=self._base_url,
            headers={
                "Authorization": f"Token {token}",
                "Accept": "application/json",
            },
            timeout=timeout_seconds,
            transport=transport,
        )

    async def aclose(self) -> None:
        await self._client.aclose()

    async def _get_paginated(self, path: str, params: dict[str, object] | None = None) -> list[dict]:
        """GET a list endpoint, following InvenTree pagination if present.

        InvenTree returns either a bare list or a {count, next, results} object
        depending on configuration. Both are handled.
        """
        results: list[dict] = []
        next_url: str | None = path
        query: dict[str, object] | None = dict(params or {})

        while next_url:
            try:
                response = await self._client.get(next_url, params=query)
                response.raise_for_status()
            except httpx.HTTPError as exc:
                # Log the path and error type only. Never the auth header.
                logger.warning(
                    "inventree request failed",
                    extra={"path": path, "error": exc.__class__.__name__},
                )
                raise InvenTreeError(str(exc)) from exc

            body = response.json()
            if isinstance(body, list):
                results.extend(body)
                break

            results.extend(body.get("results", []))
            next_url = body.get("next")
            # `next` is an absolute URL that already carries the query string.
            query = None

        return results

    async def get_parts(self) -> list[dict]:
        """Return active parts with their category detail expanded."""
        return await self._get_paginated(
            "/api/part/",
            {"active": "true", "category_detail": "true", "limit": 500},
        )

    async def get_part_parameters(self) -> list[dict]:
        """Return all part parameters with their template detail expanded."""
        return await self._get_paginated(
            "/api/part/parameter/",
            {"limit": 1000},
        )
