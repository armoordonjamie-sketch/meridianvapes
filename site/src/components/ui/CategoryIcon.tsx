import {
  BatteryCharging,
  Disc3,
  Droplets,
  FlaskConical,
  Plug,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import type { CategorySlug } from '@/lib/catalogue/types'

const ICONS: Record<CategorySlug, LucideIcon> = {
  'pod-kits': Zap,
  'prefilled-pods': BatteryCharging,
  'e-liquids': Droplets,
  'pods-coils': Disc3,
  'nic-shots': FlaskConical,
  accessories: Plug,
}

export function CategoryIcon({
  slug,
  className,
}: {
  slug: CategorySlug
  className?: string
}) {
  const Icon = ICONS[slug]
  return <Icon className={className} aria-hidden="true" strokeWidth={1.5} />
}
