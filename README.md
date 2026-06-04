# Meridian Vapes

Online vape retailer for Eltham and South East London. Factual, compliance-first
product data with age-verified local delivery.

This repository holds the storefront and its backend integration layer. The
inventory source of truth is a self-hosted InvenTree instance running in Docker
on the same VPS, bound to localhost. InvenTree is never exposed publicly: the
FastAPI service is the only thing that talks to it.

## Layout

```
backend/        FastAPI integration layer (InvenTree -> clean public product JSON)
  app/          application package (client, mapping, cache, service, routes)
  tests/        pytest suite (compliance filter, auth header, stale fallback)
  .env.example  environment template (placeholders only; real .env is gitignored)
  README.md     backend env vars and how to run locally with uvicorn
site/           React + TypeScript + Vite storefront (static site generation)
deploy.sh       build + deploy script (Meridian-only; never touches TriPoint)
deploy/         systemd unit and nginx server block templates for Meridian
cron/           InvenTree DB backup and product cache warm, plus the installer
```

## Stack

Mirrors the TriPoint Diagnostics setup on the shared VPS, as separate units,
ports and server blocks:

- Frontend: React + TypeScript + Vite, prerendered to static HTML.
- Backend: FastAPI served by uvicorn on `127.0.0.1:8010` (TriPoint owns 8000).
- Edge: nginx serves the static site and reverse proxies `/api/` to the backend.
- Inventory: self-hosted InvenTree (Django + REST API) in Docker, localhost only.

## Compliance by design

- Every public product carries an `mhra_notified` flag.
- Single-use disposables are excluded from the catalogue by design.
- No promotional fields anywhere in the data model (no discount, offer, savings,
  "best", countdown). Product data is factual only.

## Getting started

- Backend: see [backend/README.md](backend/README.md) for environment variables
  and how to run the API locally with uvicorn.
- Frontend: see `site/` (`npm install` then `npm run dev`).

## Secrets

`INVENTREE_URL` and `INVENTREE_TOKEN` come from environment variables loaded
from a gitignored `.env` file. Only `.env.example` placeholders are committed.
Never commit a real `.env`, token or credential.
