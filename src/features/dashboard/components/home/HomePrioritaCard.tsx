import { motion } from 'framer-motion'
import { Crown, Droplets, Hexagon, Layers } from 'lucide-react'
import type { HomePriorita } from '../../hooks/useHomePriorita'
import './HomePrioritaCard.css'

type HomePrioritaCardProps = Pick<
  HomePriorita,
  | 'arnieDaVisitare'
  | 'melariDaAggiungere'
  | 'regineDaVerificare'
  | 'trattamentiInScadenza'
  | 'loading'
>

const ITEMS = [
  {
    key: 'arnieDaVisitare' as const,
    label: 'Arnie da visitare',
    icon: Hexagon,
    accent: 'honey',
  },
  {
    key: 'melariDaAggiungere' as const,
    label: 'Melari da aggiungere',
    icon: Layers,
    accent: 'amber',
  },
  {
    key: 'regineDaVerificare' as const,
    label: 'Regine da verificare',
    icon: Crown,
    accent: 'gold',
  },
  {
    key: 'trattamentiInScadenza' as const,
    label: 'Trattamenti in scadenza',
    icon: Droplets,
    accent: 'green',
  },
]

export function HomePrioritaCard({
  arnieDaVisitare,
  melariDaAggiungere,
  regineDaVerificare,
  trattamentiInScadenza,
  loading = false,
}: HomePrioritaCardProps) {
  const values = {
    arnieDaVisitare,
    melariDaAggiungere,
    regineDaVerificare,
    trattamentiInScadenza,
  }

  return (
    <motion.section
      className="home-priorita meli-glass meli-glass--deep"
      aria-label="Priorità di oggi"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <header className="home-priorita__header">
        <p className="home-priorita__eyebrow meli-label">Oggi</p>
        <h2 className="home-priorita__title">Priorità di oggi</h2>
      </header>

      <ul className="home-priorita__grid">
        {ITEMS.map(({ key, label, icon: Icon, accent }, index) => (
          <motion.li
            key={key}
            className={`home-priorita__item home-priorita__item--${accent}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08 + index * 0.04, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="home-priorita__icon" aria-hidden="true">
              <Icon size={20} strokeWidth={1.75} />
            </span>
            <div className="home-priorita__content">
              <p className="home-priorita__value">{loading ? '—' : values[key]}</p>
              <p className="home-priorita__label">{label}</p>
            </div>
          </motion.li>
        ))}
      </ul>
    </motion.section>
  )
}
