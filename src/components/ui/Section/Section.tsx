import type { HTMLAttributes, ReactNode } from 'react'
import './Section.css'

type SectionProps = HTMLAttributes<HTMLElement> & {
  title?: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
}

export function Section({ title, subtitle, action, children, className = '', ...props }: SectionProps) {
  return (
    <section className={`ui-section ${className}`.trim()} {...props}>
      {(title || action) && (
        <header className="ui-section__header">
          <div>
            {title && <h2 className="ui-section__title">{title}</h2>}
            {subtitle && <p className="ui-section__subtitle">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className="ui-section__body">{children}</div>
    </section>
  )
}
