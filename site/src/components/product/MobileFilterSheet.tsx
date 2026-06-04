import { useEffect } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { Filters } from './Filters'
import type { CatalogueFacets, CatalogueFilters } from '@/lib/catalogue/types'

export function MobileFilterSheet({
  open,
  onClose,
  facets,
  value,
  onChange,
  resultCount,
}: {
  open: boolean
  onClose: () => void
  facets: CatalogueFacets
  value: CatalogueFilters
  onChange: (next: CatalogueFilters) => void
  resultCount: number
}) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const activeCount =
    (value.brands?.length ?? 0) +
    (value.flavourFamilies?.length ?? 0) +
    (value.deviceTypes?.length ?? 0) +
    (value.strengthsMg?.length ?? 0)

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Product filters">
      <button
        type="button"
        className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm"
        aria-label="Close filters"
        onClick={onClose}
      />
      <div className="absolute inset-x-0 bottom-0 flex max-h-[min(88dvh,720px)] flex-col rounded-t-2xl border border-white/10 bg-ink-900 shadow-2xl pb-[env(safe-area-inset-bottom)]">
        <div className="flex shrink-0 items-center justify-between border-b border-white/[0.07] px-4 py-3">
          <h2 className="flex items-center gap-2 text-base font-semibold text-silver-100">
            <SlidersHorizontal className="h-4 w-4 text-accent-300" aria-hidden="true" />
            Filters
            {activeCount > 0 && (
              <span className="rounded-full bg-accent-500/20 px-2 py-0.5 text-xs font-medium text-accent-200">
                {activeCount}
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-lg text-silver-300 hover:bg-white/5"
            aria-label="Close filters"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-2">
          <Filters facets={facets} value={value} onChange={onChange} embedded />
        </div>

        <div className="shrink-0 border-t border-white/[0.07] p-4">
          <button
            type="button"
            onClick={onClose}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-accent-600 text-base font-semibold text-white hover:bg-accent-500"
          >
            Show {resultCount} {resultCount === 1 ? 'product' : 'products'}
          </button>
        </div>
      </div>
    </div>
  )
}
