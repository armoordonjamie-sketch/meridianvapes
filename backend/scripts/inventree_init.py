#!/usr/bin/env python3
"""Initialise InvenTree for the Meridian storefront.

Creates the part parameter templates the Meridian API reads, and the part
categories whose names map to the storefront category slugs. Idempotent: safe
to re-run. Reads INVENTREE_URL and INVENTREE_TOKEN from backend/.env.

Run with the backend virtualenv, e.g.:
    /var/www/meridian/venv/bin/python backend/scripts/inventree_init.py
"""

import os
import re
import sys
from pathlib import Path

import httpx
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[1] / ".env")
BASE = os.environ.get("INVENTREE_URL", "").rstrip("/")
TOKEN = os.environ.get("INVENTREE_TOKEN", "")
if not BASE or not TOKEN:
    sys.exit("Set INVENTREE_URL and INVENTREE_TOKEN in backend/.env first.")

client = httpx.Client(
    base_url=BASE,
    headers={"Authorization": f"Token {TOKEN}", "Accept": "application/json"},
    timeout=30,
)


def get_all(path: str) -> list[dict]:
    response = client.get(path, params={"limit": 1000})
    response.raise_for_status()
    data = response.json()
    return data["results"] if isinstance(data, dict) and "results" in data else data


# (name, checkbox, description)
TEMPLATES = [
    ("mhra_notified", True, "MHRA notified under the TPD. Must be true for the product to appear on the storefront."),
    ("is_disposable", True, "Single-use disposable. If true the product is excluded from the storefront."),
    ("price_gbp", False, "Retail price in GBP including VAT, e.g. 24.99."),
    ("slug", False, "Storefront URL slug. Leave blank to derive from the part name."),
    ("image_url", False, "Publicly reachable product image URL."),
    ("category", False, "Optional storefront category slug override."),
]

# Category names map to storefront slugs by lowercasing and replacing runs of
# non-alphanumerics with a hyphen (matches the Meridian API mapping).
CATEGORIES = [
    ("Pod Kits", "Refillable pod systems and starter kits."),
    ("Prefilled Pods", "Closed prefilled pods for compatible devices."),
    ("E-Liquids", "Bottled e-liquids and shortfills."),
    ("Pods & Coils", "Replacement pods and coils."),
    ("Nic Shots", "Nicotine shots for shortfills."),
    ("Accessories", "Chargers, cables and accessories."),
]


def main() -> None:
    have_templates = {t["name"].lower() for t in get_all("/api/part/parameter/template/")}
    print("Parameter templates:")
    for name, checkbox, description in TEMPLATES:
        if name.lower() in have_templates:
            print("  exists:", name)
            continue
        response = client.post(
            "/api/part/parameter/template/",
            json={"name": name, "units": "", "checkbox": checkbox, "description": description},
        )
        response.raise_for_status()
        print("  created:", name)

    have_categories = {c["name"].lower() for c in get_all("/api/part/category/")}
    print("Categories:")
    for name, description in CATEGORIES:
        if name.lower() in have_categories:
            print("  exists:", name)
            continue
        response = client.post("/api/part/category/", json={"name": name, "description": description})
        response.raise_for_status()
        print("  created:", name)

    slugs = ", ".join(re.sub(r"[^a-z0-9]+", "-", n.lower()).strip("-") for n, _ in CATEGORIES)
    print("Storefront category slugs:", slugs)
    print("Done.")


if __name__ == "__main__":
    main()
