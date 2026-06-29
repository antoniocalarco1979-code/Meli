/**
 * GPS service — placeholder web, sostituibile con @capacitor/geolocation.
 * @see https://capacitorjs.com/docs/apis/geolocation
 */
import type { GeoCoordinates, GeoOptions } from './types'

const hasGeolocation =
  typeof navigator !== 'undefined' && 'geolocation' in navigator

export const gpsService = {
  async getCurrentPosition(options?: GeoOptions): Promise<GeoCoordinates | null> {
    // TODO Capacitor: Geolocation.getCurrentPosition()
    if (!hasGeolocation) return null

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            latitudine: Number(pos.coords.latitude.toFixed(6)),
            longitudine: Number(pos.coords.longitude.toFixed(6)),
            accuratezza: pos.coords.accuracy,
            quota:
              pos.coords.altitude != null && !Number.isNaN(pos.coords.altitude)
                ? Math.round(pos.coords.altitude)
                : undefined,
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
  },

  formatLabel(coords: GeoCoordinates): string {
    return `${coords.latitudine}, ${coords.longitudine}`
  },
}
