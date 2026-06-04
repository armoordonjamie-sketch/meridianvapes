import { Head } from 'vite-react-ssg'
import { siteConfig } from '@/config/site'

export interface SeoProps {
  /** Page title (brand suffix added automatically unless `rawTitle`). */
  title: string
  description: string
  /** Route path beginning with "/" — used for the canonical URL. */
  path: string
  /** Absolute or root-relative OG image. Defaults to the brand OG image. */
  image?: string
  /** og:type, defaults to "website". Product pages use "product". */
  type?: 'website' | 'article' | 'product'
  /** When true, emits a noindex robots tag (e.g. account pages). */
  noindex?: boolean
  /** Use the title verbatim (no " · Meridian Vapes" suffix). */
  rawTitle?: boolean
  /** One or more JSON-LD objects to embed. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

/**
 * Per-page <head> management: title, meta description, canonical, Open Graph,
 * Twitter card, robots and JSON-LD. Rendered into the static HTML at build
 * time by vite-react-ssg (via react-helmet-async), so crawlers see complete
 * metadata without executing JavaScript.
 */
export function Seo({
  title,
  description,
  path,
  image = siteConfig.ogImage,
  type = 'website',
  noindex = false,
  rawTitle = false,
  jsonLd,
}: SeoProps) {
  const fullTitle = rawTitle ? title : `${title} · ${siteConfig.name}`
  const canonical = `${siteConfig.url}${path === '/' ? '' : path}` || siteConfig.url
  const ogImage = image.startsWith('http') ? image : `${siteConfig.url}${image}`
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []

  return (
    <Head>
      <html lang="en-GB" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {noindex ? (
        <meta name="robots" content="noindex, follow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large" />
      )}

      {/* Open Graph */}
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:locale" content={siteConfig.locale} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD structured data */}
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Head>
  )
}
