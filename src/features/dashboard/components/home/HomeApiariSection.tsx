import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import type { HomeApiarioCard } from '../../hooks/useHomeApiariCards'
import { APIARIO_STATUS_LABEL } from '../../utils/homeHelpers'
import './HomeApiariSection.css'

type HomeApiariSectionProps = {
  cards: HomeApiarioCard[]
  loading?: boolean
  onOpen: (apiarioId: string) => void
}

export function HomeApiariSection({ cards, loading = false, onOpen }: HomeApiariSectionProps) {
  return (
    <motion.section
      className="home-apiari"
      aria-label="I miei Apiari"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
    >
      <header className="home-apiari__header">
        <h2 className="home-apiari__title">I miei Apiari</h2>
        <p className="home-apiari__sub">Panoramica rapida dei tuoi siti apistici</p>
      </header>

      {loading ? (
        <p className="home-apiari__loading">Caricamento apiari…</p>
      ) : cards.length === 0 ? (
        <div className="home-apiari__empty meli-glass">
          <MapPin size={28} strokeWidth={1.5} aria-hidden="true" />
          <p>Nessun apiario registrato</p>
        </div>
      ) : (
        <ul className="home-apiari__list">
          {cards.map((card, index) => (
            <motion.li
              key={card.id}
              className="home-apiario-card meli-glass meli-glass--deep"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.14 + index * 0.04, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="home-apiario-card__top">
                <h3 className="home-apiario-card__name">{card.nome}</h3>
                <span
                  className={`home-apiario-card__status home-apiario-card__status--${card.status}`}
                >
                  {APIARIO_STATUS_LABEL[card.status]}
                </span>
              </div>

              <dl className="home-apiario-card__meta">
                <div>
                  <dt>Arnie</dt>
                  <dd>{card.arnieCount}</dd>
                </div>
                <div>
                  <dt>Ultima visita</dt>
                  <dd>{card.ultimaVisitaLabel}</dd>
                </div>
              </dl>

              <button
                type="button"
                className="home-apiario-card__open"
                onClick={() => onOpen(card.id)}
              >
                APRI
              </button>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.section>
  )
}
