/**
 * GPS service — web Geolocation API, sostituibile con @capacitor/geolocation.
 * @see https://capacitorjs.com/docs/apis/geolocation
 */
import type { GeoCoordinates, GeoLocationErrorCode, GeoLocationResult, GeoOptions } from './types'

const hasGeolocation =
  typeof navigator !== 'undefined' && 'geolocation' in navigator

export const DEFAULT_GEO_OPTIONS: Required<GeoOptions> = {
  enableHighAccuracy: true,
  timeoutMs: 10_000,
  maximumAgeMs: 0,
}

const ERROR_MESSAGES: Record<GeoLocationErrorCode, string> = {
  unsupported:
    'Geolocalizzazione non disponibile su questo dispositivo. Inserisci la posizione manualmente.',
  permission_denied:
    'Permesso di geolocalizzazione negato. Abilita la posizione nelle impostazioni del browser oppure inserisci i dati manualmente.',
  position_unavailable:
    'Impossibile rilevare la posizione attuale. Verifica il segnale GPS o inserisci i dati manualmente.',
  timeout:
    'Timeout acquisizione GPS. Riprova o inserisci la posizione manualmente.',
  unknown: 'Errore durante l\'acquisizione della posizione. Riprova o inserisci i dati manualmente.',
}

function resolveErrorCode(error: GeolocationPositionError): GeoLocationErrorCode {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'permission_denied'
    case error.POSITION_UNAVAILABLE:
      return 'position_unavailable'
    case error.TIMEOUT:
      return 'timeout'
    default:
      return 'unknown'
  }
}

function buildPositionOptions(options?: GeoOptions): PositionOptions {
  return {
    enableHighAccuracy: options?.enableHighAccuracy ?? DEFAULT_GEO_OPTIONS.enableHighAccuracy,
    timeout: options?.timeoutMs ?? DEFAULT_GEO_OPTIONS.timeoutMs,
    maximumAge: options?.maximumAgeMs ?? DEFAULT_GEO_OPTIONS.maximumAgeMs,
  }
}

function mapPosition(position: GeolocationPosition): GeoCoordinates {
  return {
    latitudine: Number(position.coords.latitude.toFixed(6)),
    longitudine: Number(position.coords.longitude.toFixed(6)),
    accuratezza: position.coords.accuracy,
    quota:
      position.coords.altitude != null && !Number.isNaN(position.coords.altitude)
        ? Math.round(position.coords.altitude)
        : undefined,
  }
}

export const gpsService = {
  isSupported(): boolean {
    return hasGeolocation
  },

  async getCurrentPositionResult(options?: GeoOptions): Promise<GeoLocationResult> {
    if (!hasGeolocation) {
      return {
        ok: false,
        code: 'unsupported',
        message: ERROR_MESSAGES.unsupported,
      }
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({ ok: true, coords: mapPosition(position) })
        },
        (error) => {
          const code = resolveErrorCode(error)
          resolve({
            ok: false,
            code,
            message: ERROR_MESSAGES[code],
          })
        },
        buildPositionOptions(options),
      )
    })
  },

  async getCurrentPosition(options?: GeoOptions): Promise<GeoCoordinates | null> {
    const result = await this.getCurrentPositionResult(options)
    return result.ok ? result.coords : null
  },

  formatLabel(coords: GeoCoordinates): string {
    return `${coords.latitudine}, ${coords.longitudine}`
  },
}
