# Meridian Vapes — Front-end

Marketing + e-commerce front-end for **Meridian Vapes**, an age-verified local
vape delivery brand serving Eltham and South East London.

Built as a **prerendered (SSG) site** so every page ships as crawlable static
HTML with full per-page SEO, while remaining a single-page app after hydration.

- **React + TypeScript + Vite**
- **Tailwind CSS** (brand tokens, dark theme)
- **vite-react-ssg** — static prerendering of every route to HTML
- **lucide-react** — all UI icons
- **react-router-dom** — routing
- Mobile-first, responsive, WCAG-AA-minded, no advertising pixels

---

## Quick start

```bash
cd site
npm install
npm run dev        # dev server at http://localhost:5173
```

```bash
npm run build      # type-check → prerender all routes → generate sitemap/robots
npm run preview    # serve the production build from dist/
npm run lint       # tsc --noEmit (type-check only)
```

The app builds and runs with placeholder content **out of the box** — no `.env`
required. Copy `.env.example` to `.env` to supply real values.

---

## Project structure

```
site/
├─ public/
│  ├─ brand/                 # transparent logo PNGs (from /logo)
│  ├─ og/                    # social share image
│  ├─ favicon*.png, *.ico    # generated from the logo mark
│  ├─ site.webmanifest
│  └─ robots.txt             # dev default (build regenerates in dist/)
├─ scripts/
│  └─ generate-sitemap.mjs   # post-build sitemap.xml + robots.txt
├─ src/
│  ├─ config/site.ts         # ← single source of truth: NAP, company, env, providers
│  ├─ data/                  # categories, areas, faq, legal — pure data
│  ├─ lib/
│  │  ├─ catalogue/          # types, mock products, API abstraction
│  │  ├─ payments/           # provider-agnostic interface + stub
│  │  ├─ age/                # provider-agnostic interface + stub + age-gate hook
│  │  ├─ cart/               # cart context (localStorage)
│  │  ├─ seo/                # <Seo> head component + JSON-LD builders
│  │  ├─ analytics/ga.ts     # GA4 placeholder (disabled by default)
│  │  ├─ cookies.ts, format.ts
│  ├─ components/            # layout, ui, home, product, checkout, common
│  ├─ pages/                 # one component per route
│  ├─ routes.tsx             # route table (code-split via lazy)
│  └─ main.tsx               # ViteReactSSG entry
├─ tailwind.config.ts        # ← brand tokens live here
└─ vite.config.ts            # SSG options + dynamic-route prerendering
```

---

## Brand tokens

All colours, fonts and spacing tokens live in
[`tailwind.config.ts`](tailwind.config.ts). **Components never hardcode hex
values** — they reference tokens like `bg-ink-950`, `text-silver-300`,
`text-accent`, `ring-accent`.

Colours were sampled directly from the logo assets in `/logo`:

| Token        | Value     | Source                                    |
| ------------ | --------- | ----------------------------------------- |
| `accent-500` | `#0081FD` | electric blue vape device in the logo     |
| `silver-300` | `#BEC0C4` | silver-grey "M" wings                     |
| `ink-950`    | `#0A0B0D` | near-black premium dark background        |

The accent scale uses `accent-600` (`#0067CA`) for solid buttons so white text
meets WCAG AA contrast (≈5.5:1), while `accent-400/500` are used for accent text
on the dark background.

Font is **Manrope** (a clean geometric sans), loaded in
[`index.html`](index.html) via Google Fonts with `preconnect` +
`display=swap`. Swap or self-host by editing the `<link>` there and the
`fontFamily` tokens in the Tailwind config.

---

## Configuration & NAP (a single source of truth)

[`src/config/site.ts`](src/config/site.ts) reads everything from `VITE_*`
environment variables (see [`.env.example`](.env.example)) with safe
placeholder fallbacks. The footer, contact page, and all JSON-LD read the
**same** company Name / Address / Phone from here, so local-SEO data stays
consistent. Edit it once.

---

## Routes (all prerendered)

| Route | Notes |
| --- | --- |
| `/` | Home: hero + postcode check, trust strip, categories, how-it-works, about |
| `/shop`, `/shop/:category` | Catalogue + filters (strength, flavour, device, brand) |
| `/product/:slug` | Product detail (factual: strength, VG/PG, price inc VAT, stock, 18+) |
| `/delivery` | Coverage, windows, doorstep ID-check |
| `/areas/:area` | Local SEO pages: eltham, mottingham, new-eltham, sidcup |
| `/about`, `/help`, `/contact`, `/account` | |
| `/cart`, `/checkout` | Basket + checkout (age verification → payment); `noindex` |
| `/terms`, `/privacy`, `/returns`, `/delivery-policy`, `/age-verification`, `/cookies`, `/responsible-retailing` | Legal |

