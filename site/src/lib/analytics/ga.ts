import { ga4MeasurementId } from '@/config/site'

/**
 * GA4 placeholder analytics.
 *
 * - Loads ONLY when VITE_GA4_MEASUREMENT_ID is set (disabled by default).
 * - Loads ONLY in the browser (no-op during SSG/prerender).
 * - NO advertising pixels (Google Ads / Meta) are included anywhere, by design.
 *
 * This is deliberately minimal: a real deployment may want consent gating
 * before initialising. Hook that in here.
 */

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

let initialised = false

export function initAnalytics(): void {
  if (initialised) return
  if (typeof window === 'undefined') return
  if (!ga4MeasurementId) return

  initialised = true

  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${ga4MeasurementId}`
  document.head.appendChild(s)

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments)
  }
  window.gtag('js', new Date())
  // SPA: send page_views manually on route change via trackPageview().
  window.gtag('config', ga4MeasurementId, { send_page_view: false })
}

export function trackPageview(path: string, title?: string): void {
  if (typeof window === 'undefined' || !window.gtag || !ga4MeasurementId) return
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title,
  })
}
