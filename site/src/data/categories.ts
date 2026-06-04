import type { CategorySlug } from '@/lib/catalogue/types'

/**
 * Category metadata. Pure data (no React) so it can be imported safely at
 * build time by the SSG route generator and the sitemap script.
 * Icons are mapped from `slug` in the UI (see components/ui/CategoryIcon.tsx).
 */
export interface Category {
  slug: CategorySlug
  name: string
  /** Short factual blurb for cards and category headers. */
  blurb: string
  /** Longer factual intro shown at the top of the category page. */
  intro: string
  seoTitle: string
  metaDescription: string
}

export const CATEGORIES: Category[] = [
  {
    slug: 'pod-kits',
    name: 'Pod Kits',
    blurb: 'Refillable pod systems, vape pens and mod kits.',
    intro:
      'Refillable devices including pod systems, vape pens and mod kits. All devices are refillable; single-use disposables are not stocked.',
    seoTitle: 'Pod Kits & Vape Devices',
    metaDescription:
      'Refillable pod kits, vape pens and mod kits available for age-verified local delivery in Eltham and South East London.',
  },
  {
    slug: 'prefilled-pods',
    name: 'Prefilled Pods',
    blurb: 'Reusable pod devices with replaceable prefilled pods.',
    intro:
      'Reusable, rechargeable pod devices that take replaceable prefilled (closed) pods. The device is kept and recharged; only the pod is replaced. These are not single-use disposables, which are not stocked.',
    seoTitle: 'Prefilled Pod Kits',
    metaDescription:
      'Reusable prefilled pod kits with rechargeable devices and replaceable closed pods, available for age-verified local delivery in Eltham and South East London.',
  },
  {
    slug: 'e-liquids',
    name: 'E-Liquids',
    blurb: 'Nic salt and shortfill e-liquids in a range of strengths.',
    intro:
      'Nicotine salt and shortfill e-liquids in a range of strengths and VG/PG ratios. All bottles are supplied child-resistant and tamper-evident.',
    seoTitle: 'E-Liquids',
    metaDescription:
      'Nic salt and shortfill e-liquids in a range of strengths and flavours, available for age-verified local delivery in Eltham and South East London.',
  },
  {
    slug: 'pods-coils',
    name: 'Pods & Coils',
    blurb: 'Replacement pods and coils for compatible devices.',
    intro:
      'Replacement pods and coils for compatible refillable devices. Check device compatibility before ordering.',
    seoTitle: 'Replacement Pods & Coils',
    metaDescription:
      'Replacement pods and coils for compatible refillable vape devices, available for age-verified local delivery in Eltham and South East London.',
  },
  {
    slug: 'nic-shots',
    name: 'Nic Shots',
    blurb: 'Unflavoured nicotine shots for shortfill e-liquids.',
    intro:
      'Unflavoured nicotine shots used to add nicotine to shortfill e-liquids. Supplied child-resistant and tamper-evident.',
    seoTitle: 'Nicotine Shots',
    metaDescription:
      'Unflavoured 18mg nicotine shots for shortfill e-liquids, available for age-verified local delivery in Eltham and South East London.',
  },
  {
    slug: 'accessories',
    name: 'Accessories',
    blurb: 'Chargers, cables, batteries and cases.',
    intro:
      'Accessories for refillable devices, including chargers, cables and battery chargers. Read the safety information supplied with batteries.',
    seoTitle: 'Vaping Accessories',
    metaDescription:
      'Chargers, cables and battery accessories for refillable vape devices, available for age-verified local delivery in Eltham and South East London.',
  },
]

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug)
}
