import { useCallback, useEffect, useState } from 'react'
import { buildTrattamentoDetailView } from '../services/trattamentoDetailService'
import { buildTrattamentoListItems } from '../services/trattamentoListService'
import type { TrattamentoDetailView, TrattamentoListItem } from '../types/trattamento.types'

export function useTrattamentiList() {
  const [trattamenti, setTrattamenti] = useState<TrattamentoListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setTrattamenti(await buildTrattamentoListItems())
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Errore caricamento trattamenti'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { trattamenti, loading, error, refresh }
}

export function useTrattamentoDetail(id: string | undefined) {
  const [detail, setDetail] = useState<TrattamentoDetailView | null>(null)
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
      setDetail(await buildTrattamentoDetailView(id))
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Errore caricamento trattamento'))
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { detail, loading, error, refresh }
}
