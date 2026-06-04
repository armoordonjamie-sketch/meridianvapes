/**
 * Catalogue domain types.
 *
 * These types are the contract between the UI and the data source. The mock
 * catalogue in `products.ts` and the (future) FastAPI response in `api.ts`
 * both satisfy `Product`, so swapping the data source touches no component.
 */

export type CategorySlug =
  | 'pod-kits'
  | 'prefilled-pods'
  | 'e-liquids'
  | 'pods-coils'
  | 'nic-shots'
  | 'accessories'

export type FlavourFamily =
  | 'fruit'
  | 'menthol'
  | 'mint'
  | 'tobacco'
  | 'dessert'
  | 'beverage'
  | 'unflavoured'

export type DeviceType =
  | 'pod-system'
  | 'vape-pen'
  | 'mod-kit'
  | 'coil'
  | 'not-applicable'

/** VG/PG ratio as whole percentages (should sum to 100). */
export interface VgPgRatio {
  vg: number
  pg: number
}

export interface ProductImage {
  /** Path under /public, ideally a WebP/AVIF asset. Empty => branded placeholder. */
  src: string
  alt: string
  width?: number
  height?: number
}

export interface ProductSpec {
  label: string
  value: string
}

export interface ProductCompliance {
  /** MHRA-notified under the TPD. Surfaced on the product page. */
  mhraNotified: boolean
  /**
   * Single-use disposable. Excluded from the catalogue by design.
   * Typed as the literal `false` so a disposable product cannot be added.
   */
  singleUseDisposable: false
  /** Whether the product contains nicotine (drives 18+ / nicotine notices). */
  containsNicotine: boolean
}

export interface Product {
  id: string
  slug: string
  name: string
  brand: string
  category: CategorySlug
  deviceType: DeviceType
  flavourFamily?: FlavourFamily
  /** Nicotine strength in mg/ml. 0 = nicotine-free. Omit for hardware. */
  nicotineStrengthMg?: number
  /** VG/PG ratio for e-liquids and nic shots. Omit for hardware. */
  vgPg?: VgPgRatio
  /** Liquid volume in ml where applicable (bottle / pod / shot). */
  volumeMl?: number
  /**
   * True for prefilled (closed) pods: the device is reusable/rechargeable but
   * the pod comes pre-filled and is NOT user-refillable. Distinct from a
   * single-use disposable (`compliance.singleUseDisposable`), which is never
   * stocked.
   */
  prefilled?: boolean
  /** Manufacturer puff estimate for a prefilled pod (e.g. 10000). */
  puffRating?: number
  /** Price including UK VAT, stored in integer pence to avoid float errors. */
  priceIncVatPence: number
  currency: 'GBP'
  inStock: boolean
  /** Optional remaining stock count, used for "low stock" display only. */
  stockQty?: number
  /** One-line factual summary used on cards. */
  shortDescription: string
  /** Full factual description used on the product page. */
  description: string
  specs?: ProductSpec[]
  images: ProductImage[]
  compliance: ProductCompliance
}

/** Facet filters supported by the shop UI. */
export interface CatalogueFilters {
  category?: CategorySlug
  brands?: string[]
  flavourFamilies?: FlavourFamily[]
  deviceTypes?: DeviceType[]
  /** Nicotine strengths in mg/ml to include. */
  strengthsMg?: number[]
  /** Free-text search across name / brand / description. */
  query?: string
}

/** Distinct facet values available for building the filter UI. */
export interface CatalogueFacets {
  brands: string[]
  flavourFamilies: FlavourFamily[]
  deviceTypes: DeviceType[]
  strengthsMg: number[]
}
