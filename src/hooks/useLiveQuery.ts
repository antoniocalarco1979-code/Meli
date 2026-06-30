import { useEffect, useState } from 'react'
import { liveQuery } from 'dexie'
import { initializeDatabase } from '../database/initializeDatabase'
import { normalizeError } from '../database/errors'

type UseLiveQueryResult<T> = {
  data: T
  loading: boolean
  error: Error | null
}

type UseLiveQueryOptions<T> = {
  seed?: () => Promise<void>
  /** Se la query fallisce o va in timeout, usa questo valore invece di mostrare errore. */
  fallback?: T
}

const QUERY_TIMEOUT_MS = 20_000

async function runSeedSafely(seed: () => Promise<void>): Promise<void> {
  try {
    await seed()
  } catch (err) {
    console.warn('[MELI] Seed ignorato:', err)
  }
}

export function useLiveQuery<T>(
  queryFn: () => Promise<T>,
  deps: unknown[],
  options?: UseLiveQueryOptions<T>,
): UseLiveQueryResult<T | undefined> {
  const [data, setData] = useState<T | undefined>(options?.fallback)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let active = true
    let resolved = false
    const fallback = options?.fallback

    setLoading(true)
    setError(null)

    const applyFallback = (): boolean => {
      if (fallback !== undefined) {
        setData(fallback)
        setError(null)
        return true
      }
      return false
    }

    const safetyTimer = window.setTimeout(() => {
      if (!active || resolved) return
      resolved = true
      if (!applyFallback()) {
        setError(new Error('Timeout caricamento dati'))
      }
      setLoading(false)
    }, QUERY_TIMEOUT_MS)

    const runQuery = async () => {
      try {
        await initializeDatabase()
        if (options?.seed) {
          await runSeedSafely(options.seed)
        }
      } catch (err) {
        console.warn('[MELI] Database non pronto:', err)
        if (!active) return
        resolved = true
        window.clearTimeout(safetyTimer)
        applyFallback()
        setLoading(false)
        return
      }

      if (!active) return

      const subscription = liveQuery(async () => {
        try {
          return await queryFn()
        } catch (err) {
          console.warn('[MELI] Query fallita:', err)
          if (fallback !== undefined) return fallback
          throw err
        }
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
          if (applyFallback()) {
            setLoading(false)
            return
          }
          setError(normalizeError(err))
          setLoading(false)
        },
      })

      return subscription
    }

    let subscription: { unsubscribe: () => void } | undefined

    void runQuery().then((sub) => {
      if (!active) {
        sub?.unsubscribe()
        return
      }
      subscription = sub
    })

    return () => {
      active = false
      window.clearTimeout(safetyTimer)
      subscription?.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error }
}
