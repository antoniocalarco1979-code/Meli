import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Hexagon } from 'lucide-react'
import { liveQuery } from 'dexie'
import { Loading } from '../../../components/ui/Loading'
import { getArnieEnrichedByApiarioId } from '../../arnie/services/arniaDetailService'
import { ArniaCard } from '../../arnie/components/ArniaCard'
import type { ArniaListItem } from '../../arnie/types'
import './ApiarioArnieList.css'

type ApiarioArnieListProps = {
  apiarioId: string
}

export function ApiarioArnieList({ apiarioId }: ApiarioArnieListProps) {
  const [arnie, setArnie] = useState<ArniaListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const subscription = liveQuery(() => getArnieEnrichedByApiarioId(apiarioId)).subscribe({
      next: (data) => {
        setArnie(data)
        setLoading(false)
      },
      error: () => setLoading(false),
    })

    return () => subscription.unsubscribe()
  }, [apiarioId])

  if (loading) {
    return (
      <section className="apiario-arnie-list meli-glass meli-glass--deep">
        <Loading size="md" label="Caricamento arnie…" />
      </section>
    )
  }

  if (arnie.length === 0) {
    return (
      <section className="apiario-arnie-list meli-glass meli-glass--deep">
        <p className="apiario-arnie-list__empty">Nessuna arnia in questo apiario.</p>
      </section>
    )
  }

  return (
    <motion.section
      className="apiario-arnie-list"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <header className="apiario-arnie-list__header">
        <Hexagon size={22} strokeWidth={1.75} aria-hidden="true" />
        <h2 className="apiario-arnie-list__title">Arnie</h2>
        <span className="apiario-arnie-list__count">{arnie.length}</span>
      </header>

      <div className="apiario-arnie-list__grid">
        {arnie.map((item, index) => (
          <ArniaCard key={item.arnia.id} item={item} index={index} />
        ))}
      </div>
    </motion.section>
  )
}
