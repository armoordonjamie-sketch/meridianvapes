import { useEffect, useState } from 'react'
import { getCookie, setCookie } from '@/lib/cookies'

/** First-party functional cookie recording the 18+ acknowledgement. */
export const AGE_COOKIE = 'mv_age_ok'

const CRAWLER_RE =
  /bot|crawl|spider|slurp|googlebot|bingbot|bingpreview|duckduckbot|baiduspider|yandex|facebookexternalhit|embedly|quora|pinterest|slackbot|twitterbot|whatsapp|telegram|applebot|petalbot|semrush|ahrefs|lighthouse|headless/i

/**
 * Best-effort crawler / preview-bot detection.
 *
 * The age-gate is a purely client-side overlay layered on top of fully
 * prerendered content, so crawlers already receive complete, indexable HTML.
 * As defence in depth we ALSO skip showing the gate to known bots (and during
 * prerender, where `navigator` is undefined) so it can never interfere with
 * indexing or page rendering for crawlers.
 */
export function isLikelyCrawler(): boolean {
  if (typeof navigator === 'undefined') return true
  return CRAWLER_RE.test(navigator.userAgent)
}

export type AgeGateState = 'loading' | 'accepted' | 'prompt' | 'declined'

export function useAgeGate() {
  const [state, setState] = useState<AgeGateState>('loading')

  useEffect(() => {
    if (isLikelyCrawler()) {
      setState('accepted')
      return
    }
    setState(getCookie(AGE_COOKIE) === 'true' ? 'accepted' : 'prompt')
  }, [])

  const accept = () => {
    setCookie(AGE_COOKIE, 'true')
    setState('accepted')
  }

  const decline = () => setState('declined')

  return { state, accept, decline, ready: state !== 'loading' }
}
