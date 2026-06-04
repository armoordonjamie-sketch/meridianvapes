import { Link } from 'react-router-dom'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { Seo } from '@/lib/seo/Seo'
import { PageHeader } from '@/components/common/PageHeader'
import { AgeNotice } from '@/components/common/AgeNotice'
import { useCart } from '@/lib/cart/CartContext'
import { formatPrice } from '@/lib/format'

export default function Cart() {
  const { lines, subtotalPence, setQuantity, removeItem, count } = useCart()

  return (
    <>
      <Seo
        title="Basket"
        description="Your Meridian Vapes basket."
        path="/cart"
        noindex
      />

      <PageHeader
        title="Your basket"
        crumbs={[
          { name: 'Home', path: '/' },
          { name: 'Basket', path: '/cart' },
        ]}
      />

      <div className="container-page py-12">
        {lines.length === 0 ? (
          <div className="surface flex flex-col items-center gap-4 rounded-2xl p-12 text-center">
            <ShoppingBag className="h-10 w-10 text-silver-500" aria-hidden="true" />
            <p className="text-lg font-semibold text-silver-100">Your basket is empty</p>
            <p className="max-w-sm text-silver-400">
              Browse the shop to add refillable kits, e-liquids and accessories.
            </p>
            <Link
              to="/shop"
              className="mt-2 inline-flex h-11 items-center rounded-xl bg-accent-600 px-5 font-semibold text-white hover:bg-accent-500"
            >
              Go to shop
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* Lines */}
            <ul className="divide-y divide-white/[0.07] overflow-hidden rounded-2xl border border-white/[0.07]">
              {lines.map((line) => (
                <li key={line.productId} className="flex items-center gap-4 bg-ink-900/40 p-4">
                  <div className="flex-1">
                    <Link
                      to={`/product/${line.slug}`}
                      className="font-semibold text-silver-100 hover:text-accent-300"
                    >
                      {line.name}
                    </Link>
                    <p className="mt-0.5 text-sm text-silver-500">
                      {formatPrice(line.unitPriceIncVatPence)} each
                    </p>
                  </div>

                  <div className="inline-flex items-center rounded-lg border border-white/12">
                    <button
                      type="button"
                      onClick={() => setQuantity(line.productId, line.quantity - 1)}
                      className="grid h-9 w-9 place-items-center text-silver-300 hover:text-white"
                      aria-label={`Decrease quantity of ${line.name}`}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{line.quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(line.productId, line.quantity + 1)}
                      className="grid h-9 w-9 place-items-center text-silver-300 hover:text-white"
                      aria-label={`Increase quantity of ${line.name}`}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="w-20 text-right font-semibold text-silver-50">
                    {formatPrice(line.unitPriceIncVatPence * line.quantity)}
                  </p>

                  <button
                    type="button"
                    onClick={() => removeItem(line.productId)}
                    className="grid h-9 w-9 place-items-center rounded-lg text-silver-500 hover:bg-white/5 hover:text-red-300"
                    aria-label={`Remove ${line.name} from basket`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>

            {/* Summary */}
            <aside className="space-y-4">
              <div className="surface rounded-2xl p-6">
                <h2 className="text-lg font-bold">Order summary</h2>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-silver-400">Items</dt>
                    <dd className="text-silver-100">{count}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-silver-400">Subtotal (inc. VAT)</dt>
                    <dd className="text-silver-100">{formatPrice(subtotalPence)}</dd>
                  </div>
                  <div className="flex justify-between text-silver-500">
                    <dt>Delivery</dt>
                    <dd>Calculated at checkout</dd>
                  </div>
                </dl>
                <Link
                  to="/checkout"
                  className="mt-5 flex h-12 items-center justify-center rounded-xl bg-accent-600 px-6 font-semibold text-white transition-colors hover:bg-accent-500"
                >
                  Proceed to checkout
                </Link>
                <p className="mt-3 text-center text-xs text-silver-500">
                  Age verification is required before dispatch.
                </p>
              </div>
              <AgeNotice variant="banner" />
            </aside>
          </div>
        )}
      </div>
    </>
  )
}
