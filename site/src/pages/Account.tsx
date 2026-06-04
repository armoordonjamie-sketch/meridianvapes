import { useState } from 'react'
import { Home, LogOut, PackageSearch, ShieldCheck } from 'lucide-react'
import { Seo } from '@/lib/seo/Seo'
import { PageHeader } from '@/components/common/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { formattedAddress } from '@/config/site'

/**
 * Account area. Auth is a front-end stub — wire `login`/`logout` to the
 * FastAPI backend (session/JWT). Order history, saved addresses and the
 * age-verified flag would all come from the backend per authenticated user.
 * Marked noindex (private, transactional).
 */
export default function Account() {
  const [email, setEmail] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)

  return (
    <>
      <Seo title="Account" description="Sign in to your Meridian Vapes account." path="/account" noindex />

      <PageHeader
        eyebrow="Account"
        title={loggedIn ? 'Your account' : 'Sign in'}
        crumbs={[
          { name: 'Home', path: '/' },
          { name: 'Account', path: '/account' },
        ]}
      />

      <div className="container-page py-12">
        {!loggedIn ? (
          <div className="mx-auto max-w-md">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setLoggedIn(true)
              }}
              className="surface space-y-5 rounded-2xl p-6 sm:p-8"
            >
              <div>
                <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-silver-200">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="h-12 w-full rounded-xl border border-white/12 bg-ink-850 px-3 text-silver-100"
                />
              </div>
              <div>
                <label htmlFor="login-pass" className="mb-1.5 block text-sm font-medium text-silver-200">
                  Password
                </label>
                <input
                  id="login-pass"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="h-12 w-full rounded-xl border border-white/12 bg-ink-850 px-3 text-silver-100"
                />
              </div>
              <button
                type="submit"
                className="h-12 w-full rounded-xl bg-accent-600 px-6 font-semibold text-white transition-colors hover:bg-accent-500"
              >
                Sign in
              </button>
              <p className="text-center text-xs text-silver-500">
                Demonstration only — authentication is not connected. Wire this to the
                backend to enable real accounts.
              </p>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-silver-400">Signed in as</p>
                <p className="text-lg font-semibold text-silver-50">{email || 'demo@meridianvapes.co.uk'}</p>
              </div>
              <button
                type="button"
                onClick={() => setLoggedIn(false)}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/15 px-4 text-sm font-semibold text-silver-200 hover:bg-white/5"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Sign out
              </button>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {/* Age-verified status */}
              <div className="surface rounded-2xl p-6">
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <ShieldCheck className="h-5 w-5 text-accent-300" aria-hidden="true" />
                  Age verification
                </h2>
                <div className="mt-3 flex items-center gap-3">
                  <Badge tone="success">Verified · 18+</Badge>
                  <span className="text-sm text-silver-400">
                    Saved status reduces repeat checks. Confirmed again on delivery.
                  </span>
                </div>
              </div>

              {/* Saved address */}
              <div className="surface rounded-2xl p-6">
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <Home className="h-5 w-5 text-accent-300" aria-hidden="true" />
                  Saved address
                </h2>
                <p className="mt-3 text-sm not-italic text-silver-300">{formattedAddress}</p>
              </div>

              {/* Order history */}
              <div className="surface rounded-2xl p-6 lg:col-span-2">
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <PackageSearch className="h-5 w-5 text-accent-300" aria-hidden="true" />
                  Order history
                </h2>
                <div className="mt-4 rounded-xl border border-dashed border-white/10 p-8 text-center text-silver-500">
                  No orders yet. Your past orders will appear here once the backend is
                  connected.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
