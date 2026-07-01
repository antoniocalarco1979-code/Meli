import { ExternalLink, MapPin } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react'
import {
  buildGoogleMapsUrl,
  buildOsmTileUrl,
  latLngToPixel,
  latToTileY,
  lonToTileX,
  pixelToLatLng,
  tileToLat,
  tileToLng,
  type MapViewState,
} from '../../utils/mapGeo'
import './GeoPointMap.css'

const TILE_SIZE = 256

type GeoPointMapProps = {
  latitudine: number
  longitudine: number
  zoom?: number
  label?: string
  minHeight?: number
  showGoogleMapsButton?: boolean
  interactive?: boolean
  onCoordinatesChange?: (coords: { latitudine: number; longitudine: number }) => void
  onCoordinatesCommit?: (coords: { latitudine: number; longitudine: number }) => void
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
  onCoordinatesChange,
  onCoordinatesCommit,
  className = '',
}: GeoPointMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 320, height: minHeight })
  const [view, setView] = useState<MapViewState>({
    centerLat: latitudine,
    centerLng: longitudine,
    zoom,
  })
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    setView((current) => ({
      ...current,
      centerLat: latitudine,
      centerLng: longitudine,
      zoom,
    }))
  }, [latitudine, longitudine, zoom])

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
    if (!interactive) return
    event.preventDefault()
    containerRef.current?.setPointerCapture(event.pointerId)
    setDragging(true)
    const next = updateFromPointer(event.clientX, event.clientY)
    if (next) onCoordinatesChange?.(next)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!interactive || !dragging) return
    const next = updateFromPointer(event.clientX, event.clientY)
    if (next) onCoordinatesChange?.(next)
  }

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!interactive || !dragging) return
    setDragging(false)
    containerRef.current?.releasePointerCapture(event.pointerId)
    const next = updateFromPointer(event.clientX, event.clientY)
    if (next) (onCoordinatesCommit ?? onCoordinatesChange)?.(next)
  }

  const googleMapsUrl = buildGoogleMapsUrl(latitudine, longitudine, label)

  return (
    <div className={`geo-point-map${className ? ` ${className}` : ''}`}>
      <div
        ref={containerRef}
        className={`geo-point-map__frame${dragging ? ' geo-point-map__frame--dragging' : ''}${interactive ? ' geo-point-map__frame--interactive' : ''}`}
        style={{ minHeight }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        role={interactive ? 'application' : 'img'}
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
            <MapPin size={interactive ? 34 : 32} strokeWidth={2.2} />
          </span>
        </div>

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
