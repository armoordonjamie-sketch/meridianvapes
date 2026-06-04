/**
 * Provider-agnostic payment interface.
 *
 * Stripe prohibits vaping products, so NO Stripe integration is included.
 * Components depend ONLY on this interface (via `getPaymentProvider()` in
 * index.ts), so a high-risk gateway can be dropped in later by adding one new
 * implementation file and switching VITE_PAYMENTS_PROVIDER — no component or
 * page changes required.
 */

export interface CheckoutLineInput {
  productId: string
  slug: string
  name: string
  quantity: number
  /** Unit price including VAT, in integer pence. */
  unitPriceIncVatPence: number
}

export interface CreateCheckoutInput {
  lines: CheckoutLineInput[]
  currency: 'GBP'
  /** Customer contact (email used for transactional order updates only). */
  customer?: { email?: string; name?: string }
  /**
   * Whether age verification has PASSED for this order. An order must not be
   * dispatchable until this is true — implementations must reject otherwise.
   */
  ageVerified: boolean
  /** Reference from the age-verification provider, for audit. */
  ageVerificationRef?: string
  deliveryPostcode?: string
  /** Free-form provider metadata. */
  metadata?: Record<string, string>
}

export type CheckoutStatus =
  | 'requires_payment'
  | 'processing'
  | 'paid'
  | 'failed'
  | 'cancelled'

export interface CheckoutSession {
  id: string
  provider: string
  status: CheckoutStatus
  /** Hosted-payment redirect URL, when the provider is redirect-based. */
  redirectUrl?: string
  amountIncVatPence: number
  currency: 'GBP'
  /** ISO 8601 timestamp. */
  createdAt: string
}

export interface PaymentProvider {
  /** Stable provider identifier, e.g. "stub", "acme-highrisk". */
  readonly name: string
  /** Create a checkout/payment session. Must reject if `ageVerified` is false. */
  createCheckout(input: CreateCheckoutInput): Promise<CheckoutSession>
  /** Retrieve the current status of a checkout session. */
  getCheckout(id: string): Promise<CheckoutSession | null>
  /** Cancel an in-progress checkout session. */
  cancelCheckout(id: string): Promise<void>
}

/** Thrown when checkout is attempted before age verification passes. */
export class AgeVerificationRequiredError extends Error {
  constructor() {
    super('Order is not dispatchable until age verification passes.')
    this.name = 'AgeVerificationRequiredError'
  }
}
