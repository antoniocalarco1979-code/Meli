/**
 * Astrazione fotocamera — web oggi, Capacitor Camera plugin in futuro.
 * @see https://capacitorjs.com/docs/apis/camera
 */

export type CapturePhotoOptions = {
  /** Preferisce fotocamera posteriore su dispositivo nativo. */
  preferRear?: boolean
  /** Qualità JPEG 0–100 (Capacitor). */
  quality?: number
}

export type CapturedPhoto = {
  path: string
  thumbnail?: string
}

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

/** Apre il selettore file / fotocamera del browser. */
export async function pickPhotoFromDevice(): Promise<CapturedPhoto | null> {
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

/**
 * Punto unico per scattare foto — sostituire con Capacitor Camera.getPhoto().
 */
export async function capturePhoto(_options?: CapturePhotoOptions): Promise<CapturedPhoto | null> {
  return pickPhotoFromDevice()
}