Dynamic routes are expanded into concrete static pages at build time by
`ssgOptions.includedRoutes` in [`vite.config.ts`](vite.config.ts), which reads
the product, category and area data — **add data, get pages automatically.**

---

## How to swap the stubs for real providers

### Payments (Stripe is intentionally NOT used — it prohibits vape)

The app depends only on the `PaymentProvider` interface
([`src/lib/payments/types.ts`](src/lib/payments/types.ts)).

1. Add `src/lib/payments/AcmePaymentProvider.ts` implementing `PaymentProvider`
   (`createCheckout`, `getCheckout`, `cancelCheckout`). `createCheckout` **must**
   reject when `ageVerified` is `false`.
2. Register it in [`src/lib/payments/index.ts`](src/lib/payments/index.ts):
   ```ts
   case 'acme-highrisk':
     instance = new AcmePaymentProvider(providers.paymentsPublicKey)
     break
   ```
3. Set `VITE_PAYMENTS_PROVIDER=acme-highrisk`.

No component changes are needed — checkout calls `getPaymentProvider()`.

### Age verification (1account / AgeChecked)

Same pattern, behind `AgeVerificationProvider`
([`src/lib/age/types.ts`](src/lib/age/types.ts)).

1. Add `src/lib/age/OneAccountProvider.ts` implementing `verify` + `getStatus`.
2. Register it in [`src/lib/age/index.ts`](src/lib/age/index.ts).
3. Set `VITE_AGE_PROVIDER=1account`.

The checkout step (`AgeVerificationStep`) only calls
`getAgeVerificationProvider()`. **An order is not dispatchable until
`result.passed === true`.**

---

## How to add products / connect a real API

The catalogue is accessed only through
[`src/lib/catalogue/api.ts`](src/lib/catalogue/api.ts) — components never import
the mock data directly.

- **Add a mock product:** append a typed `Product` to
  [`src/lib/catalogue/products.ts`](src/lib/catalogue/products.ts). The shop,
  filters, product page and its prerendered route + sitemap entry all update
  automatically.
- **Connect the FastAPI backend:** set `VITE_API_BASE_URL`. The async functions
  (`listProducts`, `getProduct`, `getFacets`) will fetch from the API; the
  `*Sync` variants remain for build-time prerendering of the mock catalogue
  (point them at a generated snapshot, or prebuild from the API, for production).

### Compliance is enforced in the model

- `Product.compliance.singleUseDisposable` is typed as the literal `false` — a
  **single-use disposable cannot be added** to the catalogue, and `api.ts`
  filters them out as defence in depth.
- `compliance.mhraNotified` is surfaced on product pages.
- Copy is factual only: no promotional language, discounts, countdowns or
  health claims. Keep new copy in the same register.

---

## SEO & technical notes

- **Per-page meta / OG / canonical / JSON-LD** via the `<Seo>` component
  ([`src/lib/seo/Seo.tsx`](src/lib/seo/Seo.tsx)), prerendered into static HTML.
- **JSON-LD schemas:** `Store`/`LocalBusiness`, `Organization`, `Product` +
  `Offer`, `FAQPage`, `BreadcrumbList`
  ([`src/lib/seo/jsonld.ts`](src/lib/seo/jsonld.ts)).
- **sitemap.xml + robots.txt** generated post-build by
  [`scripts/generate-sitemap.mjs`](scripts/generate-sitemap.mjs). It walks the
  built output and **excludes any `noindex` page** automatically; the origin is
  read from the prerendered canonical so it matches `VITE_SITE_URL`.
- **Age gate is crawler-safe:** all content is in the static HTML; the gate is a
  client-only overlay that never removes content from the DOM, emits no
  `noindex`, and is skipped for known crawler/preview user-agents
  ([`src/lib/age/useAgeGate.ts`](src/lib/age/useAgeGate.ts)).
- **Performance:** route-level code-splitting (lazy routes), lazy-loaded images
  with explicit dimensions (no CLS), eager LCP logo, CSS code-split. Swap product
  placeholders for real WebP/AVIF assets in `Product.images`.
- **Analytics:** GA4 **placeholder only**, disabled unless
  `VITE_GA4_MEASUREMENT_ID` is set. **No Google Ads / Meta pixels** anywhere by
  design. Add consent gating in [`src/lib/analytics/ga.ts`](src/lib/analytics/ga.ts)
  before enabling in production.

---

## Accessibility

Skip link, semantic landmarks, labelled controls, visible focus rings
(`:focus-visible` with an accent ring), `aria-live` for the postcode result,
keyboard-operable disclosure menus, `prefers-reduced-motion` handling, and
AA-contrast colour choices throughout.

---

## Legal / compliance disclaimer

The legal pages in [`src/data/legal.ts`](src/data/legal.ts) contain **placeholder
template copy** to make the pages render. It is **not legal advice** — have a
qualified professional review and adapt all policy text, and confirm the company
number, VAT number and registered address, before going live.
