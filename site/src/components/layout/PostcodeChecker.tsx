import { useState } from 'react'
import { CheckCircle2, MapPin, XCircle } from 'lucide-react'
import { AREAS } from '@/data/areas'

/** Covered outward postcode districts, derived from the area data. */
const COVERED = new Set(AREAS.flatMap((a) => a.postcodeDistricts.map((d) => d.toUpperCase())))

/** Extract the outward code (e.g. "SE9" from "SE9 1AA"). */
function outwardCode(input: string): string | null {
  const cleaned = input.toUpperCase().replace(/\s+/g, '')
  const m = cleaned.match(/^([A-Z]{1,2}\d[A-Z\d]?)/)
  return m ? m[1] : null
}

type Status = { kind: 'idle' | 'covered' | 'not-covered' | 'invalid'; code?: string }

export function PostcodeChecker({
  compact = false,
  id = 'postcode',
  floatStatus = false,
}: {
  compact?: boolean
  id?: string
  /** Render the result as a floating popover so it doesn't change row height. */
  floatStatus?: boolean
}) {
  const [value, setValue] = useState('')
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  function check(e: React.FormEvent) {
    e.preventDefault()
    const code = outwardCode(value)
    if (!code) {
      setStatus({ kind: 'invalid' })
      return
    }
    setStatus({ kind: COVERED.has(code) ? 'covered' : 'not-covered', code })
  }

  const describedBy = `${id}-status`

  const hasStatus = status.kind !== 'idle'

  return (
    <div className={`${compact ? 'w-full' : 'w-full max-w-md'} ${floatStatus ? 'relative' : ''}`}>
      <form onSubmit={check} className="flex items-stretch gap-2" noValidate>
        <div className="relative flex-1">
          <MapPin
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-silver-500"
            aria-hidden="true"
          />
          <label htmlFor={id} className="sr-only">
            Delivery postcode
          </label>
          <input
            id={id}
            name="postcode"
            type="text"
            inputMode="text"
            autoComplete="postal-code"
            placeholder="Enter your postcode"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            aria-describedby={describedBy}
            className={`w-full rounded-xl border border-white/12 bg-ink-850 pl-9 pr-3 text-silver-100 placeholder:text-silver-500 ${
              compact ? 'h-10 text-sm' : 'h-12'
            }`}
          />
        </div>
        <button
          type="submit"
          className={`shrink-0 rounded-xl bg-accent-600 px-4 font-semibold text-white transition-colors hover:bg-accent-500 ${
            compact ? 'h-10 text-sm' : 'h-12'
          }`}
        >
          Check delivery
        </button>
      </form>

      <p
        id={describedBy}
        role="status"
        aria-live="polite"
        hidden={floatStatus && !hasStatus}
        className={
          floatStatus
            ? 'absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-white/10 bg-ink-850 p-3 text-sm shadow-card'
            : 'mt-2 min-h-[1.25rem] text-sm'
        }
      >
        {status.kind === 'covered' && (
          <span className="inline-flex items-center gap-1.5 text-emerald-300">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Good news — we deliver to {status.code}. Available windows are shown at
            checkout.
          </span>
        )}
        {status.kind === 'not-covered' && (
          <span className="inline-flex items-center gap-1.5 text-amber-300">
            <XCircle className="h-4 w-4" aria-hidden="true" />
            {status.code} isn’t in our current delivery area. See the delivery page for
            full coverage.
          </span>
        )}
        {status.kind === 'invalid' && (
          <span className="text-amber-300">
            Please enter a valid UK postcode (for example, SE9 1AA).
          </span>
        )}
      </p>
    </div>
  )
}
