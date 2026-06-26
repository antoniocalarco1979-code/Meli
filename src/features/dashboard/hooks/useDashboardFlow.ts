import { useEffect, useState } from 'react'
import { liveQuery } from 'dexie'
import { db } from '../../../database'
import { seedApiariIfEmpty } from '../../apiari/data/seedApiari'
import { seedArnieIfEmpty } from '../../arnie/data/seedArnie'

export type DashboardFlowData = {
  primaryApiarioId?: string
  arnieByNumero: Record<string, string>
  defaultArniaId?: string
  loading: boolean
}

export function useDashboardFlow(): DashboardFlowData {
  const [data, setData] = useState<DashboardFlowData>({
    arnieByNumero: {},
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

      const apiari = await db.apiari.orderBy('nome').toArray()
      const primary = apiari.find((a) => a.nome.includes('Acquacalda')) ?? apiari[0]

      const arnie = primary
        ? await db.arnie.where('apiarioId').equals(primary.id).toArray()
        : []

      const arnieByNumero = Object.fromEntries(arnie.map((a) => [a.numero, a.id]))
      const defaultArniaId = arnieByNumero['12'] ?? arnie[0]?.id

      return {
        primaryApiarioId: primary?.id,
        arnieByNumero,
        defaultArniaId,
        loading: false,
      }
    }).subscribe({
      next: (next) => setData(next),
      error: () => setData((prev) => ({ ...prev, loading: false })),
    })

    return () => subscription.unsubscribe()
  }, [])

  return data
}
