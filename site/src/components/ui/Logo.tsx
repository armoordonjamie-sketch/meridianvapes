import { siteConfig } from '@/config/site'

type Variant = 'combined' | 'mark' | 'wordmark'

/** Intrinsic dimensions of the source PNGs (for correct aspect ratio / no CLS). */
const SOURCES: Record<Variant, { src: string; width: number; height: number; alt: string }> = {
  combined: {
    src: siteConfig.assets.logoCombined,
    width: 1254,
    height: 1254,
    alt: `${siteConfig.name} logo`,
  },
  mark: {
    src: siteConfig.assets.logoMark,
    width: 855,
    height: 929,
    alt: `${siteConfig.name} logo mark`,
  },
  wordmark: {
    src: siteConfig.assets.logoWordmark,
    width: 1147,
    height: 279,
    alt: `${siteConfig.name} wordmark`,
  },
}

export function Logo({
  variant = 'mark',
  className = '',
  eager = false,
  decorative = false,
}: {
  variant?: Variant
  className?: string
  /** Set true for above-the-fold logos (header) so they aren't lazy-loaded. */
  eager?: boolean
  /** When the logo sits inside a labelled link, mark the image decorative. */
  decorative?: boolean
}) {
  const s = SOURCES[variant]
  return (
    <img
      src={s.src}
      width={s.width}
      height={s.height}
      alt={decorative ? '' : s.alt}
      aria-hidden={decorative || undefined}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
    />
  )
}
