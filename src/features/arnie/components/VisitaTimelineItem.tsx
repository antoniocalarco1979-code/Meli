import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import {
  Camera,
  CloudSun,
  Crown,
  Droplets,
  Hexagon,
  StickyNote,
  Thermometer,
  User,
} from 'lucide-react'
import { AzioniConsigliateList } from '../../azioni/components/AzioniConsigliateList'
import type { VisitaTimelineEntry } from '../types'
import './VisitaTimelineItem.css'

type VisitaTimelineItemProps = {
  visit: VisitaTimelineEntry
  index: number
  isFirst: boolean
  isLast: boolean
}

type MetricProps = {
  icon: ReactNode
  label: string
  value: string
}

function TimelineMetric({ icon, label, value }: MetricProps) {
  return (
    <div className="visita-timeline-item__metric">
      <span className="visita-timeline-item__metric-icon" aria-hidden="true">
        {icon}
      </span>
      <div className="visita-timeline-item__metric-body">
        <span className="visita-timeline-item__metric-label">{label}</span>
        <span className="visita-timeline-item__metric-value">{value}</span>
      </div>
    </div>
  )
}

export function VisitaTimelineItem({
  visit,
  index,
  isFirst,
  isLast,
}: VisitaTimelineItemProps) {
  return (
    <motion.li
      className={`visita-timeline-item${isFirst ? ' visita-timeline-item--first' : ''}${isLast ? ' visita-timeline-item--last' : ''}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.04 * index }}
    >
      <div className="visita-timeline-item__rail" aria-hidden="true">
        <span className={`visita-timeline-item__dot visita-timeline-item__dot--${visit.statusLevel}`} />
        {!isLast && <span className="visita-timeline-item__line" />}
      </div>

      <article className="visita-timeline-item__card">
        <header className="visita-timeline-item__header">
          <div className="visita-timeline-item__datetime">
            <time dateTime={new Date(visit.data).toISOString()}>
              <span className="visita-timeline-item__date">{visit.dataShort}</span>
              <span className="visita-timeline-item__time">{visit.oraLabel}</span>
            </time>
          </div>
          <div className="visita-timeline-item__status">
            <span className="visita-timeline-item__status-icon" aria-hidden="true">
              {visit.statusIcon}
            </span>
            <span className={`visita-timeline-item__status-label visita-timeline-item__status-label--${visit.statusLevel}`}>
              {visit.statoGeneraleLabel}
            </span>
          </div>
        </header>

        <div className="visita-timeline-item__meta">
          <span className="visita-timeline-item__meta-chip">
            <User size={14} aria-hidden="true" />
            {visit.operatoreLabel}
          </span>
          <span className="visita-timeline-item__meta-chip">
            <CloudSun size={14} aria-hidden="true" />
            {visit.meteoLabel}
          </span>
          <span className="visita-timeline-item__meta-chip">
            <Thermometer size={14} aria-hidden="true" />
            {visit.temperaturaLabel}
          </span>
        </div>

        <div className="visita-timeline-item__grid">
          <TimelineMetric icon={<Crown size={18} />} label="Regina" value={visit.reginaLabel} />
          <TimelineMetric icon={<Hexagon size={18} />} label="Covata" value={visit.covataLabel} />
          <TimelineMetric icon={<Droplets size={18} />} label="Scorte" value={visit.scorteLabel} />
          <TimelineMetric icon={<Camera size={18} />} label="Melario" value={visit.melarioLabel} />
        </div>

        <section className="visita-timeline-item__section" aria-label="Azioni consigliate">
          <p className="visita-timeline-item__section-title">Azioni consigliate</p>
          <AzioniConsigliateList
            azioni={visit.azioniConsigliate}
            className="visita-timeline-item__azioni"
          />
        </section>

        {visit.noteDisplay && (
          <section className="visita-timeline-item__section visita-timeline-item__note" aria-label="Note">
            <p className="visita-timeline-item__section-title">
              <StickyNote size={16} aria-hidden="true" />
              Note
            </p>
            <p className="visita-timeline-item__note-text">{visit.noteDisplay}</p>
          </section>
        )}

        {visit.fotoPaths.length > 0 && (
          <section className="visita-timeline-item__section" aria-label="Foto visita">
            <p className="visita-timeline-item__section-title">
              <Camera size={16} aria-hidden="true" />
              Foto ({visit.fotoPaths.length})
            </p>
            <div className="visita-timeline-item__photos">
              {visit.fotoPaths.map((path, photoIndex) => (
                <figure key={`${visit.id}-${photoIndex}`} className="visita-timeline-item__photo">
                  <img src={path} alt="" loading="lazy" className="visita-timeline-item__photo-img" />
                </figure>
              ))}
            </div>
          </section>
        )}

        {(visit.trattamenti.length > 0 || visit.produzione.length > 0) && (
          <footer className="visita-timeline-item__footer">
            {visit.trattamenti.length > 0 && (
              <span className="visita-timeline-item__tag">
                Trattamento: {visit.trattamenti.join(', ')}
              </span>
            )}
            {visit.produzione.length > 0 && (
              <span className="visita-timeline-item__tag">
                Produzione: {visit.produzione.join(', ')}
              </span>
            )}
          </footer>
        )}
      </article>
    </motion.li>
  )
}
