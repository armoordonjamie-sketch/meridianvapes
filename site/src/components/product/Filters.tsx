import { useId } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { deviceLabel, flavourLabel, strengthLabel } from '@/lib/format'
import type {
  CatalogueFacets,
  CatalogueFilters,
  DeviceType,
  FlavourFamily,
} from '@/lib/catalogue/types'

type ArrayFacetKey = 'brands' | 'flavourFamilies' | 'deviceTypes' | 'strengthsMg'

function toggle<T>(list: T[] | undefined, value: T): T[] {
  const set = new Set(list ?? [])
  if (set.has(value)) set.delete(value)
  else set.add(value)
  return [...set]
}

function FilterGroup<T extends string | number>({
  title,
  options,
  selected,
  format,
  onToggle,
}: {
  title: string
  options: T[]
  selected: T[] | undefined
  format: (v: T) => string
  onToggle: (v: T) => void
}) {
  const groupId = useId()
  if (options.length === 0) return null
  return (
    <fieldset className="border-t border-white/[0.07] py-4 first:border-t-0 first:pt-0">
      <legend className="mb-3 text-sm font-semibold text-silver-200">{title}</legend>
      <div className="space-y-2">
        {options.map((opt) => {
          const id = `${groupId}-${String(opt)}`
          const checked = (selected ?? []).includes(opt)
          return (
            <label
              key={String(opt)}
              htmlFor={id}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-silver-300"
            >
              <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(opt)}
                className="h-4 w-4 rounded border-white/20 bg-ink-850 text-accent-500 accent-accent-500"
              />
              {format(opt)}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export function Filters({
  facets,
  value,
  onChange,
  embedded = false,
}: {
  facets: CatalogueFacets
  value: CatalogueFilters
  onChange: (next: CatalogueFilters) => void
  /** Strip outer card chrome when shown inside the mobile sheet. */
  embedded?: boolean
}) {
  const update = <K extends ArrayFacetKey>(key: K, item: NonNullable<CatalogueFilters[K]>[number]) => {
    onChange({ ...value, [key]: toggle(value[key] as never[], item as never) })
  }

  const activeCount =
    (value.brands?.length ?? 0) +
    (value.flavourFamilies?.length ?? 0) +
    (value.deviceTypes?.length ?? 0) +
    (value.strengthsMg?.length ?? 0)

  return (
    <div className={embedded ? 'py-1' : 'surface rounded-2xl p-5'}>
      {!embedded && (
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-silver-100">
            <SlidersHorizontal className="h-4 w-4 text-accent-300" aria-hidden="true" />
            Filters
          </h2>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={() =>
                onChange({ category: value.category, query: value.query })
              }
              className="inline-flex items-center gap-1 text-xs font-medium text-silver-400 hover:text-accent-300"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              Clear ({activeCount})
            </button>
          )}
        </div>
      )}
      {embedded && activeCount > 0 && (
        <button
          type="button"
          onClick={() => onChange({ category: value.category, query: value.query })}
          className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-accent-300"
        >
          <X className="h-4 w-4" aria-hidden="true" />
          Clear all filters ({activeCount})
        </button>
      )}

      <div className={embedded ? '' : 'mt-4'}>
        <FilterGroup<number>
          title="Nicotine strength"
          options={facets.strengthsMg}
          selected={value.strengthsMg}
          format={(v) => strengthLabel(v)}
          onToggle={(v) => update('strengthsMg', v)}
        />
        <FilterGroup<FlavourFamily>
          title="Flavour family"
          options={facets.flavourFamilies}
          selected={value.flavourFamilies}
          format={flavourLabel}
          onToggle={(v) => update('flavourFamilies', v)}
        />
        <FilterGroup<DeviceType>
          title="Device type"
          options={facets.deviceTypes}
          selected={value.deviceTypes}
          format={deviceLabel}
          onToggle={(v) => update('deviceTypes', v)}
        />
        <FilterGroup<string>
          title="Brand"
          options={facets.brands}
          selected={value.brands}
          format={(v) => v}
          onToggle={(v) => update('brands', v)}
        />
      </div>
    </div>
  )
}
