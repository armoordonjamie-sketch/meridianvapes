import type { ReactNode } from 'react'
import { Breadcrumbs, type Crumb } from './Breadcrumbs'

export function PageHeader({
  title,
  intro,
  eyebrow,
  crumbs,
  children,
}: {
  title: string
  intro?: ReactNode
  eyebrow?: string
  crumbs?: Crumb[]
  children?: ReactNode
}) {
  return (
    <header className="border-b border-white/[0.07] bg-ink-900/30">
      <div className="container-page py-10 sm:py-14">
        {crumbs && crumbs.length > 0 && (
          <div className="mb-5">
            <Breadcrumbs crumbs={crumbs} />
          </div>
        )}
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="text-3xl font-extrabold sm:text-4xl">{title}</h1>
        {intro && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-silver-300">
            {intro}
          </p>
        )}
        {children}
      </div>
    </header>
  )
}
