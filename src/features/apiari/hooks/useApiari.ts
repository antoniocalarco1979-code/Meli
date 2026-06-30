import { useLiveQuery } from '../../../hooks/useLiveQuery'
import { getDb } from '../../../database'
import {
  getAllApiari,
  getApiarioById,
  sumNumeroArnie,
} from '../services/apiariService'
import { buildApiarioDetailView } from '../services/apiarioDetailService'
import { ensureWorkspaceSeeded } from '../../../demo/ensureWorkspaceSeeded'

export function useApiari() {
  const { data, loading, error } = useLiveQuery(
    () => getAllApiari(),
    [],
    { seed: ensureWorkspaceSeeded },
  )

  return { apiari: data ?? [], loading, error }
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
    { seed: ensureWorkspaceSeeded },
  )

  return {
    count: data?.count ?? 0,
    totalArnie: data?.totalArnie ?? 0,
    names: data?.names ?? [],
    loading,
    error,
  }
}
