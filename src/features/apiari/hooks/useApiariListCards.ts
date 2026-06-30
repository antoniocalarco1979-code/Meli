import { useLiveQuery } from '../../../hooks/useLiveQuery'
import { loadApiariListCards, type ApiarioListCardData } from '../services/apiariListCardsService'

export type { ApiarioListCardData }

const EMPTY_CARDS: ApiarioListCardData[] = []

export function useApiariListCards() {
  const { data, loading } = useLiveQuery(
    () => loadApiariListCards(),
    [],
    { fallback: EMPTY_CARDS },
  )

  return {
    cards: data ?? EMPTY_CARDS,
    loading,
    error: null,
  }
}
