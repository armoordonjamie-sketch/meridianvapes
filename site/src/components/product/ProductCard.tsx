import { Link } from 'react-router-dom'
import { Check, Plus } from 'lucide-react'
import { ProductMedia } from './ProductMedia'
import { Badge } from '@/components/ui/Badge'
import { useCart } from '@/lib/cart/CartContext'
import { formatPrice, strengthLabel } from '@/lib/format'
import type { Product } from '@/lib/catalogue/types'

export function ProductCard({ product }: { product: Product }) {
  const { addItem, lines } = useCart()
  const href = `/product/${product.slug}`
  const inCart = lines.some((l) => l.productId === product.id)
  const strength = strengthLabel(product.nicotineStrengthMg)

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-ink-900/60 transition-colors hover:border-white/15 active:border-white/20">
      <Link to={href} className="block p-2.5 sm:p-3" aria-label={product.name}>
        <ProductMedia product={product} className="rounded-xl" />
      </Link>

      <div className="flex flex-1 flex-col px-3 pb-3 sm:px-4 sm:pb-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-silver-500 sm:text-xs">
          {product.brand}
        </p>
        <h3 className="mt-0.5 text-[15px] font-semibold leading-snug sm:text-base">
          <Link to={href} className="hover:text-accent-300">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-silver-400 sm:text-sm">
          {product.shortDescription}
        </p>

        {(strength || product.vgPg || product.prefilled) && (
          <div className="mt-2 flex flex-wrap gap-1 sm:mt-3 sm:gap-1.5">
            {product.prefilled && <Badge tone="accent">Prefilled pod</Badge>}
            {strength && <Badge tone="muted">{strength}</Badge>}
            {product.vgPg && (
              <Badge tone="muted">
                VG/PG {product.vgPg.vg}/{product.vgPg.pg}
              </Badge>
            )}
          </div>
        )}

        <div className="mt-auto flex flex-col gap-2 pt-3 sm:flex-row sm:items-center sm:justify-between sm:pt-4">
          <div>
            <span className="text-base font-bold text-silver-50 sm:text-lg">
              {formatPrice(product.priceIncVatPence, product.currency)}
            </span>
            <span className="ml-1 text-[10px] text-silver-500 sm:text-xs">inc. VAT</span>
          </div>
          {product.inStock ? (
            <button
              type="button"
              onClick={() => addItem(product)}
              className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-accent-600 px-3 text-sm font-semibold text-white transition-colors hover:bg-accent-500 active:bg-accent-700 sm:h-9 sm:w-auto sm:rounded-lg"
              aria-label={`Add ${product.name} to basket`}
            >
              {inCart ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {inCart ? 'Added' : 'Add'}
            </button>
          ) : (
            <Badge tone="warning">Out of stock</Badge>
          )}
        </div>
      </div>
    </article>
  )
}
