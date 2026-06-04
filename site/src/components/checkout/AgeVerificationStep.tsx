import { useState } from 'react'
import { CheckCircle2, Loader2, ShieldAlert, ShieldCheck } from 'lucide-react'
import {
  getAgeVerificationProvider,
  type AgeVerificationResult,
} from '@/lib/age'
import { MINIMUM_AGE } from '@/config/site'

/**
 * Checkout age-verification step.
 *
 * Provider-agnostic: it talks ONLY to the abstract `AgeVerificationProvider`
 * via `getAgeVerificationProvider()`. Swapping the stub for 1account /
 * AgeChecked is a config + new-implementation change — this component does not
 * change. The order is not dispatchable until `result.passed === true`, which
 * is surfaced to the parent via `onVerified`.
 */
export function AgeVerificationStep({
  postcode,
  onVerified,
}: {
  postcode?: string
  onVerified: (result: AgeVerificationResult) => void
}) {
  const [dob, setDob] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AgeVerificationResult | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const provider = getAgeVerificationProvider()
      const res = await provider.verify({ dateOfBirth: dob || undefined, postcode })
      setResult(res)
      if (res.passed) onVerified(res)
    } finally {
      setLoading(false)
    }
  }

  if (result?.passed) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.06] p-4">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" aria-hidden="true" />
        <div>
          <p className="font-semibold text-silver-50">Age verified</p>
          <p className="mt-1 text-sm text-silver-400">
            Verification reference {result.reference}. Your order can now proceed to
            payment.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="flex items-start gap-3 rounded-xl border border-accent-500/30 bg-accent-500/[0.06] p-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent-300" aria-hidden="true" />
        <p className="text-sm leading-relaxed text-silver-300">
          We verify that you are {MINIMUM_AGE} or over before dispatching any order. Your
          details are used only for age verification. A photo-ID check is also carried
          out on delivery.
        </p>
      </div>

      <div>
        <label htmlFor="dob" className="mb-1.5 block text-sm font-medium text-silver-200">
          Date of birth
        </label>
        <input
          id="dob"
          type="date"
          required
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="h-12 w-full max-w-xs rounded-xl border border-white/12 bg-ink-850 px-3 text-silver-100"
        />
      </div>

      {result && !result.passed && (
        <p
          role="alert"
          className="flex items-center gap-2 text-sm text-amber-300"
        >
          <ShieldAlert className="h-4 w-4" aria-hidden="true" />
          {result.message ??
            `We could not verify that you are ${MINIMUM_AGE} or over.`}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-12 items-center gap-2 rounded-xl bg-accent-600 px-6 font-semibold text-white transition-colors hover:bg-accent-500 disabled:opacity-60"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        Verify my age
      </button>
    </form>
  )
}
