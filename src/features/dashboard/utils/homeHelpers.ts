import type { DashboardOperationalMetrics } from '../services/dashboardMetricsService'

export type ApiarioStatus = 'ok' | 'warning' | 'critical'

export function getPersonalizedGreeting(userName: string, date = new Date()): string {
  const hour = date.getHours()
  const saluto =
    hour < 12 ? 'Buongiorno' : hour < 18 ? 'Buon pomeriggio' : 'Buonasera'
  return `${saluto}, ${userName}`
}

export function formatHomeDate(date = new Date()): string {
  return date.toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function resolveApiarioStatus(
  metrics: DashboardOperationalMetrics,
): ApiarioStatus {
  if (metrics.regineDaSostituire > 0 || metrics.trattamentiInScadenza > 2) {
    return 'critical'
  }
  if (metrics.arnieDaControllare > 0 || metrics.trattamentiInScadenza > 0) {
    return 'warning'
  }
  return 'ok'
}

export const APIARIO_STATUS_LABEL: Record<ApiarioStatus, string> = {
  ok: 'In regola',
  warning: 'Da controllare',
  critical: 'Attenzione',
}
