import { useLiveQuery } from '../../../hooks/useLiveQuery'
import { getDb } from '../../../database'
import { getApiarioById } from '../../apiari/services/apiariService'
import { resolvePrimaryApiario, seedDashboardData } from '../services/dashboardBootstrap'
import { getDashboardOperationalMetrics } from '../services/dashboardMetricsService'

export type HomePriorita = {
  arnieDaVisitare: number
  melariDaAggiungere: number
  regineDaVerificare: number
  trattamentiInScadenza: number
  loading: boolean
}

const emptyPriorita = {
  arnieDaVisitare: 0,
  melariDaAggiungere: 0,
  regineDaVerificare: 0,
  trattamentiInScadenza: 0,
}

async function countMelariDaAggiungere(apiarioId: string): Promise<number> {
  const arnie = await getDb().arnie.where('apiarioId').equals(apiarioId).toArray()
  return arnie.filter(
    (arnia) =>
      !arnia.hasMelario && arnia.stato !== 'inattiva' && arnia.stato !== 'morta',
  ).length
}

export function useHomePriorita(apiarioId?: string): HomePriorita {
  const { data, loading } = useLiveQuery(
    async () => {
      const apiario = apiarioId
        ? await getApiarioById(apiarioId)
        : await resolvePrimaryApiario()
      if (!apiario) return emptyPriorita

      const [operational, melariDaAggiungere] = await Promise.all([
        getDashboardOperationalMetrics(apiario.id),
        countMelariDaAggiungere(apiario.id),
      ])

      return {
        arnieDaVisitare: operational.arnieDaControllare,
        melariDaAggiungere,
        regineDaVerificare: operational.regineDaSostituire,
        trattamentiInScadenza: operational.trattamentiInScadenza,
      }
    },
    [apiarioId ?? ''],
    { seed: seedDashboardData },
  )

  return {
    ...(data ?? emptyPriorita),
    loading,
  }
}
