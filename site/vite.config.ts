import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { fileURLToPath, URL } from 'node:url'
import type { RouteRecord } from 'vite-react-ssg'

/**
 * Vite + vite-react-ssg configuration.
 *
 * The site is fully prerendered to static HTML at build time (one .html file
 * per route) for SEO. Dynamic routes (products + area landing pages) are
 * expanded by `ssgOptions.includedRoutes` below so every slug gets its own
 * crawlable page.
 *
 * NOTE: keep this list of dynamic slugs in sync with the data sources in
 * `src/lib/catalogue` and `src/data/areas.ts`. They are imported here so there
 * is a single source of truth — add a product or area there and it is
 * prerendered automatically.
 */

// When serving the dev server through the HTTPS Cloudflare tunnel, set
// TUNNEL_HOST so the HMR websocket connects back over wss:443 via the public
// hostname. Plain local `npm run dev` (TUNNEL_HOST unset) keeps default HMR.
//   TUNNEL_HOST=www.meridianvapes.co.uk npm run dev
const tunnelHost = process.env.TUNNEL_HOST

// Set HTTPS=false to serve the dev server over plain HTTP instead.
const httpsDev = process.env.HTTPS !== 'false'

export default defineConfig(({ command }) => ({
  // basic-ssl serves the dev server over HTTPS with a self-signed certificate
  // so the Cloudflare tunnel can use an `https://localhost:5173` origin.
  // NOTE: the origin cert is self-signed, so set "No TLS Verify = On" for the
  // hostname's origin settings in Cloudflare (or `originRequest.noTLSVerify:
  // true` in config.yml). Only added for `vite`/`vite preview`, never the build.
  plugins: [
    react(),
    ...(command === 'serve' && httpsDev ? [basicSsl()] : []),
  ],
  server: {
    // Listen on all interfaces so cloudflared can reach the dev server.
    host: true,
    port: 5173,
    strictPort: true,
    // Allow the tunnel hostnames (leading "." also allows their subdomains).
    // Without this, Vite returns "Blocked request. This host is not allowed."
    allowedHosts: ['.meridianvapes.co.uk', '.tripointdiagnostics.co.uk'],
    hmr: tunnelHost
      ? { host: tunnelHost, clientPort: 443, protocol: 'wss' }
      : undefined,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
  },
  ssgOptions: {
    entry: 'src/main.tsx',
    script: 'async',
    // 'nested' => /shop/pod-kits/index.html, giving clean trailing-slash URLs
    // that any static host serves without rewrite rules.
    dirStyle: 'nested',
    // Expand dynamic route params into concrete prerendered pages.
    async includedRoutes(paths: string[], _routes: RouteRecord[]) {
      const { PRODUCTS } = await import('./src/lib/catalogue/products')
      const { CATEGORIES } = await import('./src/data/categories')
      const { AREAS } = await import('./src/data/areas')

      const productPaths = PRODUCTS.map((p) => `/product/${p.slug}`)
      const categoryPaths = CATEGORIES.map((c) => `/shop/${c.slug}`)
      const areaPaths = AREAS.map((a) => `/areas/${a.slug}`)

      // Keep every static route, drop the dynamic templates (":") and the
      // catch-all ("*" — not a valid filename), then add concrete paths.
      const staticPaths = paths.filter(
        (p) => !p.includes(':') && !p.includes('*'),
      )
      return Array.from(
        new Set([...staticPaths, ...categoryPaths, ...productPaths, ...areaPaths]),
      )
    },
  },
}))
