import { useLiveQuery } from '../../../hooks/useLiveQuery'
import { loadHomeApiariCards, type HomeApiarioCard } from '../../apiari/services/apiariListCardsService'
import { ensureWorkspaceSeeded } from '../../../demo/ensureWorkspaceSeeded'

export type { HomeApiarioCard }

const EMPTY_CARDS: HomeApiarioCard[] = []

export function useHomeApiariCards() {
  const { data, loading } = useLiveQuery(
    () => loadHomeApiariCards(),
    [],
    { seed: ensureWorkspaceSeeded, fallback: EMPTY_CARDS },
  )

  return {
    cards: data ?? EMPTY_CARDS,
    loading,
  }
}
