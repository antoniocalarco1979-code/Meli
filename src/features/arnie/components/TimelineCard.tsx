import { motion } from 'framer-motion'
import { ClipboardList } from 'lucide-react'
import { EmptyState } from '../../../components/ui/EmptyState/EmptyState'
import type { VisitaTimelineEntry } from '../types'
import { VisitaTimelineItem } from './VisitaTimelineItem'
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
            <VisitaTimelineItem
              key={visit.id}
              visit={visit}
              index={index}
              isFirst={index === 0}
              isLast={index === visits.length - 1}
            />
          ))}
        </ol>
      )}
    </motion.section>
  )
}
