import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { ProductMedia } from '@/components/product/ProductMedia'
import { PostcodeChecker } from '@/components/layout/PostcodeChecker'
import { listProductsSync } from '@/lib/catalogue/api'
import { MINIMUM_AGE, siteConfig } from '@/config/site'
import type { CategorySlug } from '@/lib/catalogue/types'

const firstInStock = (cat: CategorySlug) =>
  listProductsSync({ category: cat }).find((p) => p.inStock) ?? null

const FEATURED = [
  firstInStock('prefilled-pods'),
  firstInStock('pod-kits'),
  firstInStock('e-liquids'),
].filter((p): p is NonNullable<typeof p> => p !== null)

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(60% 55% at 78% 18%, rgba(0,129,253,0.18), transparent 70%), radial-gradient(40% 40% at 60% 90%, rgba(0,129,253,0.08), transparent 70%)',
        }}
      />
      <div className="container-page grid items-center gap-8 py-12 sm:gap-10 sm:py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <p className="eyebrow mb-3 sm:mb-4">Eltham &amp; South East London</p>
          <h1 className="text-[1.75rem] font-extrabold leading-[1.08] sm:text-4xl lg:text-5xl">
            Age-verified vape delivery,{' '}
            <span className="text-accent-400">to your door</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-silver-300 sm:mt-5 sm:text-lg">
            Refillable and prefilled pod kits, e-liquids, pods, coils and nic shots —
            delivered locally with a doorstep ID check. {MINIMUM_AGE}+ only.
          </p>

          <div className="mt-6 sm:mt-8">
            <label className="mb-2 block text-sm font-medium text-silver-300">
              Check delivery to your area
            </label>
            <PostcodeChecker id="hero-postcode" />
          </div>

          <div className="mt-5 flex flex-col gap-2.5 sm:mt-6 sm:flex-row sm:flex-wrap sm:gap-3">
            <Link
              to="/shop"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent-600 px-6 font-semibold text-white transition-colors hover:bg-accent-500 active:bg-accent-700"
            >
              Browse the shop
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/delivery"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/15 px-6 font-semibold text-silver-100 transition-colors hover:bg-white/5 active:bg-white/10"
            >
              How delivery works
            </Link>
          </div>

          {/* Mobile: horizontal product strip */}
          {FEATURED.length > 0 && (
            <div className="mt-8 lg:hidden" aria-hidden="true">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-silver-500">
                In stock now
              </p>
              <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-1 scrollbar-none">
                {FEATURED.map((p) => (
                  <Link
                    key={p.id}
                    to={`/product/${p.slug}`}
                    className="flex w-[7.5rem] shrink-0 flex-col items-center gap-2 rounded-xl p-2 transition-colors hover:bg-white/[0.04]"
                  >
                    <div className="h-[5.5rem] w-full">
                      <ProductMedia product={p} variant="hero" className="max-h-full" />
                    </div>
                    <span className="line-clamp-2 text-center text-[11px] font-medium leading-tight text-silver-400">
                      {p.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative mx-auto hidden aspect-square w-full max-w-md animate-fade-in sm:block">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full"
            aria-hidden="true"
            style={{ background: 'radial-gradient(circle, rgba(0,129,253,0.22), transparent 65%)' }}
          />

          {FEATURED[0] && (
            <FloatingTile className="left-0 top-[6%] h-[42%] w-[46%] -rotate-6">
              <ProductMedia product={FEATURED[0]} variant="hero" priority />
            </FloatingTile>
          )}
          {FEATURED[1] && (
            <FloatingTile className="bottom-[4%] right-[2%] h-[40%] w-[44%] rotate-6">
              <ProductMedia product={FEATURED[1]} variant="hero" priority />
            </FloatingTile>
          )}
          {FEATURED[2] && (
            <FloatingTile className="right-[6%] top-[2%] h-[32%] w-[34%] rotate-3">
              <ProductMedia product={FEATURED[2]} variant="hero" priority />
            </FloatingTile>
          )}

          <div
            className="pointer-events-none absolute inset-0 z-[15]"
            aria-hidden="true"
            style={{
              background:
                'radial-gradient(50% 50% at 50% 50%, rgba(10,11,13,0.35), transparent 72%)',
            }}
          />

          <img
            src={siteConfig.assets.logoMark}
            width={855}
            height={929}
            alt={`${siteConfig.name} logo`}
            decoding="async"
            className="absolute left-1/2 top-1/2 z-20 w-[52%] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_12px_44px_rgba(0,129,253,0.45)]"
          />
        </div>
      </div>
    </section>
  )
}

function FloatingTile({
  className = '',
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div aria-hidden="true" className={`absolute z-10 pointer-events-none ${className}`}>
      {children}
    </div>
  )
}
