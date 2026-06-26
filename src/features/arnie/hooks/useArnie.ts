import { useEffect, useState } from 'react'
import { liveQuery } from 'dexie'
import { getArniaById } from '../../../database/services/arnieService'
import { seedArnieIfEmpty } from '../data/seedArnie'
import {
  buildArniaDetailView,
  getAllArnieEnriched,
  type ArniaDetailView,
} from '../services/arniaDetailService'

export function useArnieList() {
  const [arnie, setArnie] = useState<Awaited<ReturnType<typeof getAllArnieEnriched>>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let seeded = false

    const subscription = liveQuery(async () => {
      if (!seeded) {
        await seedArnieIfEmpty()
        seeded = true
      }
      return getAllArnieEnriched()
    }).subscribe({
      next: (data) => {
        setArnie(data)
        setLoading(false)
      },
      error: () => setLoading(false),
    })

    return () => subscription.unsubscribe()
  }, [])

  return { arnie, loading }
}

export function useArniaDetail(id: string | undefined) {
  const [detail, setDetail] = useState<ArniaDetailView | undefined>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    let seeded = false

    const subscription = liveQuery(async () => {
      if (!seeded) {
        await seedArnieIfEmpty()
        seeded = true
      }
      const arnia = await getArniaById(id)
      if (!arnia) return undefined
      return buildArniaDetailView(arnia)
    }).subscribe({
      next: (data) => {
        setDetail(data)
        setLoading(false)
      },
      error: () => setLoading(false),
    })

    return () => subscription.unsubscribe()
  }, [id])

  return { detail, loading }
}
