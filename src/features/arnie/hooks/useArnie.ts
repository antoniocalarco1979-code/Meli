import { useLiveQuery } from '../../../hooks/useLiveQuery'
import { getArniaById } from '../../../database/services/arnieService'
import { buildArniaDetailView } from '../services/arniaDetailService'
import { getAllArnieEnriched, getArnieEnrichedByApiarioId } from '../services/arniaListService'
import type { ArniaListItem } from '../types'

const EMPTY_ARNIE: ArniaListItem[] = []

export function useArnieList() {
  const { data, loading } = useLiveQuery(
    () => getAllArnieEnriched(),
    [],
    { fallback: EMPTY_ARNIE },
  )

  return { arnie: data ?? EMPTY_ARNIE, loading, error: null }
}

export function useArniaDetail(id: string | undefined) {
  const { data, loading, error } = useLiveQuery(
    async () => {
      if (!id) return undefined
      const arnia = await getArniaById(id)
      if (!arnia) return undefined
      return buildArniaDetailView(arnia)
    },
    [id],
  )

  return { detail: data, loading: id ? loading : false, error: id ? error : null }
}

export function useArnieByApiarioId(apiarioId: string) {
  const { data, loading } = useLiveQuery(
    () => getArnieEnrichedByApiarioId(apiarioId),
    [apiarioId],
    { fallback: EMPTY_ARNIE },
  )

  return { arnie: data ?? EMPTY_ARNIE, loading, error: null }
}
