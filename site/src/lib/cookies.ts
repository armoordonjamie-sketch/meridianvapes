/**
 * Tiny SSR-safe cookie helper. No third-party tracking — only first-party
 * functional cookies (age-gate acknowledgement, etc.).
 */

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'),
  )
  return match ? decodeURIComponent(match[1]) : null
}

export function setCookie(
  name: string,
  value: string,
  days = 365,
): void {
  if (typeof document === 'undefined') return
  const maxAge = days * 24 * 60 * 60
  document.cookie =
    `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`
}

export function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`
}
