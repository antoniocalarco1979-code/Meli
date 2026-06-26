/**
 * Notification service — placeholder, sostituibile con @capacitor/local-notifications.
 * @see https://capacitorjs.com/docs/apis/local-notifications
 */
import type { LocalNotificationPayload } from './types'

export const notificationService = {
  async requestPermission(): Promise<boolean> {
    // TODO Capacitor: LocalNotifications.requestPermissions()
    if (typeof Notification === 'undefined') return false
    if (Notification.permission === 'granted') return true
    if (Notification.permission === 'denied') return false
    const result = await Notification.requestPermission()
    return result === 'granted'
  },

  async schedule(_payload: LocalNotificationPayload): Promise<void> {
    // TODO Capacitor: LocalNotifications.schedule({ notifications: [...] })
    if (typeof Notification === 'undefined') return
    if (Notification.permission !== 'granted') return
    void _payload
  },

  async cancel(_id: number): Promise<void> {
    // TODO Capacitor: LocalNotifications.cancel({ notifications: [{ id }] })
    void _id
  },
}
