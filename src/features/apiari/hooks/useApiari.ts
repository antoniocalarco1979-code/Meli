import { useLiveQuery } from '../../../hooks/useLiveQuery'
import { getDb } from '../../../database'
import {
  getAllApiari,
  getApiarioById,
  sumNumeroArnie,
} from '../services/apiariService'
import { buildApiarioDetailView } from '../services/apiarioDetailService'
import { ensureWorkspaceSeeded } from '../../../demo/ensureWorkspaceSeeded'

const EMPTY_APIARI: Awaited<ReturnType<typeof getAllApiari>> = []

export function useApiari() {
  const { data, loading } = useLiveQuery(
    () => getAllApiari(),
    [],
    { seed: ensureWorkspaceSeeded, fallback: EMPTY_APIARI },
  )

  return { apiari: data ?? EMPTY_APIARI, loading, error: null }
}

export function useApiario(id: string | undefined) {
  const { data, loading, error } = useLiveQuery(
    () => (id ? getApiarioById(id) : Promise.resolve(undefined)),
    [id],
    { seed: ensureWorkspaceSeeded },
  )

  return { apiario: data, loading: id ? loading : false, error: id ? error : null }
}

export function useApiarioDetail(id: string | undefined) {
  const { data, loading, error } = useLiveQuery(
    () => (id ? buildApiarioDetailView(id) : Promise.resolve(undefined)),
    [id],
    { seed: ensureWorkspaceSeeded },
  )

  return { detail: data, loading: id ? loading : false, error: id ? error : null }
}

export function useApiariStats() {
  const emptyStats = { count: 0, totalArnie: 0, names: [] as string[] }
  const { data, loading, error } = useLiveQuery(
    async () => {
      const all = await getDb().apiari.orderBy('nome').toArray()
      return {
        count: all.length,
        totalArnie: await sumNumeroArnie(),
        names: all.map((a) => a.nome),
      }
    },
    [],
    { seed: ensureWorkspaceSeeded, fallback: emptyStats },
  )

  return {
    count: data?.count ?? 0,
    totalArnie: data?.totalArnie ?? 0,
    names: data?.names ?? [],
    loading,
    error,
  }
}
