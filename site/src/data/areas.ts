/**
 * Local SEO landing-page data for delivery areas.
 * Factual only — coverage and logistics, no promotional language.
 * Imported at build time to prerender /areas/[slug] pages and the sitemap.
 */
export interface Area {
  slug: string
  /** Display name of the area. */
  name: string
  /** Primary postcode district(s) covered. */
  postcodeDistricts: string[]
  /** Factual one-line summary used in meta description. */
  summary: string
  /** Body paragraphs (factual coverage / logistics information). */
  paragraphs: string[]
}

export const AREAS: Area[] = [
  {
    slug: 'eltham',
    name: 'Eltham',
    postcodeDistricts: ['SE9'],
    summary:
      'Age-verified vape delivery in Eltham (SE9), including refillable pod kits, e-liquids, pods, coils and nic shots.',
    paragraphs: [
      'Meridian Vapes delivers to addresses across Eltham and the SE9 postcode district. Orders are fulfilled locally and brought to your door within the published delivery windows.',
      'Every delivery requires age verification. The person receiving the order must be 18 or over and able to show valid photo ID at the doorstep. Orders cannot be left unattended.',
      'The catalogue covers refillable pod kits, e-liquids, replacement pods and coils, nicotine shots and accessories. Single-use disposable products are not stocked.',
    ],
  },
  {
    slug: 'mottingham',
    name: 'Mottingham',
    postcodeDistricts: ['SE9'],
    summary:
      'Age-verified vape delivery in Mottingham (SE9), with doorstep ID checks and local delivery windows.',
    paragraphs: [
      'Meridian Vapes delivers to Mottingham and surrounding SE9 addresses. Deliveries are made locally within the published windows.',
      'All orders are age-restricted. A person aged 18 or over must be present to accept the delivery and show valid photo ID. Orders cannot be left unattended.',
      'Stock includes refillable pod kits, e-liquids, pods and coils, nicotine shots and accessories. Disposable single-use products are not sold.',
    ],
  },
  {
    slug: 'new-eltham',
    name: 'New Eltham',
    postcodeDistricts: ['SE9'],
    summary:
      'Age-verified vape delivery in New Eltham (SE9), including e-liquids, pod kits, pods, coils and nic shots.',
    paragraphs: [
      'Meridian Vapes delivers to New Eltham and nearby SE9 addresses, fulfilling orders locally within the published delivery windows.',
      'Deliveries are age-restricted. The recipient must be 18 or over and able to present valid photo ID at the doorstep. Orders are not left unattended.',
      'The range includes refillable devices, e-liquids, replacement pods and coils, nicotine shots and accessories. Single-use disposables are excluded by design.',
    ],
  },
  {
    slug: 'sidcup',
    name: 'Sidcup',
    postcodeDistricts: ['DA14', 'DA15'],
    summary:
      'Age-verified vape delivery in Sidcup (DA14, DA15), with doorstep ID verification and local delivery windows.',
    paragraphs: [
      'Meridian Vapes delivers to parts of Sidcup within the DA14 and DA15 postcode districts. Check your postcode at checkout to confirm coverage and available windows.',
      'All deliveries require age verification. A person aged 18 or over must accept the order and show valid photo ID. Orders cannot be left unattended.',
      'Available products include refillable pod kits, e-liquids, pods and coils, nicotine shots and accessories. No single-use disposable products are stocked.',
    ],
  },
]

export function getArea(slug: string): Area | undefined {
  return AREAS.find((a) => a.slug === slug)
}
