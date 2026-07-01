import { useCallback, useEffect, useState } from 'react'
import { buildSmielaturaListItems } from '../services/smielaturaListService'
import type { SmielaturaListItem } from '../types/smielatura.types'

export function useSmielatureList() {
  const [smielature, setSmielature] = useState<SmielaturaListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setSmielature(await buildSmielaturaListItems())
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Errore caricamento produzione'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { smielature, loading, error, refresh }
}
