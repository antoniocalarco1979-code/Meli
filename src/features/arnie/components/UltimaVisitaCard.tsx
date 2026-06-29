import { motion } from 'framer-motion'
import { CloudSun, Crown, StickyNote } from 'lucide-react'
import type { UltimaVisitaSummary } from '../types'
import './UltimaVisitaCard.css'

type UltimaVisitaCardProps = {
  visit: UltimaVisitaSummary
}

export function UltimaVisitaCard({ visit }: UltimaVisitaCardProps) {
  return (
    <motion.section
      className="ultima-visita-card meli-glass meli-glass--deep"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Ultima visita"
    >
      <header className="ultima-visita-card__header">
        <h2 className="arnia-section-title">📅 Ultima visita</h2>
      </header>

      {!visit.data ? (
        <p className="ultima-visita-card__empty">Nessuna visita registrata</p>
      ) : (
        <>
          <p className="ultima-visita-card__date">{visit.dataFull ?? visit.dataLabel}</p>
          <ul className="ultima-visita-card__list">
            {visit.meteo && (
              <li>
                <CloudSun size={20} aria-hidden="true" />
                <span>{visit.meteo}</span>
              </li>
            )}
            <li>
              <Crown size={20} aria-hidden="true" />
              <span>Regina {visit.reginaVista ? 'vista' : 'non vista'}</span>
            </li>
            {visit.note && (
              <li>
                <StickyNote size={20} aria-hidden="true" />
                <span>{visit.note}</span>
              </li>
            )}
          </ul>
        </>
      )}
    </motion.section>
  )
}
