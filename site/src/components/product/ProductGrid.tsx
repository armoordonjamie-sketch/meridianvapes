import { PackageOpen } from 'lucide-react'
import { ProductCard } from './ProductCard'
import type { Product } from '@/lib/catalogue/types'

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="surface flex flex-col items-center gap-3 rounded-2xl p-12 text-center">
        <PackageOpen className="h-8 w-8 text-silver-500" aria-hidden="true" />
        <p className="text-silver-300">No products match the selected filters.</p>
        <p className="text-sm text-silver-500">
          Try clearing a filter to see more results.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
