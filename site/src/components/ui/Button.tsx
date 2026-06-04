import { Link } from 'react-router-dom'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50'

const variants: Record<Variant, string> = {
  // accent-600 resting gives white-on-blue ≥ 5.5:1 (WCAG AA for text).
  primary: 'bg-accent-600 text-white hover:bg-accent-500',
  secondary:
    'border border-white/15 bg-white/[0.03] text-silver-100 hover:bg-white/[0.07]',
  ghost: 'text-silver-200 hover:bg-white/[0.06] hover:text-white',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
}

interface CommonProps {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    to?: undefined
    href?: undefined
  }

type ButtonAsLink = CommonProps & {
  /** Internal route — rendered as a React Router <Link>. */
  to: string
  href?: undefined
}

type ButtonAsAnchor = CommonProps & {
  /** External URL — rendered as a plain <a>. */
  href: string
  to?: undefined
}

type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor

export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', className = '', children } = props
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`

  if ('to' in props && props.to) {
    return (
      <Link to={props.to} className={classes}>
        {children}
      </Link>
    )
  }
  if ('href' in props && props.href) {
    return (
      <a
        href={props.href}
        className={classes}
        rel="noopener noreferrer"
        target="_blank"
      >
        {children}
      </a>
    )
  }

  // Native button: forward only valid button attributes (strip our own props).
  const rest: Record<string, unknown> = { ...props }
  delete rest.variant
  delete rest.size
  delete rest.className
  delete rest.children
  delete rest.to
  delete rest.href
  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  )
}
