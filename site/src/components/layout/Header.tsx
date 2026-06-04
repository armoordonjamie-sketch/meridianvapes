import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, ShoppingBag, User, X } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { SearchBar } from './SearchBar'
import { PostcodeChecker } from './PostcodeChecker'
import { useCart } from '@/lib/cart/CartContext'
import { siteConfig } from '@/config/site'

const NAV = [
  { label: 'Shop', to: '/shop' },
  { label: 'Delivery', to: '/delivery' },
  { label: 'About', to: '/about' },
  { label: 'Help', to: '/help' },
]

function navClass({ isActive }: { isActive: boolean }) {
  return [
    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive ? 'text-accent-300' : 'text-silver-300 hover:text-white',
  ].join(' ')
}

export function Header() {
  const { count } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-ink-950/85 backdrop-blur-md">
      {/* Single header bar */}
      <div className="container-page flex h-16 items-center gap-3">
        <button
          type="button"
          className="-ml-1 inline-flex h-10 w-10 items-center justify-center rounded-lg text-silver-200 hover:bg-white/5 lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link to="/" className="flex items-center gap-2.5" aria-label={`${siteConfig.name} home`}>
          <Logo variant="mark" eager decorative className="h-9 w-auto" />
          <Logo variant="wordmark" eager decorative className="hidden h-4 w-auto sm:block" />
        </Link>

        <nav aria-label="Primary" className="ml-2 hidden items-center lg:flex">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} className={navClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/* Compact "deliver to" postcode field — result floats so the bar
              height stays fixed. Hidden below xl to keep the single row calm. */}
          <div className="relative hidden w-56 xl:block">
            <PostcodeChecker compact floatStatus id="header-postcode" />
          </div>

          <SearchBar className="hidden w-48 md:block lg:w-56" />

          <Link
            to="/account"
            className="hidden h-10 w-10 items-center justify-center rounded-lg text-silver-200 hover:bg-white/5 sm:inline-flex"
            aria-label="Account"
          >
            <User className="h-5 w-5" />
          </Link>

          <Link
            to="/cart"
            className="relative inline-flex h-10 items-center gap-2 rounded-lg px-2.5 text-silver-200 hover:bg-white/5"
            aria-label={`Basket${count > 0 ? `, ${count} item${count === 1 ? '' : 's'}` : ', empty'}`}
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-accent-500 px-1 text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-white/[0.07] bg-ink-950 lg:hidden"
        >
          <div className="container-page space-y-4 py-4">
            <SearchBar onSubmitted={() => setMenuOpen(false)} />
            <nav aria-label="Mobile" className="grid">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2.5 text-base font-medium ${
                      isActive ? 'text-accent-300' : 'text-silver-200 hover:bg-white/5'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <NavLink
                to="/account"
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-base font-medium ${
                    isActive ? 'text-accent-300' : 'text-silver-200 hover:bg-white/5'
                  }`
                }
              >
                Account
              </NavLink>
            </nav>
            <div className="rounded-xl border border-white/[0.07] p-3">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-silver-500">
                Deliver to
              </p>
              <PostcodeChecker compact id="mobile-postcode" />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
