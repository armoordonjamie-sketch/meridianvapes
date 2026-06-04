import { useState } from 'react'
import { CategoryIcon } from '@/components/ui/CategoryIcon'
import { heroProductImage } from '@/lib/catalogue/hero-images'
import type { Product } from '@/lib/catalogue/types'

/**
 * Product imagery with a graceful, on-brand placeholder.
 *
 * Mock products ship with no photos (`images: []`). Until real WebP/AVIF
 * assets are added, this renders a calm branded panel with the category icon
 * — no broken images, no layout shift (the panel is a fixed aspect ratio).
 * Real images are lazy-loaded with explicit dimensions.
 */
export function ProductMedia({
  product,
  className = '',
  priority = false,
  variant = 'card',
}: {
  product: Product
  className?: string
  priority?: boolean
  /** `hero` — transparent cutout, no card frame (homepage composition). */
  variant?: 'card' | 'hero'
}) {
  const hero = variant === 'hero' ? heroProductImage(product.slug, product.name) : undefined
  const catalogue = product.images[0]
  const primary = hero ?? catalogue

  const [src, setSrc] = useState(primary?.src ?? '')
  const [failed, setFailed] = useState(false)

  const fallbackSrc = hero && catalogue?.src && catalogue.src !== hero.src ? catalogue.src : undefined

  if (primary?.src && !failed) {
    const imgClass =
      variant === 'hero'
        ? `block h-full w-full object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,0.55)] ${className}`
        : `aspect-square w-full rounded-2xl object-cover ${className}`

    return (
      <img
        src={src || primary.src}
        alt={variant === 'hero' ? '' : primary.alt}
        width={primary.width}
        height={primary.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        aria-hidden={variant === 'hero' ? true : undefined}
        className={imgClass}
        onError={() => {
          if (fallbackSrc && src !== fallbackSrc) {
            setSrc(fallbackSrc)
            return
          }
          setFailed(true)
        }}
      />
    )
  }

  if (variant === 'hero') return null

  return (
    <div
      className={`relative grid aspect-square w-full place-items-center overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-ink-800 to-ink-900 ${className}`}
      role="img"
      aria-label={`${product.name} (image coming soon)`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(60% 60% at 50% 40%, rgba(0,129,253,0.10), transparent 70%)',
        }}
      />
      <CategoryIcon slug={product.category} className="h-14 w-14 text-silver-500" />
    </div>
  )
}
