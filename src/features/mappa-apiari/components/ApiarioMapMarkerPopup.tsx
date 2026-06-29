import { ArrowRight, CalendarDays, Hexagon, X } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import type { ApiarioMapMarker } from '../types'
import './ApiarioMapMarkerPopup.css'

type ApiarioMapMarkerPopupProps = {
  marker: ApiarioMapMarker
  anchor: { x: number; y: number }
  mapSize: { width: number; height: number }
  onOpenApiario: () => void
  onClose: () => void
}

export function ApiarioMapMarkerPopup({
  marker,
  anchor,
  mapSize,
  onOpenApiario,
  onClose,
}: ApiarioMapMarkerPopupProps) {
  const popupWidth = Math.min(280, mapSize.width - 24)
  const left = Math.min(Math.max(anchor.x - popupWidth / 2, 12), mapSize.width - popupWidth - 12)
  const placeAbove = anchor.y > mapSize.height * 0.55
  const top = placeAbove ? anchor.y - 16 : anchor.y + 16

  return (
    <article
      className={`apiari-map-popup meli-glass meli-glass--deep${placeAbove ? ' apiari-map-popup--above' : ''}`}
      style={{ left, top, width: popupWidth }}
      role="dialog"
      aria-label={`Dettagli apiario ${marker.nome}`}
    >
      <button type="button" className="apiari-map-popup__close" onClick={onClose} aria-label="Chiudi">
        <X size={16} />
      </button>

      <h3 className="apiari-map-popup__title">{marker.nome}</h3>

      <ul className="apiari-map-popup__meta">
        <li>
          <Hexagon size={16} aria-hidden="true" />
          <span>{marker.numeroArnie} arnie</span>
        </li>
        <li>
          <CalendarDays size={16} aria-hidden="true" />
          <span>Ultima visita: {marker.ultimaVisitaLabel}</span>
        </li>
      </ul>

      <Button type="button" variant="primary" size="md" className="apiari-map-popup__action" onClick={onOpenApiario}>
        Apri Apiario
        <ArrowRight size={16} aria-hidden="true" />
      </Button>
    </article>
  )
}
