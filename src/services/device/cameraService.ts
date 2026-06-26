/**
 * Camera service — placeholder web, sostituibile con @capacitor/camera.
 * @see https://capacitorjs.com/docs/apis/camera
 */
import type { CapturedPhoto, CapturePhotoOptions } from './types'

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result)
      else reject(new Error('Lettura foto non riuscita'))
    }
    reader.onerror = () => reject(reader.error ?? new Error('Lettura foto non riuscita'))
    reader.readAsDataURL(file)
  })
}

async function pickFromBrowser(): Promise<CapturedPhoto | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.capture = 'environment'

    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) {
        resolve(null)
        return
      }
      const path = await readFileAsDataUrl(file)
      resolve({ path, thumbnail: path })
    }

    input.click()
  })
}

export const cameraService = {
  /** Scatta o seleziona una foto — API unica per web e nativo. */
  async capturePhoto(_options?: CapturePhotoOptions): Promise<CapturedPhoto | null> {
    // TODO Capacitor: Camera.getPhoto({ resultType: DataUrl, source: Camera })
    return pickFromBrowser()
  },
}
