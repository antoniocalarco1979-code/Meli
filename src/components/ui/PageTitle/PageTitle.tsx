import type { ReactNode } from 'react'
import './PageTitle.css'

type PageTitleProps = {
  title: string
  subtitle?: string
  action?: ReactNode
}

export function PageTitle({ title, subtitle, action }: PageTitleProps) {
  return (
    <header className="ui-page-title">
      <div>
        <h1 className="ui-page-title__heading">{title}</h1>
        {subtitle && <p className="ui-page-title__subtitle">{subtitle}</p>}
      </div>
      {action}
    </header>
  )
}
