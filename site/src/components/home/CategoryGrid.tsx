import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { CategoryIcon } from '@/components/ui/CategoryIcon'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { CATEGORIES } from '@/data/categories'

export function CategoryGrid() {
  return (
    <section className="container-page py-16">
      <SectionHeading
        eyebrow="Shop by category"
        title="Everything for pod vaping"
        description="A focused range of refillable and reusable pod systems, e-liquids and accessories. Single-use disposables are not stocked."
      />

      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            to={`/shop/${cat.slug}`}
            className="group relative flex flex-col items-start gap-3 overflow-hidden rounded-2xl border border-white/[0.07] bg-ink-900/60 p-4 transition-colors hover:border-accent-500/40 sm:flex-row sm:gap-4 sm:p-5"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent-500/10 text-accent-300">
              <CategoryIcon slug={cat.slug} className="h-6 w-6" />
            </span>
            <div className="flex-1">
              <h3 className="flex items-center gap-1.5 text-base font-semibold text-silver-50 sm:text-lg">
                {cat.name}
                <ArrowUpRight className="h-4 w-4 text-silver-500 transition-colors group-hover:text-accent-300" aria-hidden="true" />
              </h3>
              <p className="mt-1 text-sm text-silver-400">{cat.blurb}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
