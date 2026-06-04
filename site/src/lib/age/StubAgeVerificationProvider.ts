import { MINIMUM_AGE } from '@/config/site'
import type {
  AgeVerificationInput,
  AgeVerificationProvider,
  AgeVerificationResult,
} from './types'

/**
 * Stub age-verification provider for development and prerendering.
 *
 * Behaviour:
 *  - If a date of birth is supplied, it is checked against the legal minimum
 *    age and passes/fails accordingly (so the UI can be exercised honestly).
 *  - If no date of birth is supplied, it returns `pending` — the real provider
 *    would hand off to a hosted flow or document/database check here.
 *
 * Replace with a real provider (1account / AgeChecked) by implementing
 * `AgeVerificationProvider` and registering it in index.ts.
 */
export class StubAgeVerificationProvider implements AgeVerificationProvider {
  readonly name = 'stub'
  private results = new Map<string, AgeVerificationResult>()
  private counter = 0

  private ageFromDob(dob: string): number | null {
    const birth = new Date(dob)
    if (Number.isNaN(birth.getTime())) return null
    const now = new Date()
    let age = now.getFullYear() - birth.getFullYear()
    const m = now.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age -= 1
    return age
  }

  async verify(input: AgeVerificationInput): Promise<AgeVerificationResult> {
    this.counter += 1
    const reference = input.reference ?? `stub-age-${this.counter}`

    let result: AgeVerificationResult
    if (input.dateOfBirth) {
      const age = this.ageFromDob(input.dateOfBirth)
      const passed = age !== null && age >= MINIMUM_AGE
      result = {
        status: passed ? 'verified' : 'failed',
        passed,
        reference,
        provider: this.name,
        checkedAt: new Date().toISOString(),
        message: passed
          ? 'Age verification passed (stub).'
          : `You must be ${MINIMUM_AGE} or over. Verification failed (stub).`,
      }
    } else {
      result = {
        status: 'pending',
        passed: false,
        reference,
        provider: this.name,
        checkedAt: new Date().toISOString(),
        message:
          'Awaiting verification. A real provider would complete a hosted or database check here (stub).',
      }
    }

    this.results.set(reference, result)
    return result
  }

  async getStatus(reference: string): Promise<AgeVerificationResult | null> {
    return this.results.get(reference) ?? null
  }
}
