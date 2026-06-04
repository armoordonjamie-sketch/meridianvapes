import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { AgeGateModal } from './AgeGateModal'
import { CartProvider } from '@/lib/cart/CartContext'
import { initAnalytics, trackPageview } from '@/lib/analytics/ga'

/** Scroll to top + record a GA4 page_view on every client-side navigation. */
function RouteEffects() {
  const { pathname } = useLocation()

  useEffect(() => {
    initAnalytics()
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }
    trackPageview(pathname, document.title)
  }, [pathname])

  return null
}

/**
 * Global app shell. Used as the root route's element so the header, footer and
 * age gate persist across navigations while the page renders into <Outlet>.
 */
export function Layout() {
  return (
    <CartProvider>
      <a
        href="#main"
        className="sr-only z-[110] rounded-lg bg-accent-600 px-4 py-2 font-semibold text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <div className="flex min-h-dvh flex-col">
        <Header />
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          <Outlet />
        </main>
        <Footer />
      </div>
      <AgeGateModal />
      <RouteEffects />
    </CartProvider>
  )
}
