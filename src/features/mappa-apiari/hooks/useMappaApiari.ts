import { useLiveQuery } from '../../../hooks/useLiveQuery'
import { seedDashboardData } from '../../dashboard/services/dashboardBootstrap'
import { getMappaApiariData } from '../services/mappaApiariService'

export function useMappaApiari() {
  const { data, loading } = useLiveQuery(
    () => getMappaApiariData(),
    [],
    { seed: seedDashboardData },
  )

  return {
    data,
    loading,
  }
}
