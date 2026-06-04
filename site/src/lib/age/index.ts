import { providers } from '@/config/site'
import { StubAgeVerificationProvider } from './StubAgeVerificationProvider'
import type { AgeVerificationProvider } from './types'

export * from './types'

/**
 * Age-verification provider factory.
 *
 * Selection is driven by VITE_AGE_PROVIDER. To wire 1account / AgeChecked,
 * add an implementation of `AgeVerificationProvider` and a case below.
 */
let instance: AgeVerificationProvider | null = null

export function getAgeVerificationProvider(): AgeVerificationProvider {
  if (instance) return instance

  switch (providers.age) {
    // case '1account':
    //   instance = new OneAccountProvider(providers.agePublicKey)
    //   break
    // case 'agechecked':
    //   instance = new AgeCheckedProvider(providers.agePublicKey)
    //   break
    case 'stub':
    default:
      instance = new StubAgeVerificationProvider()
      break
  }
  return instance
}
