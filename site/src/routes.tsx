import type { RouteRecord } from 'vite-react-ssg'
import { Layout } from '@/components/layout/Layout'
import LegalPage from '@/pages/LegalPage'
import NotFound from '@/pages/NotFound'
import { LEGAL_DOCS } from '@/data/legal'

/**
 * Map a module with a default export to React Router's lazy `Component` shape,
 * so each page is code-split into its own chunk while keeping default exports.
 */
function page(factory: () => Promise<{ default: React.ComponentType }>) {
  return async () => {
    const mod = await factory()
    return { Component: mod.default }
  }
}

/** Legal pages all share one (eagerly imported, lightweight) component. */
const legalRoutes: RouteRecord[] = Object.keys(LEGAL_DOCS).map((slug) => ({
  path: slug,
  element: <LegalPage slug={slug} />,
}))

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, lazy: page(() => import('@/pages/Home')) },
      { path: 'shop', lazy: page(() => import('@/pages/Shop')) },
      { path: 'shop/:category', lazy: page(() => import('@/pages/Shop')) },
      { path: 'product/:slug', lazy: page(() => import('@/pages/ProductDetail')) },
      { path: 'delivery', lazy: page(() => import('@/pages/Delivery')) },
      { path: 'areas/:area', lazy: page(() => import('@/pages/AreaLanding')) },
      { path: 'about', lazy: page(() => import('@/pages/About')) },
      { path: 'help', lazy: page(() => import('@/pages/Help')) },
      { path: 'contact', lazy: page(() => import('@/pages/Contact')) },
      { path: 'account', lazy: page(() => import('@/pages/Account')) },
      { path: 'cart', lazy: page(() => import('@/pages/Cart')) },
      { path: 'checkout', lazy: page(() => import('@/pages/Checkout')) },
      ...legalRoutes,
      { path: '*', element: <NotFound /> },
    ],
  },
]
