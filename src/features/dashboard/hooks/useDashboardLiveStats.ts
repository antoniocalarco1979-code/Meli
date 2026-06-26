import { useEffect, useState } from 'react'
import { liveQuery } from 'dexie'
import { seedApiariIfEmpty } from '../../apiari/data/seedApiari'
import { seedArnieIfEmpty } from '../../arnie/data/seedArnie'
import { getDashboardLiveMetrics } from '../../arnie/services/arniaDetailService'

export type DashboardLiveStats = {
  ultimaVisitaLabel: string
  indiceSalute: number
  loading: boolean
}

export function useDashboardLiveStats(): DashboardLiveStats {
  const [stats, setStats] = useState<DashboardLiveStats>({
    ultimaVisitaLabel: '—',
    indiceSalute: 0,
    loading: true,
  })

  useEffect(() => {
    let seeded = false

    const subscription = liveQuery(async () => {
      if (!seeded) {
        await seedApiariIfEmpty()
        await seedArnieIfEmpty()
        seeded = true
      }
      return getDashboardLiveMetrics()
    }).subscribe({
      next: (data) => setStats({ ...data, loading: false }),
      error: () => setStats((prev) => ({ ...prev, loading: false })),
    })

    return () => subscription.unsubscribe()
  }, [])

  return stats
}
