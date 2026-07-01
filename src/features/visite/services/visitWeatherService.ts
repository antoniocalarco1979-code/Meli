import { dashboardData } from '../../dashboard/data/mockDashboard'

/** Meteo disponibile per la sessione visita (mock dashboard — API in sprint futuri). */
export function getVisitWeatherLabel(): string | undefined {
  const { weather } = dashboardData
  if (!weather?.condition) return undefined
  return `${weather.temperature}° · ${weather.condition}`
}
