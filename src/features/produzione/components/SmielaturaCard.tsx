import { motion } from 'framer-motion'
import { Droplets } from 'lucide-react'
import type { SmielaturaListItem } from '../types/smielatura.types'
import './SmielaturaCard.css'

type SmielaturaCardProps = {
  item: SmielaturaListItem
  index: number
}

export function SmielaturaCard({ item, index }: SmielaturaCardProps) {
  const arnieLabel =
    item.arnie.length > 0
      ? item.arnie.map((arnia) => `Arnia ${arnia.numero}`).join(', ')
      : undefined

  return (
    <motion.article
      className="smielatura-card meli-glass meli-glass--deep"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
    >
      <header className="smielatura-card__header">
        <span className="smielatura-card__icon" aria-hidden="true">
          <Droplets size={22} strokeWidth={1.75} />
        </span>
        <div className="smielatura-card__titles">
          <h2 className="smielatura-card__title">{item.kgLabel}</h2>
          <p className="smielatura-card__subtitle">
            {item.apiario?.nome ?? 'Apiario'}
            {arnieLabel ? ` · ${arnieLabel}` : ''}
          </p>
        </div>
      </header>

      <dl className="smielatura-card__meta">
        <div>
          <dt>Data</dt>
          <dd>{item.dataLabel}</dd>
        </div>
        <div>
          <dt>Melari</dt>
          <dd>{item.melariLabel}</dd>
        </div>
        {item.umiditaLabel && (
          <div>
            <dt>Umidità</dt>
            <dd>{item.umiditaLabel}</dd>
          </div>
        )}
      </dl>

      {item.smielatura.note && (
        <p className="smielatura-card__note">{item.smielatura.note}</p>
      )}
    </motion.article>
  )
}
