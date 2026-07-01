import type { ReactNode } from 'react'
import { MapPin } from 'lucide-react'
import { Button } from '../ui/Button'
import './MapPositionEmptyState.css'

type MapPositionEmptyStateProps = {
  onSetPosition?: () => void
  actionLabel?: string
  children?: ReactNode
}

export function MapPositionEmptyState({
  onSetPosition,
  actionLabel = 'Imposta posizione',
  children,
}: MapPositionEmptyStateProps) {
  return (
    <div className="map-position-empty meli-glass meli-glass--deep">
      <MapPin size={28} strokeWidth={1.75} aria-hidden="true" className="map-position-empty__icon" />
      <p className="map-position-empty__message">Posizione non ancora impostata</p>
      {children}
      {onSetPosition && (
        <Button type="button" variant="secondary" size="md" onClick={onSetPosition}>
          📍 {actionLabel}
        </Button>
      )}
    </div>
  )
}
