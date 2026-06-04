// @ts-check
/**
 * Generates dist/sitemap.xml and dist/robots.txt AFTER the SSG build.
 *
 * It walks the prerendered output for `index.html` files, derives each route
 * from the directory structure, and skips any page that emitted a `noindex`
 * robots meta tag (cart, checkout, account, 404). The canonical origin is read
 * from the home page's <link rel="canonical">, so it always matches the
 * VITE_SITE_URL the site was built with.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const DIST = 'dist'
const FALLBACK_ORIGIN = 'https://www.meridianvapes.co.uk'

/** Recursively collect every index.html path under dist. */
function findIndexHtml(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) findIndexHtml(full, acc)
    else if (name === 'index.html') acc.push(full)
  }
  return acc
}

/** Turn dist/shop/pod-kits/index.html into the route "/shop/pod-kits". */
function routeFromFile(file) {
  const rel = relative(DIST, file).split(sep).join('/')
  const route = '/' + rel.replace(/index\.html$/, '').replace(/\/$/, '')
  return route === '/' ? '/' : route
}

function isNoindex(html) {
  return /<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)
}

function originFromHome(homeHtml) {
  const m = homeHtml.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
  if (!m) return FALLBACK_ORIGIN
  try {
    return new URL(m[1]).origin
  } catch {
    return FALLBACK_ORIGIN
  }
}

function main() {
  const files = findIndexHtml(DIST)
  const today = new Date().toISOString().slice(0, 10)

  const homeFile = files.find((f) => routeFromFile(f) === '/')
  const origin = homeFile ? originFromHome(readFileSync(homeFile, 'utf8')) : FALLBACK_ORIGIN

  const urls = []
  for (const file of files) {
    const html = readFileSync(file, 'utf8')
    if (isNoindex(html)) continue
    const route = routeFromFile(file)
    urls.push(origin + (route === '/' ? '/' : route))
  }
  urls.sort()

  const sitemap =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls
      .map(
        (loc) =>
          `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`,
      )
      .join('\n') +
    '\n</urlset>\n'

  writeFileSync(join(DIST, 'sitemap.xml'), sitemap, 'utf8')

  const robots = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /account',
    'Disallow: /cart',
    'Disallow: /checkout',
    '',
    `Sitemap: ${origin}/sitemap.xml`,
    '',
  ].join('\n')

  writeFileSync(join(DIST, 'robots.txt'), robots, 'utf8')

  console.log(`sitemap.xml: ${urls.length} indexable URLs (origin ${origin})`)
}

main()
