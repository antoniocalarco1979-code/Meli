import { useEffect, useState } from 'react'
import { liveQuery } from 'dexie'
import { initializeDatabase } from '../database/initializeDatabase'
import { normalizeError } from '../database/errors'

type UseLiveQueryResult<T> = {
  data: T
  loading: boolean
  error: Error | null
}

const QUERY_TIMEOUT_MS = 12_000

export function useLiveQuery<T>(
  queryFn: () => Promise<T>,
  deps: unknown[],
  options?: { seed?: () => Promise<void> },
): UseLiveQueryResult<T | undefined> {
  const [data, setData] = useState<T | undefined>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let active = true
    let resolved = false
    let seeded = false

    setLoading(true)
    setError(null)

    const safetyTimer = window.setTimeout(() => {
      if (!active || resolved) return
      resolved = true
      setLoading(false)
      setError((prev) => prev ?? new Error('Timeout caricamento dati'))
    }, QUERY_TIMEOUT_MS)

    const subscription = liveQuery(async () => {
      await initializeDatabase()
      if (options?.seed && !seeded) {
        await options.seed()
        seeded = true
      }
      return queryFn()
    }).subscribe({
      next: (next) => {
        if (!active) return
        resolved = true
        window.clearTimeout(safetyTimer)
        setData(next)
        setError(null)
        setLoading(false)
      },
      error: (err) => {
        if (!active) return
        resolved = true
        window.clearTimeout(safetyTimer)
        setError(normalizeError(err))
        setLoading(false)
      },
    })

    return () => {
      active = false
      window.clearTimeout(safetyTimer)
      subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error }
}
