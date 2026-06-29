import { motion } from 'framer-motion'
import { ClipboardList } from 'lucide-react'
import { EmptyState } from '../../../components/ui/EmptyState/EmptyState'
import type { VisitaTimelineEntry } from '../types'
import './TimelineCard.css'

type TimelineCardProps = {
  visits: VisitaTimelineEntry[]
  pulse?: boolean
}

export function TimelineCard({ visits, pulse = false }: TimelineCardProps) {
  return (
    <motion.section
      className={`timeline-card timeline-card--secondary meli-glass meli-glass--deep${pulse ? ' timeline-card--pulse' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Cronologia visite"
    >
      <header className="timeline-card__header">
        <h2 className="arnia-section-title">Cronologia</h2>
        {visits.length > 0 && <span className="timeline-card__count">{visits.length}</span>}
      </header>

      {visits.length === 0 ? (
        <EmptyState
          title="Nessuna visita in cronologia"
          description="Le visite salvate compariranno qui in ordine cronologico."
          icon={<ClipboardList size={40} strokeWidth={1.5} />}
        />
      ) : (
        <ol className="timeline-card__list">
          {visits.map((visit, index) => (
            <motion.li
              key={visit.id}
              className="timeline-card__item"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.05 * index }}
            >
              <div className="timeline-card__row">
                <div className="timeline-card__main">
                  <time
                    className="timeline-card__date"
                    dateTime={new Date(visit.data).toISOString()}
                  >
                    {visit.dataShort}
                  </time>
                  <p className="timeline-card__summary">{visit.summary}</p>
                </div>
                <span
                  className="timeline-card__status"
                  role="img"
                  aria-label={`Stato visita ${visit.statusLevel}`}
                >
                  {visit.statusIcon}
                </span>
              </div>
            </motion.li>
          ))}
        </ol>
      )}
    </motion.section>
  )
}
