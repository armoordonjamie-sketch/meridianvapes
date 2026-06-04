"""Shared pytest fixtures."""

import pytest

from app.config import Settings


@pytest.fixture
def settings() -> Settings:
    """Settings with defaults only, isolated from any real .env on disk."""
    return Settings(_env_file=None)
