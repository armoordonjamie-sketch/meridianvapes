import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BadgeCheck, Check, Minus, Plus, ShoppingBag, Truck } from 'lucide-react'
import { Seo } from '@/lib/seo/Seo'
import { Badge } from '@/components/ui/Badge'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { AgeNotice } from '@/components/common/AgeNotice'
import { ProductMedia } from '@/components/product/ProductMedia'
import { getProductSync } from '@/lib/catalogue/api'
import { useCart } from '@/lib/cart/CartContext'
import { breadcrumbSchema, productSchema } from '@/lib/seo/jsonld'
import { deviceLabel, flavourLabel, formatPrice, strengthLabel } from '@/lib/format'
import { getCategory } from '@/data/categories'
import NotFound from './NotFound'

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const product = slug ? getProductSync(slug) : null
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  if (!product) return <NotFound />

  const category = getCategory(product.category)
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    ...(category ? [{ name: category.name, path: `/shop/${category.slug}` }] : []),
    { name: product.name, path: `/product/${product.slug}` },
  ]

  const lowStock =
    product.inStock && product.stockQty !== undefined && product.stockQty <= 10

  function add() {
    addItem(product!, qty)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1500)
  }

  return (
    <>
      <Seo
        title={product.name}
        description={product.shortDescription}
        path={`/product/${product.slug}`}
        type="product"
        jsonLd={[productSchema(product), breadcrumbSchema(crumbs)]}
      />

      <div className="container-page py-6 pb-28 sm:py-8 lg:pb-8">
        <Breadcrumbs crumbs={crumbs} />

        <div className="mt-4 grid grid-cols-1 gap-8 sm:mt-6 sm:gap-10 lg:grid-cols-2">
          {/* Media */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="mx-auto max-w-md">
              <ProductMedia product={product} priority />
            </div>
          </div>

          {/* Details */}
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-silver-500">
              {product.brand}
            </p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl lg:text-4xl">{product.name}</h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-2xl font-bold text-silver-50">
                {formatPrice(product.priceIncVatPence, product.currency)}
              </span>
              <span className="text-sm text-silver-500">inc. VAT</span>
              {product.inStock ? (
                lowStock ? (
                  <Badge tone="warning">Low stock</Badge>
                ) : (
                  <Badge tone="success">In stock</Badge>
                )
              ) : (
                <Badge tone="muted">Out of stock</Badge>
              )}
            </div>

            <p className="mt-5 leading-relaxed text-silver-300">{product.description}</p>

            {/* Key facts */}
            <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.04]">
              {product.nicotineStrengthMg !== undefined && (
                <Fact label="Nicotine strength" value={strengthLabel(product.nicotineStrengthMg)} />
              )}
              {product.vgPg && (
                <Fact label="VG/PG ratio" value={`${product.vgPg.vg}/${product.vgPg.pg}`} />
              )}
              {product.volumeMl !== undefined && (
                <Fact label="Volume" value={`${product.volumeMl}ml`} />
              )}
              {product.prefilled && (
                <Fact label="Pod type" value="Prefilled (replaceable)" />
              )}
              {product.puffRating !== undefined && (
                <Fact label="Pod life" value={`Up to ${product.puffRating.toLocaleString('en-GB')} puffs`} />
              )}
              {product.flavourFamily && (
                <Fact label="Flavour family" value={flavourLabel(product.flavourFamily)} />
              )}
              {product.deviceType !== 'not-applicable' && (
                <Fact label="Device type" value={deviceLabel(product.deviceType)} />
              )}
              <Fact
                label="MHRA notified"
                value={product.compliance.mhraNotified ? 'Yes' : 'Not applicable'}
              />
            </dl>

            {/* Quantity + add to basket (desktop / tablet) */}
            <div className="mt-6 hidden flex-wrap items-center gap-3 sm:flex">
              <QuantityStepper qty={qty} setQty={setQty} />
              <AddToBasketButton
                added={added}
                inStock={product.inStock}
                onClick={add}
                className="sm:flex-none"
              />
            </div>

            {/* Specs */}
            {product.specs && product.specs.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-silver-100">Specifications</h2>
                <table className="mt-3 w-full text-sm">
                  <tbody className="divide-y divide-white/[0.07]">
                    {product.specs.map((s) => (
                      <tr key={s.label}>
                        <th scope="row" className="py-2.5 pr-4 text-left font-medium text-silver-400">
                          {s.label}
                        </th>
                        <td className="py-2.5 text-silver-100">{s.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Delivery + compliance */}
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-ink-900/50 p-4">
                <Truck className="mt-0.5 h-5 w-5 shrink-0 text-accent-300" aria-hidden="true" />
                <p className="text-sm leading-relaxed text-silver-300">
                  Delivered locally across Eltham and South East London with a doorstep
                  ID check.{' '}
                  <Link to="/delivery" className="text-accent-300 hover:underline">
                    See delivery details
                  </Link>
                  .
                </p>
              </div>

              {product.compliance.mhraNotified && (
                <p className="flex items-center gap-2 text-sm text-silver-400">
                  <BadgeCheck className="h-4 w-4 text-accent-300" aria-hidden="true" />
                  This product is notified to the MHRA under the Tobacco and Related
                  Products Regulations.
                </p>
              )}

              <AgeNotice variant="banner" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky add-to-basket */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.07] bg-ink-950/95 px-4 py-3 backdrop-blur-md pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-silver-100">{product.name}</p>
            <p className="text-lg font-bold text-silver-50">
              {formatPrice(product.priceIncVatPence, product.currency)}
              <span className="ml-1 text-xs font-normal text-silver-500">inc. VAT</span>
            </p>
          </div>
          <QuantityStepper qty={qty} setQty={setQty} compact />
          <AddToBasketButton
            added={added}
            inStock={product.inStock}
            onClick={add}
            className="shrink-0"
          />
        </div>
      </div>
    </>
  )
}

function QuantityStepper({
  qty,
  setQty,
  compact = false,
}: {
  qty: number
  setQty: (fn: (q: number) => number) => void
  compact?: boolean
}) {
  const btn = compact ? 'grid h-11 w-11' : 'grid h-12 w-12'
  return (
    <div className="inline-flex shrink-0 items-center rounded-xl border border-white/12">
      <button
        type="button"
        onClick={() => setQty((q) => Math.max(1, q - 1))}
        className={`${btn} place-items-center text-silver-300 hover:text-white disabled:opacity-40`}
        aria-label="Decrease quantity"
        disabled={qty <= 1}
      >
        <Minus className="h-4 w-4" />
      </button>
      <span
        className={`text-center font-semibold ${compact ? 'w-8 text-sm' : 'w-10'}`}
        aria-live="polite"
      >
        {qty}
      </span>
      <button
        type="button"
        onClick={() => setQty((q) => q + 1)}
        className={`${btn} place-items-center text-silver-300 hover:text-white`}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}

function AddToBasketButton({
  added,
  inStock,
  onClick,
  className = '',
}: {
  added: boolean
  inStock: boolean
  onClick: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!inStock}
      className={`inline-flex h-11 min-w-[8.5rem] items-center justify-center gap-2 rounded-xl bg-accent-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-accent-500 active:bg-accent-700 disabled:cursor-not-allowed disabled:opacity-50 sm:h-12 sm:min-w-0 sm:px-6 sm:text-base ${className}`}
    >
      {added ? <Check className="h-5 w-5" /> : <ShoppingBag className="h-5 w-5" />}
      {inStock ? (added ? 'Added' : 'Add') : 'Out of stock'}
    </button>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-ink-900 p-3">
      <dt className="text-xs uppercase tracking-wide text-silver-500">{label}</dt>
      <dd className="mt-0.5 font-semibold text-silver-100">{value}</dd>
    </div>
  )
}
