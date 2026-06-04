/**
 * Provider-agnostic age-verification interface.
 *
 * Designed to be wired to a real provider (e.g. 1account, AgeChecked) later
 * without touching the checkout components. The checkout step depends only on
 * this interface via `getAgeVerificationProvider()` in index.ts.
 *
 * Compliance rule: an order is NOT dispatchable until `passed === true`.
 */

export type AgeVerificationStatus =
  | 'unverified'
  | 'pending'
  | 'verified'
  | 'failed'

export interface AgeVerificationInput {
  /** Minimal details; a real provider may collect more or use a hosted flow. */
  firstName?: string
  lastName?: string
  /** ISO date string (YYYY-MM-DD). */
  dateOfBirth?: string
  postcode?: string
  /** Optional reference to resume an existing async verification. */
  reference?: string
}

export interface AgeVerificationResult {
  status: AgeVerificationStatus
  /** True only when status === 'verified'. Gate for dispatch. */
  passed: boolean
  /** Provider reference id, retained for audit / order record. */
  reference: string
  provider: string
  /** ISO 8601 timestamp of the check. */
  checkedAt: string
  /** Human-readable status message for the UI. */
  message?: string
}

export interface AgeVerificationProvider {
  readonly name: string
  /** Perform (or begin) an age-verification check. */
  verify(input: AgeVerificationInput): Promise<AgeVerificationResult>
  /** Poll the status of an async verification by reference. */
  getStatus(reference: string): Promise<AgeVerificationResult | null>
}
