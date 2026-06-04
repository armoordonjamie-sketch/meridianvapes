import { providers } from '@/config/site'
import { StubPaymentProvider } from './StubPaymentProvider'
import type { PaymentProvider } from './types'

export * from './types'

/**
 * Payment provider factory.
 *
 * Selection is driven by VITE_PAYMENTS_PROVIDER. Add a new provider by
 * implementing `PaymentProvider` and adding a case below — components keep
 * calling `getPaymentProvider()` and never import a concrete class.
 */
let instance: PaymentProvider | null = null

export function getPaymentProvider(): PaymentProvider {
  if (instance) return instance

  switch (providers.payments) {
    // case 'acme-highrisk':
    //   instance = new AcmePaymentProvider(providers.paymentsPublicKey)
    //   break
    case 'stub':
    default:
      instance = new StubPaymentProvider()
      break
  }
  return instance
}
