import { useEffect, useState } from 'react'
import { liveQuery } from 'dexie'
import type { ApiarioView } from '../../../database/types'
import { db } from '../../../database'
import {
  getAllApiari,
  getApiarioById,
  sumNumeroArnie,
} from '../../../database/services/apiariService'
import { seedApiariIfEmpty } from '../data/seedApiari'

export function useApiari() {
  const [apiari, setApiari] = useState<ApiarioView[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let seeded = false

    const subscription = liveQuery(async () => {
      if (!seeded) {
        await seedApiariIfEmpty()
        seeded = true
      }
      return getAllApiari()
    }).subscribe({
      next: (data) => {
        setApiari(data)
        setLoading(false)
      },
      error: () => setLoading(false),
    })

    return () => subscription.unsubscribe()
  }, [])

  return { apiari, loading }
}

export function useApiario(id: string | undefined) {
  const [apiario, setApiario] = useState<ApiarioView | undefined>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    const subscription = liveQuery(() => getApiarioById(id)).subscribe({
      next: (data) => {
        setApiario(data)
        setLoading(false)
      },
      error: () => setLoading(false),
    })

    return () => subscription.unsubscribe()
  }, [id])

  return { apiario, loading }
}

export function useApiariStats() {
  const [count, setCount] = useState(0)
  const [totalArnie, setTotalArnie] = useState(0)
  const [names, setNames] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let seeded = false

    const subscription = liveQuery(async () => {
      if (!seeded) {
        await seedApiariIfEmpty()
        seeded = true
      }
      const all = await db.apiari.orderBy('nome').toArray()
      return {
        count: all.length,
        totalArnie: await sumNumeroArnie(),
        names: all.map((a) => a.nome),
      }
    }).subscribe({
      next: (data) => {
        setCount(data.count)
        setTotalArnie(data.totalArnie)
        setNames(data.names)
        setLoading(false)
      },
      error: () => setLoading(false),
    })

    return () => subscription.unsubscribe()
  }, [])

  return { count, totalArnie, names, loading }
}
