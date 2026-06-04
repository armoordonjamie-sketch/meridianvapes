import type { ProductImage } from './types'

import heroIvg from '../../assets/hero/ivg-pro-rainbow-burst-vape-kit.png'
import heroStrawberry from '../../assets/hero/strawberry-nic-salt-10ml.png'
import heroXros from '../../assets/hero/vaporesso-xros-5-pod-kit.png'

const SIZE = 800

/** Bundled transparent hero cutouts (see scripts/hero-product-cutouts.mjs). */
const HERO_SRC_BY_SLUG: Record<string, string> = {
  'ivg-pro-rainbow-burst-vape-kit': heroIvg,
  'vaporesso-xros-5-pod-kit': heroXros,
  'strawberry-nic-salt-10ml': heroStrawberry,
}

/** Hero composition — background removed, bundled so dev/preview always resolve. */
export function heroProductImage(slug: string, alt: string): ProductImage | undefined {
  const src = HERO_SRC_BY_SLUG[slug]
  if (!src) return undefined
  return { src, alt, width: SIZE, height: SIZE }
}
