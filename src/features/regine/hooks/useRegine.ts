import { useCallback, useEffect, useState } from 'react'
import { buildReginaDetailView } from '../services/reginaDetailService'
import { buildReginaListItems } from '../services/reginaListService'
import type { ReginaDetailView, ReginaListItem } from '../types/regina.types'

export function useRegineList() {
  const [regine, setRegine] = useState<ReginaListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const items = await buildReginaListItems()
      setRegine(items)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Errore caricamento regine'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { regine, loading, error, refresh }
}

export function useReginaDetail(id: string | undefined) {
  const [detail, setDetail] = useState<ReginaDetailView | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refresh = useCallback(async () => {
    if (!id) {
      setDetail(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const view = await buildReginaDetailView(id)
      setDetail(view)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Errore caricamento regina'))
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { detail, loading, error, refresh }
}
