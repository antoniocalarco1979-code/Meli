/**
 * Storage service — placeholder localStorage, sostituibile con @capacitor/preferences.
 * @see https://capacitorjs.com/docs/apis/preferences
 */
import type { StorageSetOptions } from './types'

const PREFIX = 'meli:'

function key(name: string, namespace?: string) {
  return `${namespace ?? PREFIX}${name}`
}

export const storageService = {
  async get<T>(name: string, options?: StorageSetOptions): Promise<T | null> {
    // TODO Capacitor: Preferences.get({ key })
    try {
      const raw = localStorage.getItem(key(name, options?.namespace))
      if (!raw) return null
      return JSON.parse(raw) as T
    } catch {
      return null
    }
  },

  async set(name: string, value: unknown, options?: StorageSetOptions): Promise<void> {
    // TODO Capacitor: Preferences.set({ key, value: JSON.stringify(value) })
    localStorage.setItem(key(name, options?.namespace), JSON.stringify(value))
  },

  async remove(name: string, options?: StorageSetOptions): Promise<void> {
    // TODO Capacitor: Preferences.remove({ key })
    localStorage.removeItem(key(name, options?.namespace))
  },
}
