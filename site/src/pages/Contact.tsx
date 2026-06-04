import { useState } from 'react'
import { CheckCircle2, Clock, Mail, MapPin, Phone } from 'lucide-react'
import { Seo } from '@/lib/seo/Seo'
import { PageHeader } from '@/components/common/PageHeader'
import { breadcrumbSchema, localBusinessSchema } from '@/lib/seo/jsonld'
import { company, formattedAddress } from '@/config/site'

const crumbs = [
  { name: 'Home', path: '/' },
  { name: 'Contact', path: '/contact' },
]

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    // Stub: wire this to the FastAPI backend (transactional/support only).
    setSubmitted(true)
  }

  return (
    <>
      <Seo
        title="Contact"
        description="Contact Meridian Vapes for order support and enquiries. Details are used only to respond to your message."
        path="/contact"
        jsonLd={[localBusinessSchema(), breadcrumbSchema(crumbs)]}
      />

      <PageHeader
        eyebrow="Contact"
        title="Contact us"
        intro="For order support and general enquiries. We’ll use your details only to respond to your message — we don’t send marketing email."
        crumbs={crumbs}
      />

      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_360px]">
        {/* Form */}
        <div>
          {submitted ? (
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] p-6">
              <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-300" aria-hidden="true" />
              <div>
                <h2 className="text-lg font-semibold text-silver-50">Thanks — message received</h2>
                <p className="mt-1 text-silver-400">
                  This is a demonstration form. Connect it to the backend to deliver
                  enquiries. We’ll only use your details to reply.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="surface space-y-5 rounded-2xl p-6 sm:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="name" label="Your name" required>
                  <input id="name" name="name" type="text" required autoComplete="name" className={inputClass} />
                </Field>
                <Field id="email" label="Email" required>
                  <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} />
                </Field>
              </div>
              <Field id="order" label="Order reference (optional)">
                <input id="order" name="order" type="text" className={inputClass} />
              </Field>
              <Field id="message" label="How can we help?" required>
                <textarea id="message" name="message" required rows={5} className={`${inputClass} h-auto py-3`} />
              </Field>
              <p className="text-xs text-silver-500">
                We use your details only to respond to this enquiry. See our{' '}
                <a href="/privacy" className="text-accent-300 hover:underline">privacy policy</a>.
              </p>
              <button
                type="submit"
                className="inline-flex h-12 items-center rounded-xl bg-accent-600 px-6 font-semibold text-white transition-colors hover:bg-accent-500"
              >
                Send message
              </button>
            </form>
          )}
        </div>

        {/* Details */}
        <aside className="space-y-4">
          <div className="surface rounded-2xl p-6">
            <h2 className="text-lg font-bold">Get in touch</h2>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-accent-300" aria-hidden="true" />
                <a href={`mailto:${company.email}`} className="text-silver-300 hover:text-accent-300">
                  {company.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-accent-300" aria-hidden="true" />
                <a href={`tel:${company.phone.replace(/\s+/g, '')}`} className="text-silver-300 hover:text-accent-300">
                  {company.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent-300" aria-hidden="true" />
                <span className="not-italic text-silver-300">{formattedAddress}</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-accent-300" aria-hidden="true" />
                <span className="text-silver-300">Support: Mon–Sat, 12:00–20:00</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </>
  )
}

const inputClass =
  'h-12 w-full rounded-xl border border-white/12 bg-ink-850 px-3 text-silver-100 placeholder:text-silver-500'

function Field({
  id,
  label,
  required,
  children,
}: {
  id: string
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-silver-200">
        {label}
        {required && <span className="ml-0.5 text-accent-400">*</span>}
      </label>
      {children}
    </div>
  )
}
