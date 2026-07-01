import { ExternalLink, MapPin, Minus, Plus } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react'
import {
  buildGoogleMapsUrl,
  buildOsmTileUrl,
  latLngToPixel,
  latToTileY,
  lonToTileX,
  panMapView,
  pixelToLatLng,
  tileToLat,
  tileToLng,
  type MapViewState,
} from '../../utils/mapGeo'
import './GeoPointMap.css'

const TILE_SIZE = 256
const MIN_ZOOM = 5
const MAX_ZOOM = 18
const PAN_THRESHOLD_PX = 8

export type GeoPointMapInteraction = 'view' | 'marker' | 'picker'

type GeoPointMapProps = {
  latitudine: number
  longitudine: number
  zoom?: number
  label?: string
  minHeight?: number
  showGoogleMapsButton?: boolean
  /** @deprecated Usa `interaction="marker"`. */
  interactive?: boolean
  interaction?: GeoPointMapInteraction
  followMarker?: boolean
  showZoomControls?: boolean
  onCoordinatesChange?: (coords: { latitudine: number; longitudine: number }) => void
  onCoordinatesCommit?: (coords: { latitudine: number; longitudine: number }) => void
  onViewChange?: (view: MapViewState) => void
  className?: string
}

export function GeoPointMap({
  latitudine,
  longitudine,
  zoom = 15,
  label,
  minHeight = 280,
  showGoogleMapsButton = true,
  interactive = false,
  interaction,
  followMarker,
  showZoomControls = false,
  onCoordinatesChange,
  onCoordinatesCommit,
  onViewChange,
  className = '',
}: GeoPointMapProps) {
  const resolvedInteraction: GeoPointMapInteraction =
    interaction ?? (interactive ? 'marker' : 'view')
  const shouldFollowMarker = followMarker ?? resolvedInteraction !== 'picker'

  const containerRef = useRef<HTMLDivElement>(null)
  const panOriginRef = useRef<{ x: number; y: number; view: MapViewState } | null>(null)
  const isPanningRef = useRef(false)
  const [size, setSize] = useState({ width: 320, height: minHeight })
  const [view, setView] = useState<MapViewState>({
    centerLat: latitudine,
    centerLng: longitudine,
    zoom,
  })
  const [dragging, setDragging] = useState(false)
  const [panning, setPanning] = useState(false)

  useEffect(() => {
    if (!shouldFollowMarker) {
      setView((current) => ({ ...current, zoom }))
      return
    }

    setView((current) => ({
      ...current,
      centerLat: latitudine,
      centerLng: longitudine,
      zoom,
    }))
  }, [latitudine, longitudine, zoom, shouldFollowMarker])

  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      setSize({
        width: Math.max(Math.round(entry.contentRect.width), 240),
        height: Math.max(Math.round(entry.contentRect.height), minHeight),
      })
    })

    observer.observe(node)
    return () => observer.disconnect()
  }, [minHeight])

  const updateView = (next: MapViewState) => {
    setView(next)
    onViewChange?.(next)
  }

  const changeZoom = (delta: number) => {
    updateView({
      ...view,
      zoom: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, view.zoom + delta)),
    })
  }

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

  const markerPosition = useMemo(
    () =>
      latLngToPixel(
        latitudine,
        longitudine,
        view.centerLat,
        view.centerLng,
        view.zoom,
        size.width,
        size.height,
      ),
    [latitudine, longitudine, size.height, size.width, view.centerLat, view.centerLng, view.zoom],
  )

  const updateFromPointer = (clientX: number, clientY: number) => {
    const container = containerRef.current
    if (!container) return null

    const rect = container.getBoundingClientRect()
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width)
    const y = Math.min(Math.max(clientY - rect.top, 0), rect.height)
    return pixelToLatLng(x, y, view.centerLat, view.centerLng, view.zoom, rect.width, rect.height)
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (resolvedInteraction === 'view') return

    event.preventDefault()
    containerRef.current?.setPointerCapture(event.pointerId)

    if (resolvedInteraction === 'marker') {
      setDragging(true)
      const next = updateFromPointer(event.clientX, event.clientY)
      if (next) onCoordinatesChange?.(next)
      return
    }

    panOriginRef.current = {
      x: event.clientX,
      y: event.clientY,
      view: { ...view },
    }
    isPanningRef.current = false
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (resolvedInteraction === 'marker') {
      if (!dragging) return
      const next = updateFromPointer(event.clientX, event.clientY)
      if (next) onCoordinatesChange?.(next)
      return
    }

    if (resolvedInteraction !== 'picker' || !panOriginRef.current) return

    const dx = event.clientX - panOriginRef.current.x
    const dy = event.clientY - panOriginRef.current.y

    if (!isPanningRef.current && Math.hypot(dx, dy) > PAN_THRESHOLD_PX) {
      isPanningRef.current = true
      setPanning(true)
    }

    if (isPanningRef.current) {
      updateView(
        panMapView(panOriginRef.current.view, dx, dy, size.width, size.height),
      )
    }
  }

  const finishPointer = (event: PointerEvent<HTMLDivElement>) => {
    if (resolvedInteraction === 'view') return

    containerRef.current?.releasePointerCapture(event.pointerId)

    if (resolvedInteraction === 'marker') {
      if (!dragging) return
      setDragging(false)
      const next = updateFromPointer(event.clientX, event.clientY)
      if (next) (onCoordinatesCommit ?? onCoordinatesChange)?.(next)
      return
    }

    if (!isPanningRef.current) {
      const next = updateFromPointer(event.clientX, event.clientY)
      if (next) onCoordinatesChange?.(next)
    }

    panOriginRef.current = null
    isPanningRef.current = false
    setPanning(false)
  }

  const isInteractive = resolvedInteraction !== 'view'
  const frameClass = [
    'geo-point-map__frame',
    isInteractive ? 'geo-point-map__frame--interactive' : '',
    resolvedInteraction === 'picker' ? 'geo-point-map__frame--picker' : '',
    dragging || panning ? 'geo-point-map__frame--dragging' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const googleMapsUrl = buildGoogleMapsUrl(latitudine, longitudine, label)

  return (
    <div className={`geo-point-map${className ? ` ${className}` : ''}`}>
      <div
        ref={containerRef}
        className={frameClass}
        style={{ minHeight }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishPointer}
        onPointerCancel={finishPointer}
        role={isInteractive ? 'application' : 'img'}
        aria-label={label ? `Mappa posizione ${label}` : 'Mappa posizione'}
      >
        <div className="geo-point-map__surface" style={{ width: size.width, height: size.height }}>
          <div className="geo-point-map__tiles" aria-hidden="true">
            {tileLayout.map((tile) => (
              <img
                key={tile.key}
                src={buildOsmTileUrl(tile.x, tile.y, view.zoom)}
                alt=""
                className="geo-point-map__tile"
                style={{ left: tile.left, top: tile.top, width: TILE_SIZE, height: TILE_SIZE }}
                draggable={false}
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            ))}
          </div>

          <span
            className="geo-point-map__pin"
            style={{ left: markerPosition.x, top: markerPosition.y }}
            aria-hidden="true"
          >
            <MapPin size={isInteractive ? 34 : 32} strokeWidth={2.2} />
          </span>
        </div>

        {showZoomControls && (
          <div className="geo-point-map__zoom" aria-label="Controlli zoom">
            <button
              type="button"
              className="geo-point-map__zoom-btn"
              aria-label="Zoom avanti"
              onClick={() => changeZoom(1)}
            >
              <Plus size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="geo-point-map__zoom-btn"
              aria-label="Zoom indietro"
              onClick={() => changeZoom(-1)}
            >
              <Minus size={16} aria-hidden="true" />
            </button>
          </div>
        )}

        <p className="geo-point-map__attribution">
          ©{' '}
          <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">
            OpenStreetMap
          </a>
        </p>
      </div>

      {showGoogleMapsButton && (
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="geo-point-map__external"
        >
          <ExternalLink size={16} aria-hidden="true" />
          🧭 Apri in Google Maps
        </a>
      )}
    </div>
  )
}
