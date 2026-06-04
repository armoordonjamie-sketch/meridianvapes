import { ShieldCheck } from 'lucide-react'
import { MINIMUM_AGE } from '@/config/site'

/**
 * Prominent, tasteful 18+ messaging. Used on product pages and key surfaces.
 * Variant "inline" is compact; "banner" is a full-width band.
 */
export function AgeNotice({ variant = 'inline' }: { variant?: 'inline' | 'banner' }) {
  if (variant === 'banner') {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-accent-500/30 bg-accent-500/[0.06] p-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent-300" aria-hidden="true" />
        <p className="text-sm leading-relaxed text-silver-200">
          <span className="font-semibold text-silver-50">{MINIMUM_AGE}+ only.</span>{' '}
          It is illegal to sell vaping products to anyone under {MINIMUM_AGE}. Age is
          verified at checkout and an ID check is carried out on delivery. Orders are
          never left unattended.
        </p>
      </div>
    )
  }

  return (
    <p className="inline-flex items-center gap-2 text-sm text-silver-400">
      <ShieldCheck className="h-4 w-4 text-accent-300" aria-hidden="true" />
      <span>
        <span className="font-semibold text-silver-200">{MINIMUM_AGE}+ only.</span> Age
        verified at checkout and on delivery.
      </span>
    </p>
  )
}
