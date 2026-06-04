# Meridian Vapes API

A small FastAPI service that reads product data from a self-hosted InvenTree
instance over localhost and serves a clean, compliance-filtered product JSON to
the React storefront.

InvenTree is never exposed publicly. This service is the only thing that talks
to it, and it does so over the loopback interface only.

## What it does

- Reads InvenTree parts plus custom part parameters and maps them to a small,
  factual public product shape.
- Returns only compliant products: `mhra_notified` is true AND `is_disposable`
  is false. Disposables are excluded by design.
- Caches the catalogue in memory for about 60 seconds so the storefront stays
  fast and InvenTree is not hammered.
- If InvenTree is unreachable, serves the last good cache flagged as stale
  rather than returning a 5xx. The storefront never goes down because the stock
  system blipped.

## Public product shape

```json
{
  "id": "10",
  "slug": "aurora-refillable-pod-kit",
  "name": "Aurora Refillable Pod Kit",
  "category": "pod-kits",
  "price_gbp": 24.99,
  "in_stock": true,
  "stock_level": 12,
  "description": "Refillable pod system with a 2ml pod and USB-C charging.",
  "image_url": "https://www.meridianvapes.co.uk/img/aurora.webp",
  "mhra_notified": true
}
```

There are no promotional fields by design (no discount, offer, savings, "best",
countdown). Compliance is part of the model, not decoration.

## Endpoints

| Method | Path                   | Notes                                              |
| ------ | ---------------------- | -------------------------------------------------- |
| GET    | `/api/health`          | Service status plus cache state.                   |
| GET    | `/api/products`        | Compliant catalogue. Optional `?category=` filter. |
| GET    | `/api/products/{slug}` | Single product, or 404.                            |

Every product response carries an `X-Cache-Status` header with one of
`fresh`, `stale` or `unavailable`, so the caller can tell when the catalogue is
being served from a stale cache because InvenTree was briefly unreachable. The
response bodies stay a clean array or object.

## Environment variables

All configuration comes from environment variables, loaded from a gitignored
`.env` file in development. Copy `.env.example` to `.env` and fill in real
values. Never commit `.env`.

| Variable                  | Required | Default                                                          | Purpose                                                            |
| ------------------------- | -------- | ---------------------------------------------------------------- | ------------------------------------------------------------------ |
| `INVENTREE_URL`           | yes      | empty                                                            | InvenTree base URL on localhost, e.g. `http://127.0.0.1:8080`.     |
| `INVENTREE_TOKEN`         | yes      | empty                                                            | InvenTree API token. Held as a secret; never logged.               |
| `REQUEST_TIMEOUT_SECONDS` | no       | `10`                                                             | HTTP timeout for InvenTree requests.                               |
| `CACHE_TTL_SECONDS`       | no       | `60`                                                             | How long a fetched catalogue is considered fresh.                  |
| `CORS_ORIGINS`            | no       | `https://meridianvapes.co.uk,https://www.meridianvapes.co.uk`    | Comma separated allowed origins. No wildcard.                      |
| `PARAM_MHRA_NOTIFIED`     | no       | `mhra_notified`                                                  | InvenTree part parameter name for the MHRA notification flag.      |
| `PARAM_IS_DISPOSABLE`     | no       | `is_disposable`                                                  | InvenTree part parameter name for the disposable flag.             |
| `PARAM_PRICE_GBP`         | no       | `price_gbp`                                                      | InvenTree part parameter name for the GBP price.                   |
| `PARAM_SLUG`              | no       | `slug`                                                           | InvenTree part parameter name for the URL slug.                    |
| `PARAM_IMAGE_URL`         | no       | `image_url`                                                      | InvenTree part parameter name for a publicly reachable image URL.  |
| `PARAM_CATEGORY`          | no       | `category`                                                       | Optional override for the category slug.                           |
| `LOG_LEVEL`               | no       | `INFO`                                                           | Log level.                                                         |

### How the shape is built from InvenTree

- `id` comes from the InvenTree part primary key.
- `slug` comes from the `slug` parameter, or is derived from the name.
- `category` comes from the InvenTree category name (slugified), or the
  `category` parameter if set.
- `price_gbp` comes from the `price_gbp` parameter, falling back to InvenTree
  pricing if the parameter is absent.
- `stock_level` and `in_stock` come from the part's total stock.
- `image_url` comes from the `image_url` parameter. It must be a publicly
  reachable URL. InvenTree's internal media path is deliberately never exposed.
- `mhra_notified` and `is_disposable` come from their respective parameters.
  `is_disposable` is used only for filtering and never appears in the public
  shape.

## Run locally with uvicorn

From the `backend` directory:

```bash
# 1. Create a virtual environment and install dependencies
python3 -m venv .venv
source .venv/bin/activate            # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# 2. Configure the environment
cp .env.example .env                 # then edit .env with a real INVENTREE_URL and INVENTREE_TOKEN

# 3. Run the API on the Meridian port (TriPoint uses 8000; Meridian uses 8010)
uvicorn app.main:app --host 127.0.0.1 --port 8010 --reload
```

Then:

```bash
curl http://127.0.0.1:8010/api/health
curl http://127.0.0.1:8010/api/products
curl "http://127.0.0.1:8010/api/products?category=pod-kits"
```

Without a reachable InvenTree the API still returns 200 with an empty array and
`X-Cache-Status: unavailable`, so it is safe to boot before InvenTree is wired up.

## Tests

```bash
pip install -r requirements-dev.txt
pytest
```

The tests use a mocked InvenTree response with one compliant part, one
non-notified part and one disposable, and assert that only the compliant product
is returned. They also cover the token auth header and the stale-cache fallback.
