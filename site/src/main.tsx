import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './routes'
import './index.css'

/**
 * vite-react-ssg entry. The same `createRoot` is used to prerender every route
 * to static HTML at build time and to hydrate on the client.
 */
export const createRoot = ViteReactSSG({ routes })
