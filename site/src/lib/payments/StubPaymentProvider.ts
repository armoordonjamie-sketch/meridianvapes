import {
  AgeVerificationRequiredError,
  type CheckoutSession,
  type CreateCheckoutInput,
  type PaymentProvider,
} from './types'

/**
 * In-memory stub payment provider for local development and prerendering.
 *
 * It performs NO real payment. It validates the compliance precondition
 * (age verification must have passed) and returns a fake "paid" session so the
 * checkout flow can be demonstrated end to end.
 *
 * To wire a real high-risk gateway: create e.g. `AcmePaymentProvider.ts`
 * implementing `PaymentProvider`, then register it in `index.ts`.
 */
export class StubPaymentProvider implements PaymentProvider {
  readonly name = 'stub'
  private sessions = new Map<string, CheckoutSession>()
  private counter = 0

  async createCheckout(input: CreateCheckoutInput): Promise<CheckoutSession> {
    if (!input.ageVerified) {
      throw new AgeVerificationRequiredError()
    }

    const amount = input.lines.reduce(
      (sum, l) => sum + l.unitPriceIncVatPence * l.quantity,
      0,
    )

    this.counter += 1
    const id = `stub_${this.counter}_${input.lines.length}`
    const session: CheckoutSession = {
      id,
      provider: this.name,
      // The stub auto-completes payment; a real provider would return
      // 'requires_payment' plus a redirectUrl to a hosted payment page.
      status: 'paid',
      amountIncVatPence: amount,
      currency: input.currency,
      createdAt: new Date().toISOString(),
    }
    this.sessions.set(id, session)
    return session
  }

  async getCheckout(id: string): Promise<CheckoutSession | null> {
    return this.sessions.get(id) ?? null
  }

  async cancelCheckout(id: string): Promise<void> {
    const s = this.sessions.get(id)
    if (s) this.sessions.set(id, { ...s, status: 'cancelled' })
  }
}
