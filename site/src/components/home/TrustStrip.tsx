import { BadgeCheck, MapPin, RefreshCw, ShieldCheck } from 'lucide-react'
import { MINIMUM_AGE } from '@/config/site'

const ITEMS = [
  {
    icon: ShieldCheck,
    title: `${MINIMUM_AGE}+ verified`,
    text: 'Age checked at checkout and again on the doorstep.',
  },
  {
    icon: MapPin,
    title: 'Local delivery',
    text: 'Fulfilled locally across Eltham and South East London.',
  },
  {
    icon: RefreshCw,
    title: 'No disposables',
    text: 'Refillable and reusable pod systems — never single-use disposables.',
  },
  {
    icon: BadgeCheck,
    title: 'MHRA-notified',
    text: 'Notification status shown on each product page.',
  },
]

export function TrustStrip() {
  return (
    <section className="border-y border-white/[0.07] bg-ink-900/40">
      <div className="container-page grid grid-cols-1 gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((item) => (
          <div key={item.title} className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-500/10 text-accent-300">
              <item.icon className="h-5 w-5" aria-hidden="true" strokeWidth={1.75} />
            </span>
            <div>
              <p className="font-semibold text-silver-100">{item.title}</p>
              <p className="mt-0.5 text-sm text-silver-400">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
