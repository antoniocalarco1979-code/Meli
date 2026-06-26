/**
 * Astrazione geolocalizzazione — web oggi, Capacitor Geolocation in futuro.
 * @see https://capacitorjs.com/docs/apis/geolocation
 */

export type GeoCoordinates = {
  latitudine: number
  longitudine: number
  accuratezza?: number
}

export type GeoOptions = {
  enableHighAccuracy?: boolean
  timeoutMs?: number
}

const hasGeolocation =
  typeof navigator !== 'undefined' && 'geolocation' in navigator

/** Restituisce coordinate correnti o null se non disponibili. */
export async function getCurrentPosition(options?: GeoOptions): Promise<GeoCoordinates | null> {
  if (!hasGeolocation) return null

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitudine: Number(pos.coords.latitude.toFixed(6)),
          longitudine: Number(pos.coords.longitude.toFixed(6)),
          accuratezza: pos.coords.accuracy,
        })
      },
      () => resolve(null),
      {
        enableHighAccuracy: options?.enableHighAccuracy ?? true,
        timeout: options?.timeoutMs ?? 12_000,
        maximumAge: 60_000,
      },
    )
  })
}

export function formatGpsLabel(coords: GeoCoordinates): string {
  return `${coords.latitudine}, ${coords.longitudine}`
}
