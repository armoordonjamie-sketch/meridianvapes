import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Product } from '@/lib/catalogue/types'

/** A single line in the basket — a snapshot, so prices don't shift unexpectedly. */
export interface CartLine {
  productId: string
  slug: string
  name: string
  unitPriceIncVatPence: number
  quantity: number
}

interface CartContextValue {
  lines: CartLine[]
  /** Total number of items (sum of quantities). */
  count: number
  /** Subtotal including VAT, in pence. */
  subtotalPence: number
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  setQuantity: (productId: string, quantity: number) => void
  clear: () => void
}

const STORAGE_KEY = 'mv_cart_v1'

const CartContext = createContext<CartContextValue | null>(null)

function loadLines(): CartLine[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CartLine[]) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])

  // Hydrate from localStorage on the client only (keeps SSG output stable).
  useEffect(() => {
    setLines(loadLines())
  }, [])

  // Persist on change.
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      /* storage unavailable — ignore */
    }
  }, [lines])

  const addItem = useCallback((product: Product, quantity = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === product.id)
      if (existing) {
        return prev.map((l) =>
          l.productId === product.id
            ? { ...l, quantity: l.quantity + quantity }
            : l,
        )
      }
      return [
        ...prev,
        {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          unitPriceIncVatPence: product.priceIncVatPence,
          quantity,
        },
      ]
    })
  }, [])

  const removeItem = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId))
  }, [])

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.productId !== productId)
        : prev.map((l) =>
            l.productId === productId ? { ...l, quantity } : l,
          ),
    )
  }, [])

  const clear = useCallback(() => setLines([]), [])

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((n, l) => n + l.quantity, 0)
    const subtotalPence = lines.reduce(
      (sum, l) => sum + l.unitPriceIncVatPence * l.quantity,
      0,
    )
    return { lines, count, subtotalPence, addItem, removeItem, setQuantity, clear }
  }, [lines, addItem, removeItem, setQuantity, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
