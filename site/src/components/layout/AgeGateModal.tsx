import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/ui/Logo'
import { useAgeGate } from '@/lib/age/useAgeGate'
import { MINIMUM_AGE, siteConfig } from '@/config/site'

/**
 * First-visit age gate.
 *
 * SEO-SAFE BY DESIGN:
 *  - The whole site is prerendered, so all content is already present in the
 *    static HTML that crawlers fetch — this overlay does not remove or hide
 *    any of it from the document.
 *  - The overlay only mounts on the client AFTER hydration, and `useAgeGate`
 *    skips it entirely for known crawler/preview user-agents (and during
 *    prerender). No `noindex` is ever emitted.
 *  - It is dismissible to a first-party functional cookie (no tracking).
 */
export function AgeGateModal() {
  const { state, accept, decline } = useAgeGate()
  const confirmRef = useRef<HTMLButtonElement>(null)
  const open = state === 'prompt' || state === 'declined'

  // Lock background scroll only while the gate is visible (client-only).
  useEffect(() => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (state === 'prompt') confirmRef.current?.focus()
  }, [state])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      aria-describedby="age-gate-desc"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink-950/85 backdrop-blur-sm" aria-hidden="true" />

      <div className="surface relative w-full max-w-md animate-scale-in rounded-2xl p-8 text-center">
        <div className="mx-auto mb-5 flex justify-center">
          <Logo variant="mark" decorative className="h-16 w-auto" />
        </div>

        {state === 'prompt' ? (
          <>
            <h2 id="age-gate-title" className="text-2xl font-bold text-silver-50">
              Are you {MINIMUM_AGE} or over?
            </h2>
            <p id="age-gate-desc" className="mt-3 text-sm leading-relaxed text-silver-400">
              {siteConfig.name} sells age-restricted vaping products that contain
              nicotine. You must be {MINIMUM_AGE} or over to enter. Your age will also be
              verified at checkout and on delivery.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                ref={confirmRef}
                type="button"
                onClick={accept}
                className="h-12 rounded-xl bg-accent-600 px-5 font-semibold text-white transition-colors hover:bg-accent-500"
              >
                Yes, I am {MINIMUM_AGE} or over
              </button>
              <button
                type="button"
                onClick={decline}
                className="h-12 rounded-xl border border-white/15 px-5 font-semibold text-silver-200 transition-colors hover:bg-white/5"
              >
                No
              </button>
            </div>
            <p className="mt-5 text-xs text-silver-500">
              By entering you agree to our{' '}
              <Link to="/age-verification" className="text-accent-300 hover:underline">
                age verification policy
              </Link>
              .
            </p>
          </>
        ) : (
          <>
            <h2 id="age-gate-title" className="text-2xl font-bold text-silver-50">
              Sorry, you must be {MINIMUM_AGE} or over
            </h2>
            <p id="age-gate-desc" className="mt-3 text-sm leading-relaxed text-silver-400">
              You have indicated that you are under {MINIMUM_AGE}. It is illegal to sell
              vaping products to anyone under {MINIMUM_AGE} in the UK, so you cannot use
              this site.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={accept}
                className="text-sm text-accent-300 hover:underline"
              >
                I entered my age by mistake — I am {MINIMUM_AGE} or over
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
