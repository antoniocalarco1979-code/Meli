import { useLiveQuery } from '../../../hooks/useLiveQuery'
import { getApiarioById } from '../../apiari/services/apiariService'
import { getDb } from '../../../database'
import { resolvePrimaryApiario, seedDashboardData } from '../services/dashboardBootstrap'
import {
  getDashboardLiveMetrics,
  getDashboardOperationalMetrics,
} from '../services/dashboardMetricsService'

export type DashboardLiveStats = {
  ultimaVisitaLabel: string
  indiceSalute: number
  arnieDaControllare: number
  trattamentiInScadenza: number
  regineDaSostituire: number
  loading: boolean
}

const emptyOperational = {
  arnieDaControllare: 0,
  trattamentiInScadenza: 0,
  regineDaSostituire: 0,
}

export function useDashboardLiveStats(apiarioId?: string): DashboardLiveStats {
  const { data, loading } = useLiveQuery(
    async () => {
      const apiario = apiarioId
        ? await getApiarioById(apiarioId)
        : await resolvePrimaryApiario()
      const [live, operational] = await Promise.all([
        getDashboardLiveMetrics(),
        apiario
          ? getDashboardOperationalMetrics(apiario.id)
          : Promise.resolve(emptyOperational),
      ])
      return { ...live, ...operational }
    },
    [apiarioId ?? ''],
    { seed: seedDashboardData },
  )

  return {
    ultimaVisitaLabel: data?.ultimaVisitaLabel ?? '—',
    indiceSalute: data?.indiceSalute ?? 0,
    arnieDaControllare: data?.arnieDaControllare ?? 0,
    trattamentiInScadenza: data?.trattamentiInScadenza ?? 0,
    regineDaSostituire: data?.regineDaSostituire ?? 0,
    loading,
  }
}

export type DashboardFlowData = {
  primaryApiarioId?: string
  arnieByNumero: Record<string, string>
  defaultArniaId?: string
  arnieCount: number
  loading: boolean
}

export function useDashboardFlow(apiarioId?: string): DashboardFlowData {
  const { data, loading } = useLiveQuery(
    async () => {
      const apiario = apiarioId
        ? await getApiarioById(apiarioId)
        : await resolvePrimaryApiario()
      const arnie = apiario
        ? await getDb().arnie.where('apiarioId').equals(apiario.id).toArray()
        : []

      const arnieByNumero = Object.fromEntries(arnie.map((a) => [a.numero, a.id]))
      const defaultArniaId = arnieByNumero['12'] ?? arnie[0]?.id

      return {
        primaryApiarioId: apiario?.id,
        arnieByNumero,
        defaultArniaId,
        arnieCount: arnie.length,
      }
    },
    [apiarioId ?? ''],
    { seed: seedDashboardData },
  )

  return {
    primaryApiarioId: data?.primaryApiarioId,
    arnieByNumero: data?.arnieByNumero ?? {},
    defaultArniaId: data?.defaultArniaId,
    arnieCount: data?.arnieCount ?? 0,
    loading,
  }
}
