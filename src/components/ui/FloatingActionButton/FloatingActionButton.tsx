import type { ButtonHTMLAttributes, ReactNode } from 'react'
import './FloatingActionButton.css'

type FloatingActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode
  label?: string
}

export function FloatingActionButton({
  icon,
  label,
  className = '',
  ...props
}: FloatingActionButtonProps) {
  return (
    <button
      type="button"
      className={`ui-fab ${className}`.trim()}
      aria-label={label}
      title={label}
      {...props}
    >
      {icon}
    </button>
  )
}
