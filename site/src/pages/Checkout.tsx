import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Loader2, Lock } from 'lucide-react'
import { Seo } from '@/lib/seo/Seo'
import { PageHeader } from '@/components/common/PageHeader'
import { AgeVerificationStep } from '@/components/checkout/AgeVerificationStep'
import { useCart } from '@/lib/cart/CartContext'
import { formatPrice } from '@/lib/format'
import {
  getPaymentProvider,
  type CheckoutSession,
} from '@/lib/payments'
import type { AgeVerificationResult } from '@/lib/age'
import { providers } from '@/config/site'

export default function Checkout() {
  const { lines, subtotalPence, clear } = useCart()
  const [postcode, setPostcode] = useState('')
  const [email, setEmail] = useState('')
  const [ageResult, setAgeResult] = useState<AgeVerificationResult | null>(null)
  const [placing, setPlacing] = useState(false)
  const [order, setOrder] = useState<CheckoutSession | null>(null)
  const [error, setError] = useState<string | null>(null)

  const ageVerified = ageResult?.passed ?? false

  async function pay() {
    setError(null)
    setPlacing(true)
    try {
      const provider = getPaymentProvider()
      const session = await provider.createCheckout({
        lines: lines.map((l) => ({
          productId: l.productId,
          slug: l.slug,
          name: l.name,
          quantity: l.quantity,
          unitPriceIncVatPence: l.unitPriceIncVatPence,
        })),
        currency: 'GBP',
        customer: { email: email || undefined },
        ageVerified,
        ageVerificationRef: ageResult?.reference,
        deliveryPostcode: postcode || undefined,
      })

      // A redirect-based provider would send the customer to session.redirectUrl.
      if (session.redirectUrl) {
        window.location.href = session.redirectUrl
        return
      }
      setOrder(session)
      clear()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setPlacing(false)
    }
  }

  // Order confirmation
  if (order) {
    return (
      <>
        <Seo title="Order confirmed" description="Your order is confirmed." path="/checkout" noindex />
        <div className="container-page flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
          <CheckCircle2 className="h-14 w-14 text-emerald-300" aria-hidden="true" />
          <h1 className="mt-5 text-3xl font-bold">Order confirmed</h1>
          <p className="mt-2 max-w-md text-silver-400">
            Reference <span className="font-semibold text-silver-100">{order.id}</span>.
            Amount {formatPrice(order.amountIncVatPence)} (inc. VAT). Age verification
            passed — your order is now dispatchable. A driver will check ID on delivery.
          </p>
          <p className="mt-2 text-xs text-silver-500">
            (Demonstration only — no real payment was taken by the “{order.provider}”
            provider.)
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-flex h-11 items-center rounded-xl bg-accent-600 px-5 font-semibold text-white hover:bg-accent-500"
          >
            Continue shopping
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <Seo title="Checkout" description="Complete your Meridian Vapes order." path="/checkout" noindex />

      <PageHeader
        title="Checkout"
        crumbs={[
          { name: 'Home', path: '/' },
          { name: 'Basket', path: '/cart' },
          { name: 'Checkout', path: '/checkout' },
        ]}
      />

      <div className="container-page py-12">
        {lines.length === 0 ? (
          <div className="surface rounded-2xl p-10 text-center">
            <p className="text-silver-300">Your basket is empty.</p>
            <Link to="/shop" className="mt-4 inline-flex font-semibold text-accent-300 hover:underline">
              Go to shop
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-8">
              {/* 1. Delivery details */}
              <section className="surface rounded-2xl p-6 sm:p-8">
                <Step n={1} title="Delivery details" />
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="co-email" className="mb-1.5 block text-sm font-medium text-silver-200">
                      Email (for order updates)
                    </label>
                    <input
                      id="co-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      className="h-12 w-full rounded-xl border border-white/12 bg-ink-850 px-3 text-silver-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="co-postcode" className="mb-1.5 block text-sm font-medium text-silver-200">
                      Delivery postcode
                    </label>
                    <input
                      id="co-postcode"
                      type="text"
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      autoComplete="postal-code"
                      className="h-12 w-full rounded-xl border border-white/12 bg-ink-850 px-3 text-silver-100"
                    />
                  </div>
                </div>
                <p className="mt-3 text-xs text-silver-500">
                  Your email is used only for transactional order updates — not marketing.
                </p>
              </section>

              {/* 2. Age verification */}
              <section className="surface rounded-2xl p-6 sm:p-8">
                <Step n={2} title="Age verification" />
                <p className="mb-5 mt-2 text-sm text-silver-400">
                  Required before your order can be dispatched.
                </p>
                <AgeVerificationStep postcode={postcode} onVerified={setAgeResult} />
              </section>

              {/* 3. Payment */}
              <section className="surface rounded-2xl p-6 sm:p-8">
                <Step n={3} title="Payment" />
                <p className="mb-5 mt-2 text-sm text-silver-400">
                  Payment is handled by the configured provider
                  {' '}(<span className="font-mono text-silver-300">{providers.payments}</span>).
                  Stripe is intentionally not used.
                </p>

                {error && (
                  <p role="alert" className="mb-4 text-sm text-amber-300">
                    {error}
                  </p>
                )}

                <button
                  type="button"
                  onClick={pay}
                  disabled={!ageVerified || placing}
                  className="inline-flex h-12 items-center gap-2 rounded-xl bg-accent-600 px-6 font-semibold text-white transition-colors hover:bg-accent-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {placing ? (
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  ) : (
                    <Lock className="h-5 w-5" aria-hidden="true" />
                  )}
                  Pay {formatPrice(subtotalPence)}
                </button>
                {!ageVerified && (
                  <p className="mt-3 text-sm text-silver-500">
                    Complete age verification above to enable payment.
                  </p>
                )}
              </section>
            </div>

            {/* Summary */}
            <aside>
              <div className="surface sticky top-28 rounded-2xl p-6">
                <h2 className="text-lg font-bold">Order summary</h2>
                <ul className="mt-4 space-y-3 text-sm">
                  {lines.map((l) => (
                    <li key={l.productId} className="flex justify-between gap-3">
                      <span className="text-silver-300">
                        {l.name} <span className="text-silver-500">× {l.quantity}</span>
                      </span>
                      <span className="text-silver-100">
                        {formatPrice(l.unitPriceIncVatPence * l.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex justify-between border-t border-white/[0.07] pt-4 font-semibold">
                  <span>Subtotal (inc. VAT)</span>
                  <span>{formatPrice(subtotalPence)}</span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </>
  )
}

function Step({ n, title }: { n: number; title: string }) {
  return (
    <h2 className="flex items-center gap-3 text-xl font-bold">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-accent-500/15 text-sm font-bold text-accent-300">
        {n}
      </span>
      {title}
    </h2>
  )
}
