import { MapPin } from 'lucide-react'
import { useCallback, useMemo, useRef, useState, type PointerEvent } from 'react'
import { buildStaticMapUrl, pixelToLatLng } from '../utils/mapProjection'
import './ApiarioPosizioneMap.css'

const MAP_ZOOM = 15

type ApiarioPosizioneMapProps = {
  latitudine: number
  longitudine: number
  onCoordinatesChange: (coords: { latitudine: number; longitudine: number }) => void
  onCoordinatesCommit?: (coords: { latitudine: number; longitudine: number }) => void
}

export function ApiarioPosizioneMap({
  latitudine,
  longitudine,
  onCoordinatesChange,
  onCoordinatesCommit,
}: ApiarioPosizioneMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)

  const mapUrl = useMemo(
    () => buildStaticMapUrl(latitudine, longitudine, MAP_ZOOM),
    [latitudine, longitudine],
  )

  const updateFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const container = containerRef.current
      if (!container) return null

      const rect = container.getBoundingClientRect()
      const x = Math.min(Math.max(clientX - rect.left, 0), rect.width)
      const y = Math.min(Math.max(clientY - rect.top, 0), rect.height)
      return pixelToLatLng(x, y, latitudine, longitudine, MAP_ZOOM, rect.width, rect.height)
    },
    [latitudine, longitudine],
  )

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.preventDefault()
    containerRef.current?.setPointerCapture(event.pointerId)
    setDragging(true)
    const next = updateFromPointer(event.clientX, event.clientY)
    if (next) onCoordinatesChange(next)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return
    const next = updateFromPointer(event.clientX, event.clientY)
    if (next) onCoordinatesChange(next)
  }

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return
    setDragging(false)
    containerRef.current?.releasePointerCapture(event.pointerId)
    const next = updateFromPointer(event.clientX, event.clientY)
    if (next) (onCoordinatesCommit ?? onCoordinatesChange)(next)
  }

  return (
    <div className="apiario-posizione-map">
      <div
        ref={containerRef}
        className={`apiario-posizione-map__frame${dragging ? ' apiario-posizione-map__frame--dragging' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        role="application"
        aria-label="Mappa posizione apiario. Trascina il pin o tocca la mappa per spostarlo."
      >
        <img
          src={mapUrl}
          alt=""
          className="apiario-posizione-map__image"
          draggable={false}
        />
        <span className="apiario-posizione-map__pin" aria-hidden="true">
          <MapPin size={34} strokeWidth={2.2} />
        </span>
      </div>
      <p className="apiario-posizione-map__hint">
        Trascina il pin o tocca la mappa per affinare la posizione.
      </p>
    </div>
  )
}
