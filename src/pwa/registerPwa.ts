import { registerSW } from 'virtual:pwa-register'

/** Registra il service worker PWA in produzione. */
export function registerPwa(): void {
  if (!import.meta.env.PROD) return

  registerSW({
    immediate: true,
    onOfflineReady() {
      console.info('[MELI] App pronta per uso offline.')
    },
  })
}
