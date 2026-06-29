/**
 * Platform detection — web today, Capacitor native tomorrow.
 * @see https://capacitorjs.com/docs/core-apis/core
 */

export type AppPlatform = 'web' | 'ios' | 'android'

function detectPlatform(): AppPlatform {
  if (typeof window === 'undefined') return 'web'

  const ua = navigator.userAgent.toLowerCase()
  if (/iphone|ipad|ipod/.test(ua)) return 'ios'
  if (/android/.test(ua)) return 'android'
  return 'web'
}

export const platformService = {
  getPlatform(): AppPlatform {
    return detectPlatform()
  },

  isWeb(): boolean {
    return detectPlatform() === 'web'
  },

  isNative(): boolean {
    // TODO Capacitor: Capacitor.isNativePlatform()
    return false
  },

  isIOS(): boolean {
    return detectPlatform() === 'ios'
  },

  isAndroid(): boolean {
    return detectPlatform() === 'android'
  },
}
