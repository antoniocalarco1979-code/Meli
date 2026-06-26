/**
 * @deprecated Usare `services/device` — re-export per compatibilità.
 */
export {
  cameraService,
  gpsService,
  type CapturedPhoto,
  type CapturePhotoOptions,
  type GeoCoordinates,
  type GeoOptions,
} from '../services/device'

import { cameraService, gpsService } from '../services/device'

export async function capturePhoto(
  options?: import('../services/device').CapturePhotoOptions,
) {
  return cameraService.capturePhoto(options)
}

export async function getCurrentPosition(
  options?: import('../services/device').GeoOptions,
) {
  return gpsService.getCurrentPosition(options)
}

export function formatGpsLabel(coords: import('../services/device').GeoCoordinates): string {
  return gpsService.formatLabel(coords)
}

export async function pickPhotoFromDevice() {
  return cameraService.capturePhoto()
}
