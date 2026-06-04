import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { CATEGORIES } from '@/data/categories'
import { company, formattedAddress, MINIMUM_AGE, siteConfig } from '@/config/site'

const COMPANY_LINKS = [
  { label: 'About', to: '/about' },
  { label: 'Delivery', to: '/delivery' },
  { label: 'Help & FAQ', to: '/help' },
  { label: 'Contact', to: '/contact' },
  { label: 'Account', to: '/account' },
]

const LEGAL_LINKS = [
  { label: 'Terms & Conditions', to: '/terms' },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Returns', to: '/returns' },
  { label: 'Delivery Policy', to: '/delivery-policy' },
  { label: 'Age Verification', to: '/age-verification' },
  { label: 'Cookies', to: '/cookies' },
  { label: 'Responsible Retailing', to: '/responsible-retailing' },
]

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { label: string; to: string }[]
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-silver-200">{title}</h2>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-sm text-silver-400 hover:text-accent-300">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t border-white/[0.07] bg-ink-900/40">
      {/* Prominent 18+ band */}
      <div className="border-b border-white/[0.07] bg-accent-600">
        <div className="container-page flex items-center justify-center gap-3 py-3 text-center">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/15 text-xs font-bold text-white">
            {MINIMUM_AGE}+
          </span>
          <p className="text-sm font-medium text-white">
            You must be {MINIMUM_AGE} or over to buy from Meridian Vapes. Age is verified
            at checkout and on delivery. Contains nicotine, an addictive substance.
          </p>
        </div>
      </div>

      <div className="container-page py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
          {/* Brand + contact */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" aria-label={`${siteConfig.name} home`} className="inline-flex">
              <Logo variant="combined" decorative className="h-16 w-auto" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-silver-400">
              {siteConfig.tagline}. Refillable and reusable pod systems, e-liquids and
              accessories — no single-use disposables.
            </p>
            <address className="mt-4 space-y-2 text-sm not-italic text-silver-400">
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-silver-500" aria-hidden="true" />
                <span>{formattedAddress}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-silver-500" aria-hidden="true" />
                <a href={`tel:${company.phone.replace(/\s+/g, '')}`} className="hover:text-accent-300">
                  {company.phone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-silver-500" aria-hidden="true" />
                <a href={`mailto:${company.email}`} className="hover:text-accent-300">
                  {company.email}
                </a>
              </p>
            </address>
          </div>

          <FooterColumn
            title="Shop"
            links={CATEGORIES.map((c) => ({ label: c.name, to: `/shop/${c.slug}` }))}
          />
          <FooterColumn title="Company" links={COMPANY_LINKS} />
          <div className="col-span-2 lg:col-span-1">
            <FooterColumn title="Legal" links={LEGAL_LINKS} />
          </div>
        </div>

        {/* Statutory company details */}
        <div className="mt-12 border-t border-white/[0.07] pt-6 text-sm text-silver-500">
          <p>
            {company.legalName} — Registered in England &amp; Wales. Company No.{' '}
            <span className="text-silver-400">{company.companyNumber}</span>. VAT No.{' '}
            <span className="text-silver-400">{company.vatNumber}</span>. Registered
            office: {formattedAddress}.
          </p>
          <p className="mt-3">
            © {year} {company.legalName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
