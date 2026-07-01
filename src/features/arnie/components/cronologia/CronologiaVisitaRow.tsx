import { motion } from 'framer-motion'
import { Camera, ChevronRight, Clock, Wrench } from 'lucide-react'
import type { VisitaTimelineEntry } from '../../types'

type CronologiaVisitaRowProps = {
  visit: VisitaTimelineEntry
  index: number
  onOpen: (visit: VisitaTimelineEntry) => void
}

export function CronologiaVisitaRow({ visit, index, onOpen }: CronologiaVisitaRowProps) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.03 * index }}
    >
      <button
        type="button"
        className={`cronologia-visita-row cronologia-visita-row--${visit.statusLevel}`}
        onClick={() => onOpen(visit)}
        aria-label={`Apri visita del ${visit.dataFull} alle ${visit.oraLabel}`}
      >
        <div className="cronologia-visita-row__main">
          <div className="cronologia-visita-row__datetime">
            <span className="cronologia-visita-row__date">{visit.dataShort}</span>
            <span className="cronologia-visita-row__time">{visit.oraLabel}</span>
          </div>

          <div className="cronologia-visita-row__stats">
            <span className="cronologia-visita-row__stat">
              <Clock size={16} aria-hidden="true" />
              {visit.durataLabel}
            </span>
            <span className="cronologia-visita-row__stat">
              <Camera size={16} aria-hidden="true" />
              {visit.fotoCount}
            </span>
            <span className="cronologia-visita-row__stat">
              <Wrench size={16} aria-hidden="true" />
              {visit.interventiCount}
            </span>
          </div>
        </div>

        <div className="cronologia-visita-row__status">
          <span className="cronologia-visita-row__status-icon" aria-hidden="true">
            {visit.statusIcon}
          </span>
          <span className="cronologia-visita-row__status-label">{visit.statoGeneraleLabel}</span>
          <ChevronRight size={20} className="cronologia-visita-row__chevron" aria-hidden="true" />
        </div>
      </button>
    </motion.li>
  )
}
