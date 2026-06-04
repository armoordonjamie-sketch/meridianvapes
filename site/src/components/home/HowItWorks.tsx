import { ClipboardCheck, MapPinned, ShieldCheck, Truck } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'

const STEPS = [
  {
    icon: ClipboardCheck,
    title: 'Choose your products',
    text: 'Browse refillable kits, e-liquids, pods, coils and nic shots, and add them to your basket.',
  },
  {
    icon: MapPinned,
    title: 'Enter your postcode',
    text: 'Confirm we deliver to your address and see the available local delivery windows.',
  },
  {
    icon: ShieldCheck,
    title: 'Verify your age',
    text: 'Complete the age-verification check at checkout. Orders are not dispatched until it passes.',
  },
  {
    icon: Truck,
    title: 'Doorstep delivery',
    text: 'A local driver delivers to your door and checks valid photo ID on handover.',
  },
]

export function HowItWorks() {
  return (
    <section className="border-y border-white/[0.07] bg-ink-900/40">
      <div className="container-page py-16">
        <SectionHeading
          eyebrow="How it works"
          title="Four steps from basket to doorstep"
        />
        <ol className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="relative rounded-2xl border border-white/[0.07] bg-ink-950/40 p-6"
            >
              <span className="absolute right-5 top-5 text-sm font-bold text-silver-700">
                0{i + 1}
              </span>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-500/10 text-accent-300">
                <step.icon className="h-5 w-5" aria-hidden="true" strokeWidth={1.75} />
              </span>
              <h3 className="mt-4 text-base font-semibold text-silver-50">
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-silver-400">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
