import { company, siteConfig } from '@/config/site'
import type { Product } from '@/lib/catalogue/types'

/**
 * JSON-LD structured-data builders. Each returns a plain object that the
 * <Seo> component serialises into a <script type="application/ld+json">.
 *
 * Schemas implemented: LocalBusiness/Store, Product, FAQPage, BreadcrumbList.
 */

const abs = (path: string) => `${siteConfig.url}${path.startsWith('/') ? path : `/${path}`}`

/** Store / LocalBusiness — the primary local-SEO entity. */
export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    '@id': `${siteConfig.url}/#store`,
    name: siteConfig.name,
    legalName: company.legalName,
    description: siteConfig.description,
    url: siteConfig.url,
    image: abs(siteConfig.ogImage),
    logo: abs(siteConfig.assets.logoCombined),
    telephone: company.phone,
    email: company.email,
    vatID: company.vatNumber,
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.address.street,
      addressLocality: company.address.locality,
      addressRegion: company.address.region,
      postalCode: company.address.postcode,
      addressCountry: company.address.country,
    },
    areaServed: [
      { '@type': 'City', name: 'Eltham' },
      { '@type': 'City', name: 'Mottingham' },
      { '@type': 'City', name: 'New Eltham' },
      { '@type': 'City', name: 'Sidcup' },
      { '@type': 'AdministrativeArea', name: 'South East London' },
    ],
    // Age-restricted retailer; informational only.
    slogan: siteConfig.tagline,
  }
}

/** Organization + WebSite (used on the home page). */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteConfig.url}/#organization`,
    name: company.legalName,
    url: siteConfig.url,
    logo: abs(siteConfig.assets.logoCombined),
    vatID: company.vatNumber,
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.address.street,
      addressLocality: company.address.locality,
      addressRegion: company.address.region,
      postalCode: company.address.postcode,
      addressCountry: company.address.country,
    },
  }
}

/** Product schema with an Offer. */
export function productSchema(product: Product) {
  const url = abs(`/product/${product.slug}`)
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.id,
    brand: { '@type': 'Brand', name: product.brand },
    category: product.category,
    image: product.images[0]?.src
      ? abs(product.images[0].src)
      : abs(siteConfig.ogImage),
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: product.currency,
      price: (product.priceIncVatPence / 100).toFixed(2),
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@id': `${siteConfig.url}/#store` },
    },
  }
}

/** FAQPage schema from FAQ items. */
export function faqPageSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.question,
      acceptedAnswer: { '@type': 'Answer', text: i.answer },
    })),
  }
}

/** BreadcrumbList from an ordered list of {name, path} crumbs. */
export function breadcrumbSchema(crumbs: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  }
}
