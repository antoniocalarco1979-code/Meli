/** Tipi condivisi layer device — pronti per Capacitor. */

export type CapturedPhoto = {
  path: string
  thumbnail?: string
}

export type CapturePhotoOptions = {
  preferRear?: boolean
  quality?: number
}

export type GeoCoordinates = {
  latitudine: number
  longitudine: number
  accuratezza?: number
}

export type GeoOptions = {
  enableHighAccuracy?: boolean
  timeoutMs?: number
}

export type LocalNotificationPayload = {
  id: number
  title: string
  body: string
  scheduleAt?: number
}

export type StorageSetOptions = {
  /** Prefisso chiave app — default MELI */
  namespace?: string
}
