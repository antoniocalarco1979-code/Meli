import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'
import './EmptyState.css'

type EmptyStateProps = {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="ui-empty-state meli-glass">
      <div className="ui-empty-state__icon" aria-hidden="true">
        {icon ?? <Inbox size={40} strokeWidth={1.5} />}
      </div>
      <h3 className="ui-empty-state__title">{title}</h3>
      {description && <p className="ui-empty-state__desc">{description}</p>}
      {action && <div className="ui-empty-state__action">{action}</div>}
    </div>
  )
}
