import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'

export function SearchBar({
  className = '',
  onSubmitted,
}: {
  className?: string
  /** Called after a successful submit (e.g. to close a mobile menu). */
  onSubmitted?: () => void
}) {
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const query = q.trim()
    navigate(query ? `/shop?q=${encodeURIComponent(query)}` : '/shop')
    onSubmitted?.()
  }

  return (
    <form role="search" onSubmit={submit} className={`relative ${className}`}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-silver-500"
        aria-hidden="true"
      />
      <label htmlFor="site-search" className="sr-only">
        Search products
      </label>
      <input
        id="site-search"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search products"
        className="h-10 w-full rounded-xl border border-white/12 bg-ink-850 pl-9 pr-3 text-sm text-silver-100 placeholder:text-silver-500"
      />
    </form>
  )
}
