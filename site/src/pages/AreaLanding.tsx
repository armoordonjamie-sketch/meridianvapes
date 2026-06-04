import { Link, useParams } from 'react-router-dom'
import { ArrowRight, MapPin } from 'lucide-react'
import { Seo } from '@/lib/seo/Seo'
import { PageHeader } from '@/components/common/PageHeader'
import { PostcodeChecker } from '@/components/layout/PostcodeChecker'
import { AgeNotice } from '@/components/common/AgeNotice'
import { CategoryIcon } from '@/components/ui/CategoryIcon'
import { breadcrumbSchema, localBusinessSchema } from '@/lib/seo/jsonld'
import { getArea } from '@/data/areas'
import { CATEGORIES } from '@/data/categories'
import NotFound from './NotFound'

export default function AreaLanding() {
  const { area: areaParam } = useParams<{ area: string }>()
  const area = areaParam ? getArea(areaParam) : undefined

  if (!area) return <NotFound />

  const path = `/areas/${area.slug}`
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Delivery', path: '/delivery' },
    { name: area.name, path },
  ]

  return (
    <>
      <Seo
        title={`Vape Delivery in ${area.name}`}
        description={area.summary}
        path={path}
        jsonLd={[localBusinessSchema(), breadcrumbSchema(crumbs)]}
      />

      <PageHeader
        eyebrow="Delivery area"
        title={`Vape delivery in ${area.name}`}
        intro={`Age-verified local delivery to ${area.name} (${area.postcodeDistricts.join(', ')}).`}
        crumbs={crumbs}
      />

      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="prose-mv max-w-none">
            {area.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <h2>What you can order</h2>
            <p>
              Our {area.name} delivery covers the full range of refillable products.
              Browse a category to get started:
            </p>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                to={`/shop/${c.slug}`}
                className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-ink-900/60 px-4 py-3 transition-colors hover:border-accent-500/40"
              >
                <CategoryIcon slug={c.slug} className="h-5 w-5 text-accent-300" />
                <span className="font-medium text-silver-100">{c.name}</span>
                <ArrowRight className="ml-auto h-4 w-4 text-silver-500" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="surface rounded-2xl p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <MapPin className="h-5 w-5 text-accent-300" aria-hidden="true" />
              Check your postcode
            </h2>
            <p className="mt-2 text-sm text-silver-400">
              Confirm delivery to your {area.name} address.
            </p>
            <div className="mt-4">
              <PostcodeChecker compact id="area-postcode" />
            </div>
          </div>
          <AgeNotice variant="banner" />
        </aside>
      </div>
    </>
  )
}
