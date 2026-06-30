import { useLiveQuery } from '../../../hooks/useLiveQuery'
import { getAllApiari } from '../../apiari/services/apiariService'
import { buildApiarioDetailView } from '../../apiari/services/apiarioDetailService'
import { ensureWorkspaceSeeded } from '../../../demo/ensureWorkspaceSeeded'
import { getDashboardOperationalMetrics } from '../services/dashboardMetricsService'
import { resolveApiarioStatus, type ApiarioStatus } from '../utils/homeHelpers'

export type HomeApiarioCard = {
  id: string
  nome: string
  arnieCount: number
  ultimaVisitaLabel: string
  status: ApiarioStatus
}

export function useHomeApiariCards() {
  const { data, loading } = useLiveQuery(
    async () => {
      const apiari = await getAllApiari()
      return Promise.all(
        apiari.map(async (apiario) => {
          const [operational, detail] = await Promise.all([
            getDashboardOperationalMetrics(apiario.id),
            buildApiarioDetailView(apiario.id),
          ])

          return {
            id: apiario.id,
            nome: apiario.nome,
            arnieCount: detail?.arnieCount ?? apiario.numeroArnie,
            ultimaVisitaLabel: detail?.statistiche.ultimaVisitaLabel ?? '—',
            status: resolveApiarioStatus(operational),
          } satisfies HomeApiarioCard
        }),
      )
    },
    [],
    { seed: ensureWorkspaceSeeded },
  )

  return {
    cards: data ?? [],
    loading,
  }
}
