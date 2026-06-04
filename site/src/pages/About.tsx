import { BadgeCheck, Leaf, MapPin, ShieldCheck } from 'lucide-react'
import { Seo } from '@/lib/seo/Seo'
import { PageHeader } from '@/components/common/PageHeader'
import { AgeNotice } from '@/components/common/AgeNotice'
import { breadcrumbSchema, localBusinessSchema } from '@/lib/seo/jsonld'
import { siteConfig } from '@/config/site'

const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
]

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Age verification, taken seriously',
    text: 'Every order is age-checked at checkout and again on the doorstep. We operate a Challenge 25 approach.',
  },
  {
    icon: Leaf,
    title: 'Reusable, not disposable',
    text: 'We stock refillable and reusable pod systems, e-liquids and accessories. We do not sell single-use disposable vapes.',
  },
  {
    icon: MapPin,
    title: 'Genuinely local',
    text: 'We fulfil and deliver locally across Eltham and South East London, within published windows.',
  },
  {
    icon: BadgeCheck,
    title: 'Factual product information',
    text: 'Strengths, ratios and specifications only. We don’t make health claims about vaping.',
  },
]

export default function About() {
  return (
    <>
      <Seo
        title="About"
        description={`About ${siteConfig.name} — an age-verified local vape delivery service for Eltham and South East London, stocking refillable devices, e-liquids and accessories.`}
        path="/about"
        jsonLd={[localBusinessSchema(), breadcrumbSchema(crumbs)]}
      />

      <PageHeader
        eyebrow="About"
        title="About Meridian Vapes"
        intro="A local, age-verified vape delivery service for Eltham and the surrounding South East London area."
        crumbs={crumbs}
      />

      <div className="container-page py-12">
        <div className="prose-mv max-w-3xl">
          <p>
            Meridian Vapes is a local delivery service for adult vapers in Eltham and the
            surrounding South East London area. We focus on doing a few things well:
            stocking a clear, refillable-first range, providing factual product
            information, and handling age verification properly.
          </p>
          <p>
            Orders are fulfilled locally and brought to your door within published
            delivery windows. Because everything we sell is age-restricted, we verify age
            at checkout and our drivers carry out an ID check on delivery. Orders are
            never left unattended.
          </p>
          <h2>What we stock</h2>
          <p>
            Our range covers refillable pod kits, reusable prefilled-pod devices,
            nicotine salt and shortfill e-liquids, replacement pods and coils, nicotine
            shots, and accessories such as chargers and cables. We do not sell single-use
            disposable vapes.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {VALUES.map((v) => (
            <div key={v.title} className="surface flex items-start gap-4 rounded-2xl p-6">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-500/10 text-accent-300">
                <v.icon className="h-5 w-5" aria-hidden="true" strokeWidth={1.75} />
              </span>
              <div>
                <h3 className="font-semibold text-silver-50">{v.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-silver-400">{v.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 max-w-3xl">
          <AgeNotice variant="banner" />
        </div>
      </div>
    </>
  )
}
