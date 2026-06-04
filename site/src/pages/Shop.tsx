import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { Seo } from '@/lib/seo/Seo'
import { PageHeader } from '@/components/common/PageHeader'
import { Filters } from '@/components/product/Filters'
import { MobileFilterSheet } from '@/components/product/MobileFilterSheet'
import { ProductGrid } from '@/components/product/ProductGrid'
import { AgeNotice } from '@/components/common/AgeNotice'
import { getFacetsSync, listProductsSync } from '@/lib/catalogue/api'
import { breadcrumbSchema } from '@/lib/seo/jsonld'
import { CATEGORIES, getCategory } from '@/data/categories'
import type { CatalogueFilters, CategorySlug } from '@/lib/catalogue/types'
import NotFound from './NotFound'

export default function Shop() {
  const { category: categoryParam } = useParams<{ category?: string }>()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? undefined

  const categoryMeta = categoryParam ? getCategory(categoryParam) : undefined
  const [filters, setFilters] = useState<CatalogueFilters>({})
  const [showFilters, setShowFilters] = useState(false)

  const category = categoryMeta?.slug as CategorySlug | undefined

  const facets = useMemo(() => getFacetsSync({ category }), [category])
  const products = useMemo(
    () => listProductsSync({ ...filters, category, query }),
    [filters, category, query],
  )

  const activeFilterCount =
    (filters.brands?.length ?? 0) +
    (filters.flavourFamilies?.length ?? 0) +
    (filters.deviceTypes?.length ?? 0) +
    (filters.strengthsMg?.length ?? 0)

  if (categoryParam && !categoryMeta) return <NotFound />

  const title = categoryMeta ? categoryMeta.seoTitle : 'Shop'
  const description = categoryMeta
    ? categoryMeta.metaDescription
    : 'Browse refillable pod kits, e-liquids, pods, coils, nic shots and accessories for age-verified local delivery in Eltham and South East London.'
  const path = categoryMeta ? `/shop/${categoryMeta.slug}` : '/shop'

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    ...(categoryMeta ? [{ name: categoryMeta.name, path }] : []),
  ]

  return (
    <>
      <Seo
        title={title}
        description={description}
        path={path}
        jsonLd={breadcrumbSchema(crumbs)}
      />

      <PageHeader
        eyebrow="Shop"
        title={categoryMeta ? categoryMeta.name : 'All products'}
        intro={categoryMeta ? categoryMeta.intro : undefined}
        crumbs={crumbs}
      >
        <nav
          aria-label="Product categories"
          className="-mx-5 mt-6 flex gap-2 overflow-x-auto px-5 pb-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
        >
          <CategoryTab to="/shop" active={!categoryMeta}>
            All
          </CategoryTab>
          {CATEGORIES.map((c) => (
            <CategoryTab key={c.slug} to={`/shop/${c.slug}`} active={category === c.slug}>
              {c.name}
            </CategoryTab>
          ))}
        </nav>
      </PageHeader>

      <div className="container-page py-6 sm:py-10">
        {query && (
          <p className="mb-4 text-sm text-silver-400">
            Showing results for <span className="text-silver-100">“{query}”</span>
          </p>
        )}

        {/* Mobile: sticky sort/filter bar */}
        <div className="sticky top-16 z-30 -mx-5 mb-4 flex items-center justify-between gap-3 border-b border-white/[0.07] bg-ink-950/95 px-5 py-3 backdrop-blur-md lg:hidden">
          <p className="text-sm text-silver-400">
            <span className="font-semibold text-silver-100">{products.length}</span>{' '}
            {products.length === 1 ? 'product' : 'products'}
          </p>
          <button
            type="button"
            onClick={() => setShowFilters(true)}
            className="inline-flex h-11 min-w-[7.5rem] items-center justify-center gap-2 rounded-xl border border-white/12 bg-ink-900 px-4 text-sm font-semibold text-silver-100"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Filters
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-accent-500 px-1.5 py-0.5 text-[11px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <Filters facets={facets} value={filters} onChange={setFilters} />
            </div>
          </aside>

          <div>
            <div className="mb-4 hidden items-center justify-between lg:flex">
              <p className="text-sm text-silver-400">
                {products.length} {products.length === 1 ? 'product' : 'products'}
              </p>
            </div>
            <ProductGrid products={products} />
            <div className="mt-8">
              <AgeNotice variant="banner" />
            </div>
          </div>
        </div>
      </div>

      <MobileFilterSheet
        open={showFilters}
        onClose={() => setShowFilters(false)}
        facets={facets}
        value={filters}
        onChange={setFilters}
        resultCount={products.length}
      />
    </>
  )
}

function CategoryTab({
  to,
  active,
  children,
}: {
  to: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      to={to}
      aria-current={active ? 'page' : undefined}
      className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? 'border-accent-500/40 bg-accent-500/10 text-accent-200'
          : 'border-white/12 text-silver-300 hover:border-white/25 hover:text-white'
      }`}
    >
      {children}
    </Link>
  )
}
