/**
 * Single source of truth for site-wide configuration.
 *
 * Everything here is read from VITE_* environment variables (see .env.example)
 * with safe placeholder fallbacks so the app builds and runs out of the box.
 *
 * NAP (Name / Address / Phone) is consumed by the footer, the contact page,
 * the LocalBusiness JSON-LD and the structured-data builders. Change it ONCE
 * here and it stays consistent everywhere — important for local SEO.
 */

const env = import.meta.env

function pick(value: string | undefined, fallback: string): string {
  return value && value.trim().length > 0 ? value.trim() : fallback
}

export const siteConfig = {
  /** Canonical, absolute site origin (no trailing slash). */
  url: pick(env.VITE_SITE_URL, 'https://www.meridianvapes.co.uk').replace(/\/$/, ''),
  name: pick(env.VITE_SITE_NAME, 'Meridian Vapes'),
  shortName: 'Meridian Vapes',
  tagline: 'Age-verified vape delivery in Eltham & South East London',
  description:
    'Meridian Vapes provides age-verified local delivery of pod kits, e-liquids, pods, coils and nic shots across Eltham and South East London. 18+ only.',
  locale: 'en_GB',
  /** Brand accent, mirrored from tailwind.config.ts for use in JSON-LD/meta. */
  themeColor: '#0A0B0D',
  accentColor: '#0081FD',

  /** Open Graph / Twitter card image (absolute path under /public). */
  ogImage: '/og/meridian-vapes-og.jpg',

  /** Brand logo assets (transparent PNGs copied from /logo). */
  assets: {
    logoCombined: '/brand/meridian-vapes-combined-transparent.png',
    logoMark: '/brand/meridian-vapes-logo-only-transparent.png',
    logoWordmark: '/brand/meridian-vapes-text-only-transparent.png',
  },
} as const

/** Company / NAP details. Placeholders until real company data is supplied. */
export const company = {
  legalName: pick(env.VITE_COMPANY_LEGAL_NAME, 'Meridian Vapes Ltd'),
  companyNumber: pick(env.VITE_COMPANY_NUMBER, '00000000'),
  vatNumber: pick(env.VITE_VAT_NUMBER, 'GB 000 0000 00'),
  email: pick(env.VITE_CONTACT_EMAIL, 'hello@meridianvapes.co.uk'),
  phone: pick(env.VITE_CONTACT_PHONE, '+44 20 0000 0000'),
  address: {
    street: pick(env.VITE_ADDRESS_STREET, '1 Example Street'),
    locality: pick(env.VITE_ADDRESS_LOCALITY, 'Eltham'),
    region: pick(env.VITE_ADDRESS_REGION, 'London'),
    postcode: pick(env.VITE_ADDRESS_POSTCODE, 'SE9 0AA'),
    country: pick(env.VITE_ADDRESS_COUNTRY, 'GB'),
  },
} as const

/** Formatted one-line postal address for display. */
export const formattedAddress = [
  company.address.street,
  company.address.locality,
  company.address.region,
  company.address.postcode,
].join(', ')

/** Provider selection (read by the payment + age-verification factories). */
export const providers = {
  payments: pick(env.VITE_PAYMENTS_PROVIDER, 'stub'),
  paymentsPublicKey: pick(env.VITE_PAYMENTS_PUBLIC_KEY, ''),
  age: pick(env.VITE_AGE_PROVIDER, 'stub'),
  agePublicKey: pick(env.VITE_AGE_PROVIDER_PUBLIC_KEY, ''),
} as const

/** API base URL for the FastAPI backend (empty => use in-repo mock data). */
export const apiBaseUrl = pick(env.VITE_API_BASE_URL, '')

/** GA4 measurement id (empty => analytics disabled). No ad pixels by design. */
export const ga4MeasurementId = pick(env.VITE_GA4_MEASUREMENT_ID, '')

/** Legal minimum age for purchase in the UK. */
export const MINIMUM_AGE = 18
