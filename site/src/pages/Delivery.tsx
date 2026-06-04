import { Link } from 'react-router-dom'
import { Clock, IdCard, MapPin, PackageCheck } from 'lucide-react'
import { Seo } from '@/lib/seo/Seo'
import { PageHeader } from '@/components/common/PageHeader'
import { PostcodeChecker } from '@/components/layout/PostcodeChecker'
import { AgeNotice } from '@/components/common/AgeNotice'
import { breadcrumbSchema } from '@/lib/seo/jsonld'
import { AREAS } from '@/data/areas'

const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'Delivery', path: '/delivery' },
]

const WINDOWS = [
  { day: 'Monday – Friday', slots: '12:00 – 15:00, 17:00 – 21:00' },
  { day: 'Saturday', slots: '12:00 – 21:00' },
  { day: 'Sunday', slots: '14:00 – 19:00' },
]

const ID_STEPS = [
  'Our driver delivers to the address on the order.',
  'The person receiving the order must be 18 or over.',
  'Valid photo ID (passport, UK/EU driving licence or PASS-accredited card) is checked at the door.',
  'If ID cannot be shown or the recipient appears under 18, the order will not be handed over.',
]

export default function Delivery() {
  return (
    <>
      <Seo
        title="Delivery"
        description="How Meridian Vapes delivers locally across Eltham and South East London: coverage area, delivery windows and the doorstep ID check."
        path="/delivery"
        jsonLd={breadcrumbSchema(crumbs)}
      />

      <PageHeader
        eyebrow="Delivery"
        title="Local delivery, with a doorstep ID check"
        intro="We deliver locally across Eltham and parts of South East London. Every order is age-restricted and checked on the doorstep."
        crumbs={crumbs}
      />

      <div className="container-page space-y-12 py-12">
        {/* Postcode checker */}
        <section className="surface rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-bold">Check your postcode</h2>
          <p className="mt-2 max-w-xl text-silver-400">
            Enter your postcode to confirm we deliver to your address. Available windows
            are shown at checkout.
          </p>
          <div className="mt-5">
            <PostcodeChecker id="delivery-postcode" />
          </div>
        </section>

        {/* Coverage + windows */}
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="surface rounded-2xl p-6 sm:p-8">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <MapPin className="h-5 w-5 text-accent-300" aria-hidden="true" />
              Coverage area
            </h2>
            <ul className="mt-4 space-y-3">
              {AREAS.map((a) => (
                <li
                  key={a.slug}
                  className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-ink-900/50 px-4 py-3"
                >
                  <Link to={`/areas/${a.slug}`} className="font-medium text-silver-100 hover:text-accent-300">
                    {a.name}
                  </Link>
                  <span className="text-sm text-silver-500">
                    {a.postcodeDistricts.join(', ')}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-silver-500">
              Coverage can vary by street. Confirm at checkout with your full postcode.
            </p>
          </div>

          <div className="surface rounded-2xl p-6 sm:p-8">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <Clock className="h-5 w-5 text-accent-300" aria-hidden="true" />
              Delivery windows
            </h2>
            <ul className="mt-4 divide-y divide-white/[0.07]">
              {WINDOWS.map((w) => (
                <li key={w.day} className="flex items-center justify-between py-3">
                  <span className="font-medium text-silver-100">{w.day}</span>
                  <span className="text-sm text-silver-400">{w.slots}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-silver-500">
              Windows are indicative and confirmed for your address at checkout.
            </p>
          </div>
        </section>

        {/* Doorstep ID check */}
        <section className="surface rounded-2xl p-6 sm:p-8">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <IdCard className="h-5 w-5 text-accent-300" aria-hidden="true" />
            The doorstep ID check
          </h2>
          <p className="mt-2 max-w-2xl text-silver-400">
            In addition to age verification at checkout, we operate a Challenge 25
            approach on delivery.
          </p>
          <ol className="mt-5 space-y-3">
            {ID_STEPS.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent-500/10 text-sm font-bold text-accent-300">
                  {i + 1}
                </span>
                <span className="pt-0.5 text-silver-300">{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-5 flex items-center gap-2 text-sm text-silver-400">
            <PackageCheck className="h-4 w-4 text-accent-300" aria-hidden="true" />
            Orders are never left unattended or with a neighbour.
          </p>
        </section>

        <AgeNotice variant="banner" />
      </div>
    </>
  )
}
