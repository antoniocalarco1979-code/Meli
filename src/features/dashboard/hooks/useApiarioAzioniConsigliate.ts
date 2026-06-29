import { useLiveQuery } from '../../../hooks/useLiveQuery'
import { getApiarioAzioniConsigliate } from '../../azioni/services/apiarioAzioniService'
import { seedDashboardData } from '../services/dashboardBootstrap'

export function useApiarioAzioniConsigliate(apiarioId?: string) {
  const { data, loading } = useLiveQuery(
    () => (apiarioId ? getApiarioAzioniConsigliate(apiarioId) : Promise.resolve([])),
    [apiarioId ?? ''],
    { seed: seedDashboardData },
  )

  return {
    azioni: data ?? [],
    loading,
  }
}
