import { motion } from 'framer-motion'
import { CalendarDays, Camera, CloudSun, Crown, Droplets, Pill, StickyNote } from 'lucide-react'
import type { VisitaTimelineEntry } from '../types'
import { formatFullDate } from '../utils/arniaFormatters'
import './TimelineCard.css'

type TimelineCardProps = {
  visits: VisitaTimelineEntry[]
}

export function TimelineCard({ visits }: TimelineCardProps) {
  return (
    <motion.section
      className="timeline-card meli-glass meli-glass--deep"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Timeline visite"
    >
      <header className="timeline-card__header">
        <CalendarDays size={24} strokeWidth={1.65} aria-hidden="true" />
        <h2 className="arnia-section-title">Timeline</h2>
        <span className="timeline-card__count">{visits.length}</span>
      </header>

      {visits.length === 0 ? (
        <p className="timeline-card__empty">Nessuna visita registrata</p>
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
              <div className="timeline-card__date">
                <time dateTime={new Date(visit.data).toISOString()}>
                  {formatFullDate(visit.data)}
                </time>
              </div>

              {visit.fotoPaths.length > 0 && (
                <div className="timeline-card__photos">
                  {visit.fotoPaths.slice(0, 3).map((src, i) => (
                    <img key={i} src={src} alt="" className="timeline-card__photo" />
                  ))}
                </div>
              )}

              <ul className="timeline-card__meta">
                {visit.meteo && (
                  <li>
                    <CloudSun size={18} aria-hidden="true" />
                    <span>{visit.meteo}</span>
                  </li>
                )}
                <li>
                  <Crown size={18} aria-hidden="true" />
                  <span>Regina {visit.reginaVista ? 'vista' : 'non vista'}</span>
                </li>
                {visit.trattamenti.map((t) => (
                  <li key={t}>
                    <Pill size={18} aria-hidden="true" />
                    <span>{t}</span>
                  </li>
                ))}
                {visit.produzione.map((p) => (
                  <li key={p}>
                    <Droplets size={18} aria-hidden="true" />
                    <span>{p}</span>
                  </li>
                ))}
                {visit.note && (
                  <li className="timeline-card__note">
                    <StickyNote size={18} aria-hidden="true" />
                    <span>{visit.note}</span>
                  </li>
                )}
                {visit.fotoPaths.length === 0 && (
                  <li className="timeline-card__muted">
                    <Camera size={18} aria-hidden="true" />
                    <span>Nessuna foto</span>
                  </li>
                )}
              </ul>
            </motion.li>
          ))}
        </ol>
      )}
    </motion.section>
  )
}
