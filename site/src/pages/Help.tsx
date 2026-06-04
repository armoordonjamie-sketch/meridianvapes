import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { Seo } from '@/lib/seo/Seo'
import { PageHeader } from '@/components/common/PageHeader'
import { breadcrumbSchema, faqPageSchema } from '@/lib/seo/jsonld'
import { FAQS } from '@/data/faq'

const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'Help', path: '/help' },
]

export default function Help() {
  return (
    <>
      <Seo
        title="Help & FAQ"
        description="Answers to common questions about ordering, age verification, delivery areas, windows and returns at Meridian Vapes."
        path="/help"
        jsonLd={[faqPageSchema(FAQS), breadcrumbSchema(crumbs)]}
      />

      <PageHeader
        eyebrow="Help"
        title="Help & frequently asked questions"
        intro="Answers to common questions about ordering, age verification and delivery."
        crumbs={crumbs}
      />

      <div className="container-page py-12">
        <div className="mx-auto max-w-3xl">
          <dl className="divide-y divide-white/[0.07] overflow-hidden rounded-2xl border border-white/[0.07]">
            {FAQS.map((faq, i) => (
              <details key={i} className="group bg-ink-900/40 open:bg-ink-900/70">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-left">
                  <dt className="font-semibold text-silver-100">{faq.question}</dt>
                  <ChevronDown
                    className="h-5 w-5 shrink-0 text-silver-500 transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <dd className="px-5 pb-5 text-silver-400">{faq.answer}</dd>
              </details>
            ))}
          </dl>

          <p className="mt-8 text-center text-silver-400">
            Can’t find what you’re looking for?{' '}
            <Link to="/contact" className="font-semibold text-accent-300 hover:underline">
              Contact us
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  )
}
