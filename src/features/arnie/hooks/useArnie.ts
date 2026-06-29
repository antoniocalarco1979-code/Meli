import { useLiveQuery } from '../../../hooks/useLiveQuery'
import { getArniaById } from '../../../database/services/arnieService'
import { ensureWorkspaceSeeded } from '../../../demo/ensureWorkspaceSeeded'
import {
  buildArniaDetailView,
  getAllArnieEnriched,
  getArnieEnrichedByApiarioId,
} from '../services/arniaDetailService'

export function useArnieList() {
  const { data, loading, error } = useLiveQuery(
    () => getAllArnieEnriched(),
    [],
    { seed: ensureWorkspaceSeeded },
  )

  return { arnie: data ?? [], loading, error }
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
    { seed: ensureWorkspaceSeeded },
  )

  return { detail: data, loading: id ? loading : false, error: id ? error : null }
}

export function useArnieByApiarioId(apiarioId: string) {
  const { data, loading, error } = useLiveQuery(
    () => getArnieEnrichedByApiarioId(apiarioId),
    [apiarioId],
    { seed: ensureWorkspaceSeeded },
  )

  return { arnie: data ?? [], loading, error }
}
