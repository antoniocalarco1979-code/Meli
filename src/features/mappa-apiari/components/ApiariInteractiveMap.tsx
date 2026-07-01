import { Minus, Plus } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react'
import {
  buildOsmTileUrl,
  computeMapViewForPoints,
  latLngToPixel,
  latToTileY,
  lonToTileX,
  panMapView,
  tileToLat,
  tileToLng,
  type MapViewState,
} from '../../../utils/mapGeo'
import type { ApiarioMapMarker } from '../types'
import { ApiarioMapMarkerPopup } from './ApiarioMapMarkerPopup'
import './ApiariInteractiveMap.css'

const MIN_ZOOM = 5
const MAX_ZOOM = 18
const TILE_SIZE = 256

type ApiariInteractiveMapProps = {
  markers: ApiarioMapMarker[]
  onOpenApiario: (apiarioId: string) => void
}

export function ApiariInteractiveMap({ markers, onOpenApiario }: ApiariInteractiveMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 360, height: 420 })
  const [view, setView] = useState<MapViewState>(() =>
    computeMapViewForPoints(markers, 360, 420),
  )
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const dragStartRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (markers.length === 0) return
    setView(computeMapViewForPoints(markers, size.width, size.height))
    setSelectedId(null)
  }, [markers, size.width, size.height])

  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      setSize({
        width: Math.max(Math.round(entry.contentRect.width), 280),
        height: Math.max(Math.round(entry.contentRect.height), 320),
      })
    })

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const selectedMarker = useMemo(
    () => markers.find((marker) => marker.id === selectedId) ?? null,
    [markers, selectedId],
  )

  const tileLayout = useMemo(() => {
    const centerTileX = lonToTileX(view.centerLng, view.zoom)
    const centerTileY = latToTileY(view.centerLat, view.zoom)
    const tiles: { key: string; x: number; y: number; left: number; top: number }[] = []
    const radius = 2

    for (let dx = -radius; dx <= radius; dx += 1) {
      for (let dy = -radius; dy <= radius; dy += 1) {
        const tileX = centerTileX + dx
        const tileY = centerTileY + dy
        const topLeft = latLngToPixel(
          tileToLat(tileY, view.zoom),
          tileToLng(tileX, view.zoom),
          view.centerLat,
          view.centerLng,
          view.zoom,
          size.width,
          size.height,
        )
        tiles.push({
          key: `${view.zoom}-${tileX}-${tileY}`,
          x: tileX,
          y: tileY,
          left: topLeft.x,
          top: topLeft.y,
        })
      }
    }

    return tiles
  }, [size.height, size.width, view.centerLat, view.centerLng, view.zoom])

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('.apiari-map__marker, .apiari-map__popup, .apiari-map__controls')) {
      return
    }
    containerRef.current?.setPointerCapture(event.pointerId)
    dragStartRef.current = { x: event.clientX, y: event.clientY }
    setDragging(true)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return
    const deltaX = event.clientX - dragStartRef.current.x
    const deltaY = event.clientY - dragStartRef.current.y
    dragStartRef.current = { x: event.clientX, y: event.clientY }
    setView((current) => panMapView(current, deltaX, deltaY, size.width, size.height))
  }

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return
    setDragging(false)
    containerRef.current?.releasePointerCapture(event.pointerId)
  }

  const zoomBy = (delta: number) => {
    setView((current) => ({
      ...current,
      zoom: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, current.zoom + delta)),
    }))
  }

  return (
    <div
      ref={containerRef}
      className={`apiari-map${dragging ? ' apiari-map--dragging' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      role="application"
      aria-label="Mappa interattiva apiari"
    >
      <div className="apiari-map__surface">
        <div className="apiari-map__tiles" aria-hidden="true">
          {tileLayout.map((tile) => (
            <img
              key={tile.key}
              src={buildOsmTileUrl(tile.x, tile.y, view.zoom)}
              alt=""
              className="apiari-map__tile"
              style={{ left: tile.left, top: tile.top, width: TILE_SIZE, height: TILE_SIZE }}
              draggable={false}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          ))}
        </div>

        {markers.map((marker) => {
          const position = latLngToPixel(
            marker.latitudine,
            marker.longitudine,
            view.centerLat,
            view.centerLng,
            view.zoom,
            size.width,
            size.height,
          )
          const isSelected = marker.id === selectedId

          return (
            <button
              key={marker.id}
              type="button"
              className={`apiari-map__marker${isSelected ? ' apiari-map__marker--active' : ''}`}
              style={{ left: position.x, top: position.y }}
              onClick={(event) => {
                event.stopPropagation()
                setSelectedId(marker.id)
              }}
              aria-label={`Apiario ${marker.nome}`}
            >
              <span className="apiari-map__marker-dot" aria-hidden="true" />
              <span className="apiari-map__marker-label">{marker.nome}</span>
            </button>
          )
        })}

        {selectedMarker && (
          <ApiarioMapMarkerPopup
            marker={selectedMarker}
            anchor={latLngToPixel(
              selectedMarker.latitudine,
              selectedMarker.longitudine,
              view.centerLat,
              view.centerLng,
              view.zoom,
              size.width,
              size.height,
            )}
            mapSize={size}
            onOpenApiario={() => onOpenApiario(selectedMarker.id)}
            onClose={() => setSelectedId(null)}
          />
        )}
      </div>

      <div className="apiari-map__controls" aria-label="Controlli zoom mappa">
        <button type="button" className="apiari-map__control" onClick={() => zoomBy(1)} aria-label="Zoom avanti">
          <Plus size={18} />
        </button>
        <button type="button" className="apiari-map__control" onClick={() => zoomBy(-1)} aria-label="Zoom indietro">
          <Minus size={18} />
        </button>
      </div>
    </div>
  )
}
