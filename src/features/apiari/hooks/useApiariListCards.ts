import { useLiveQuery } from '../../../hooks/useLiveQuery'
import { ensureWorkspaceSeeded } from '../../../demo/ensureWorkspaceSeeded'
import { getDashboardOperationalMetrics } from '../../dashboard/services/dashboardMetricsService'
import { buildApiarioDetailView } from '../services/apiarioDetailService'
import { getAllApiari } from '../services/apiariService'
import type { ApiarioView } from '../types'
import { formatApiarioComune, resolveApiarioStatus, type ApiarioStatus } from '../utils/apiarioStatus'

export type ApiarioListCardData = {
  apiario: ApiarioView
  arnieCount: number
  ultimaVisitaLabel: string
  status: ApiarioStatus
  comuneLabel: string
}

export function useApiariListCards() {
  const { data, loading, error } = useLiveQuery(
    async () => {
      const apiari = await getAllApiari()
      return Promise.all(
        apiari.map(async (apiario) => {
          const [operational, detail] = await Promise.all([
            getDashboardOperationalMetrics(apiario.id),
            buildApiarioDetailView(apiario.id),
          ])

          return {
            apiario,
            arnieCount: detail?.arnieCount ?? apiario.numeroArnie,
            ultimaVisitaLabel: detail?.statistiche.ultimaVisitaLabel ?? '—',
            status: resolveApiarioStatus(operational),
            comuneLabel: formatApiarioComune(apiario),
          } satisfies ApiarioListCardData
        }),
      )
    },
    [],
    { seed: ensureWorkspaceSeeded },
  )

  return {
    cards: data ?? [],
    loading,
    error,
  }
}
