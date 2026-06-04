"""Meridian Vapes FastAPI integration layer.

A small service that reads product data from a self-hosted InvenTree instance
over localhost and serves a clean, compliance-filtered product JSON to the
React storefront. InvenTree is never exposed publicly; this service is the only
thing that talks to it.
"""

__version__ = "0.1.0"
