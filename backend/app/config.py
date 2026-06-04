"""Application configuration.

All settings come from environment variables, loaded from a gitignored .env
file in development. Secrets (the InvenTree token) are held as SecretStr so they
never appear in logs or tracebacks by accident.
"""

from __future__ import annotations

from functools import lru_cache

from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime configuration, read from the environment / .env file."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # --- InvenTree connection (localhost only, never public) -----------------
    # INVENTREE_URL and INVENTREE_TOKEN are required in any real deployment.
    # They default to empty so the app can still boot (and serve an empty,
    # clearly stale catalogue) when InvenTree is not configured yet.
    inventree_url: str = ""
    inventree_token: SecretStr = SecretStr("")

    # --- HTTP / cache behaviour ----------------------------------------------
    request_timeout_seconds: float = 10.0
    cache_ttl_seconds: float = 60.0

    # --- CORS ----------------------------------------------------------------
    # Comma separated list of allowed origins. Defaults to the Meridian
    # production domains only. No wildcard.
    cors_origins: str = "https://meridianvapes.co.uk,https://www.meridianvapes.co.uk"

    # --- InvenTree part parameter names --------------------------------------
    # The public shape is built from InvenTree parts plus custom part
    # parameters. These are the parameter template names we read. They are
    # configurable so the InvenTree admin can rename templates without a code
    # change. Matching is case insensitive.
    param_mhra_notified: str = "mhra_notified"
    param_is_disposable: str = "is_disposable"
    param_price_gbp: str = "price_gbp"
    param_slug: str = "slug"
    param_image_url: str = "image_url"
    param_category: str = "category"

    # --- Logging -------------------------------------------------------------
    log_level: str = "INFO"

    @property
    def cors_origin_list(self) -> list[str]:
        """CORS origins as a clean list, empty entries dropped."""
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def inventree_configured(self) -> bool:
        """True when both URL and token are present."""
        return bool(self.inventree_url) and bool(self.inventree_token.get_secret_value())


@lru_cache
def get_settings() -> Settings:
    """Return a cached Settings instance so the .env file is read once."""
    return Settings()
