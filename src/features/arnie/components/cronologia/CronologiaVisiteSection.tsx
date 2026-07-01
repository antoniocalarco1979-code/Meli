import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import { EmptyState } from '../../../../components/ui/EmptyState/EmptyState'
import type { VisitaTimelineEntry } from '../../types'
import { CronologiaVisitaDetailPanel } from './CronologiaVisitaDetailPanel'
import { CronologiaVisitaRow } from './CronologiaVisitaRow'
import './cronologia-visite.css'

type CronologiaVisiteSectionProps = {
  arniaNumero: string
  visits: VisitaTimelineEntry[]
  pulse?: boolean
}

export function CronologiaVisiteSection({
  arniaNumero,
  visits,
  pulse = false,
}: CronologiaVisiteSectionProps) {
  const [selectedVisit, setSelectedVisit] = useState<VisitaTimelineEntry | null>(null)

  return (
    <>
      <motion.section
        className={`cronologia-visite meli-glass meli-glass--deep${pulse ? ' cronologia-visite--pulse' : ''}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        aria-label="Cronologia visite"
      >
        <header className="cronologia-visite__header">
          <h2 className="cronologia-visite__title">
            <span aria-hidden="true">📖</span> Cronologia Visite
          </h2>
          {visits.length > 0 && <span className="cronologia-visite__count">{visits.length}</span>}
        </header>

        {visits.length === 0 ? (
          <EmptyState
            title="Nessuna visita registrata"
            description="Le visite salvate compariranno qui, dalla più recente alla più vecchia."
            icon={<BookOpen size={40} strokeWidth={1.5} />}
          />
        ) : (
          <ol className="cronologia-visite__list">
            {visits.map((visit, index) => (
              <CronologiaVisitaRow
                key={visit.id}
                visit={visit}
                index={index}
                onOpen={setSelectedVisit}
              />
            ))}
          </ol>
        )}
      </motion.section>

      <CronologiaVisitaDetailPanel
        visit={selectedVisit}
        arniaNumero={arniaNumero}
        open={selectedVisit != null}
        onClose={() => setSelectedVisit(null)}
      />
    </>
  )
}
