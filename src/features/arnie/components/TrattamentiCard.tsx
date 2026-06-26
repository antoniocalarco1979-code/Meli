import { motion } from 'framer-motion'
import { Pill, Shield } from 'lucide-react'
import type { TrattamentoEntry } from '../types'
import './TrattamentiCard.css'

type TrattamentiCardProps = {
  trattamenti: TrattamentoEntry[]
}

export function TrattamentiCard({ trattamenti }: TrattamentiCardProps) {
  return (
    <motion.section
      className="trattamenti-card meli-glass meli-glass--deep"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Trattamenti"
    >
      <header className="trattamenti-card__header">
        <Shield size={24} strokeWidth={1.65} aria-hidden="true" />
        <h2 className="arnia-section-title">Trattamenti</h2>
        <span className="trattamenti-card__count">{trattamenti.length}</span>
      </header>

      {trattamenti.length === 0 ? (
        <p className="trattamenti-card__empty">Nessun trattamento registrato</p>
      ) : (
        <ul className="trattamenti-card__list">
          {trattamenti.map((t, index) => (
            <motion.li
              key={t.id}
              className="trattamenti-card__item"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
            >
              <Pill size={22} aria-hidden="true" />
              <div>
                <p className="trattamenti-card__name">{t.prodotto}</p>
                <p className="trattamenti-card__meta">
                  {t.dataLabel}
                  {t.dose ? ` · ${t.dose}` : ''}
                  {t.scadenzaLabel ? ` · Scadenza ${t.scadenzaLabel}` : ''}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.section>
  )
}
