import type { HTMLAttributes, ReactNode } from 'react'
import './Badge.css'

type BadgeVariant = 'default' | 'honey' | 'gold' | 'sage' | 'danger'

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode
  variant?: BadgeVariant
}

export function Badge({ children, variant = 'default', className = '', ...props }: BadgeProps) {
  return (
    <span className={`ui-badge ui-badge--${variant} ${className}`.trim()} {...props}>
      {children}
    </span>
  )
}
