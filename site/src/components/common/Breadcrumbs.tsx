import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export interface Crumb {
  name: string
  path: string
}

/**
 * Visible breadcrumb trail. Pair with `breadcrumbSchema(crumbs)` in the page's
 * <Seo jsonLd=...> so the visual trail and the structured data stay in sync.
 */
export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 text-silver-400">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1
          return (
            <li key={c.path} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="text-silver-200">
                  {c.name}
                </span>
              ) : (
                <Link to={c.path} className="hover:text-accent-300">
                  {c.name}
                </Link>
              )}
              {!last && (
                <ChevronRight className="h-4 w-4 text-silver-600" aria-hidden="true" />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
