import type { HTMLAttributes, ReactNode } from 'react'
import './Card.css'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  glass?: boolean
  deep?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({
  children,
  glass = true,
  deep = false,
  padding = 'md',
  className = '',
  ...props
}: CardProps) {
  const classes = [
    'ui-card',
    glass ? 'meli-glass' : '',
    deep ? 'meli-glass--deep' : '',
    `ui-card--padding-${padding}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}
