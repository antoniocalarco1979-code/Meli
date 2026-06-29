import { useEffect, useState } from 'react'
import { liveQuery } from 'dexie'
import { normalizeError } from '../database/errors'

type UseLiveQueryResult<T> = {
  data: T
  loading: boolean
  error: Error | null
}

export function useLiveQuery<T>(
  queryFn: () => Promise<T>,
  deps: unknown[],
  options?: { seed?: () => Promise<void> },
): UseLiveQueryResult<T | undefined> {
  const [data, setData] = useState<T | undefined>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let seeded = false
    setLoading(true)
    setError(null)

    const subscription = liveQuery(async () => {
      if (options?.seed && !seeded) {
        await options.seed()
        seeded = true
      }
      return queryFn()
    }).subscribe({
      next: (next) => {
        setData(next)
        setError(null)
        setLoading(false)
      },
      error: (err) => {
        setError(normalizeError(err))
        setLoading(false)
      },
    })

    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error }
}
