import type { DeviceType, FlavourFamily } from './catalogue/types'

/** Format integer pence as a GBP price string, e.g. 1999 => "£19.99". */
export function formatPrice(pence: number, currency: 'GBP' = 'GBP'): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
  }).format(pence / 100)
}

const FLAVOUR_LABELS: Record<FlavourFamily, string> = {
  fruit: 'Fruit',
  menthol: 'Menthol',
  mint: 'Mint',
  tobacco: 'Tobacco',
  dessert: 'Dessert',
  beverage: 'Beverage',
  unflavoured: 'Unflavoured',
}

const DEVICE_LABELS: Record<DeviceType, string> = {
  'pod-system': 'Pod system',
  'vape-pen': 'Vape pen',
  'mod-kit': 'Mod kit',
  coil: 'Pod / coil',
  'not-applicable': 'N/A',
}

export function flavourLabel(f: FlavourFamily): string {
  return FLAVOUR_LABELS[f]
}

export function deviceLabel(d: DeviceType): string {
  return DEVICE_LABELS[d]
}

/** "10mg/ml", or "Nicotine-free" for 0, or "" when not applicable. */
export function strengthLabel(mg?: number): string {
  if (mg === undefined) return ''
  if (mg === 0) return 'Nicotine-free'
  return `${mg}mg/ml`
}
