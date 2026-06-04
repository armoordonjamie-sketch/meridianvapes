import type { ReactNode } from 'react'

type Tone = 'default' | 'accent' | 'success' | 'muted' | 'warning'

const tones: Record<Tone, string> = {
  default: 'bg-white/[0.06] text-silver-200 border-white/10',
  accent: 'bg-accent-500/10 text-accent-300 border-accent-500/30',
  success: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  warning: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  muted: 'bg-white/[0.03] text-silver-400 border-white/10',
}

export function Badge({
  children,
  tone = 'default',
  className = '',
}: {
  children: ReactNode
  tone?: Tone
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
