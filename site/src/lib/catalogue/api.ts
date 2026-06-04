import { apiBaseUrl } from '@/config/site'
import { PRODUCTS } from './products'
import type {
  CatalogueFacets,
  CatalogueFilters,
  DeviceType,
  FlavourFamily,
  Product,
} from './types'

/**
 * Catalogue data access layer.
 *
 * Every component talks to the catalogue ONLY through these functions, never
 * by importing `products.ts` directly. That keeps the data source swappable:
 *
 *   - VITE_API_BASE_URL unset (default) -> in-repo mock catalogue.
 *   - VITE_API_BASE_URL set            -> fetch from the FastAPI backend.
 *
 * The functions are async on purpose so the signature does not change when the
 * real network-backed implementation is dropped in.
 *
 * SAFEGUARD: single-use disposables are filtered out here as well as being
 * impossible to express in the type — defence in depth for compliance.
 */

const usingApi = apiBaseUrl.length > 0

/** Remove any single-use disposable that somehow reached the catalogue. */
function compliant(products: Product[]): Product[] {
  return products.filter((p) => p.compliance.singleUseDisposable === false)
}

function applyFilters(products: Product[], filters: CatalogueFilters): Product[] {
  return products.filter((p) => {
    if (filters.category && p.category !== filters.category) return false
    if (filters.brands?.length && !filters.brands.includes(p.brand)) return false
    if (
      filters.flavourFamilies?.length &&
      (!p.flavourFamily || !filters.flavourFamilies.includes(p.flavourFamily))
    )
      return false
    if (
      filters.deviceTypes?.length &&
      !filters.deviceTypes.includes(p.deviceType)
    )
      return false
    if (
      filters.strengthsMg?.length &&
      (p.nicotineStrengthMg === undefined ||
        !filters.strengthsMg.includes(p.nicotineStrengthMg))
    )
      return false
    if (filters.query) {
      const q = filters.query.trim().toLowerCase()
      const haystack = `${p.name} ${p.brand} ${p.shortDescription}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })
}

function deriveFacets(products: Product[]): CatalogueFacets {
  const brands = new Set<string>()
  const flavourFamilies = new Set<FlavourFamily>()
  const deviceTypes = new Set<DeviceType>()
  const strengthsMg = new Set<number>()
  for (const p of products) {
    brands.add(p.brand)
    if (p.flavourFamily) flavourFamilies.add(p.flavourFamily)
    if (p.deviceType !== 'not-applicable') deviceTypes.add(p.deviceType)
    if (p.nicotineStrengthMg !== undefined) strengthsMg.add(p.nicotineStrengthMg)
  }
  return {
    brands: [...brands].sort(),
    flavourFamilies: [...flavourFamilies].sort(),
    deviceTypes: [...deviceTypes].sort(),
    strengthsMg: [...strengthsMg].sort((a, b) => a - b),
  }
}

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${apiBaseUrl}${path}`, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`Catalogue API error ${res.status} for ${path}`)
  return (await res.json()) as T
}

/** List products, optionally filtered. */
export async function listProducts(
  filters: CatalogueFilters = {},
): Promise<Product[]> {
  if (usingApi) {
    const qs = new URLSearchParams()
    if (filters.category) qs.set('category', filters.category)
    if (filters.query) qs.set('q', filters.query)
    if (filters.brands?.length) qs.set('brands', filters.brands.join(','))
    return compliant(await fetchJson<Product[]>(`/products?${qs.toString()}`))
  }
  return applyFilters(compliant(PRODUCTS), filters)
}

/** Synchronous mock list — used at build time for prerendering/sitemaps. */
export function listProductsSync(filters: CatalogueFilters = {}): Product[] {
  return applyFilters(compliant(PRODUCTS), filters)
}

/** Fetch a single product by slug, or null if not found. */
export async function getProduct(slug: string): Promise<Product | null> {
  if (usingApi) {
    try {
      return await fetchJson<Product>(`/products/${slug}`)
    } catch {
      return null
    }
  }
  return compliant(PRODUCTS).find((p) => p.slug === slug) ?? null
}

/** Synchronous single-product lookup for prerender-time rendering. */
export function getProductSync(slug: string): Product | null {
  return compliant(PRODUCTS).find((p) => p.slug === slug) ?? null
}

/** Distinct facet values for building the filter UI within a category. */
export async function getFacets(
  filters: CatalogueFilters = {},
): Promise<CatalogueFacets> {
  const products = await listProducts({ category: filters.category })
  return deriveFacets(products)
}

export function getFacetsSync(filters: CatalogueFilters = {}): CatalogueFacets {
  return deriveFacets(listProductsSync({ category: filters.category }))
}
