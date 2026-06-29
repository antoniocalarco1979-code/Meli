import { useLiveQuery } from '../../../hooks/useLiveQuery'
import { seedDashboardData } from '../../dashboard/services/dashboardBootstrap'
import { getMeliIntelligenceSuggestions } from '../services/intelligenceService'

export function useMeliIntelligence(apiarioId?: string) {
  const { data, loading } = useLiveQuery(
    () => (apiarioId ? getMeliIntelligenceSuggestions(apiarioId) : Promise.resolve([])),
    [apiarioId ?? ''],
    { seed: seedDashboardData },
  )

  return {
    suggestions: data ?? [],
    loading,
  }
}
