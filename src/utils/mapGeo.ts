const TILE_SIZE = 256

function latLngToWorld(lat: number, lng: number, scale: number) {
  const sinLat = Math.sin((lat * Math.PI) / 180)
  return {
    x: ((lng + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale,
  }
}

export type MapGeoPoint = {
  latitudine: number
  longitudine: number
}

export type MapViewState = {
  centerLat: number
  centerLng: number
  zoom: number
}

/** Converte coordinate schermo → lat/lng rispetto al centro mappa. */
export function pixelToLatLng(
  x: number,
  y: number,
  centerLat: number,
  centerLng: number,
  zoom: number,
  width: number,
  height: number,
): MapGeoPoint {
  const scale = TILE_SIZE * 2 ** zoom
  const center = latLngToWorld(centerLat, centerLng, scale)
  const worldX = center.x + (x - width / 2)
  const worldY = center.y + (y - height / 2)
  const longitudine = (worldX / scale) * 360 - 180
  const n = Math.PI - (2 * Math.PI * worldY) / scale
  const latitudine = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))

  return {
    latitudine: Number(latitudine.toFixed(6)),
    longitudine: Number(longitudine.toFixed(6)),
  }
}

export function latLngToPixel(
  lat: number,
  lng: number,
  centerLat: number,
  centerLng: number,
  zoom: number,
  width: number,
  height: number,
): { x: number; y: number } {
  const scale = TILE_SIZE * 2 ** zoom
  const center = latLngToWorld(centerLat, centerLng, scale)
  const point = latLngToWorld(lat, lng, scale)
  return {
    x: width / 2 + (point.x - center.x),
    y: height / 2 + (point.y - center.y),
  }
}

export function panMapView(
  view: MapViewState,
  deltaX: number,
  deltaY: number,
  width: number,
  height: number,
): MapViewState {
  const next = pixelToLatLng(
    width / 2 - deltaX,
    height / 2 - deltaY,
    view.centerLat,
    view.centerLng,
    view.zoom,
    width,
    height,
  )
  return {
    ...view,
    centerLat: next.latitudine,
    centerLng: next.longitudine,
  }
}

export function computeMapViewForPoints(
  points: MapGeoPoint[],
  width: number,
  height: number,
): MapViewState {
  if (points.length === 0) {
    return { centerLat: 38.25, centerLng: 16.05, zoom: 8 }
  }

  if (points.length === 1) {
    return {
      centerLat: points[0].latitudine,
      centerLng: points[0].longitudine,
      zoom: 13,
    }
  }

  const lats = points.map((p) => p.latitudine)
  const lngs = points.map((p) => p.longitudine)
  const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2
  const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2

  let zoom = 8
  for (let candidate = 16; candidate >= 4; candidate -= 1) {
    const fits = points.every((point) => {
      const { x, y } = latLngToPixel(
        point.latitudine,
        point.longitudine,
        centerLat,
        centerLng,
        candidate,
        width,
        height,
      )
      return x >= 32 && x <= width - 32 && y >= 32 && y <= height - 32
    })
    if (fits) {
      zoom = candidate
      break
    }
  }

  return { centerLat, centerLng, zoom }
}

export function lonToTileX(lng: number, zoom: number): number {
  return Math.floor(((lng + 180) / 360) * 2 ** zoom)
}

export function latToTileY(lat: number, zoom: number): number {
  const rad = (lat * Math.PI) / 180
  return Math.floor(
    ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * 2 ** zoom,
  )
}

export function tileToLng(x: number, zoom: number): number {
  return (x / 2 ** zoom) * 360 - 180
}

export function tileToLat(y: number, zoom: number): number {
  const n = Math.PI - (2 * Math.PI * y) / 2 ** zoom
  return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))
}

export function buildOsmTileUrl(x: number, y: number, zoom: number): string {
  return `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`
}

export function buildStaticMapUrl(
  latitudine: number,
  longitudine: number,
  zoom = 15,
  width = 640,
  height = 280,
): string {
  const url = new URL('https://staticmap.openstreetmap.de/staticmap.php')
  url.searchParams.set('center', `${latitudine},${longitudine}`)
  url.searchParams.set('zoom', String(zoom))
  url.searchParams.set('size', `${width}x${height}`)
  url.searchParams.set('maptype', 'mapnik')
  return url.toString()
}
