import { motion } from 'framer-motion'
import { Crown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '../../../components/ui/Badge'
import { useAppPath } from '../../../demo/useAppPath'
import type { ReginaListItem } from '../types/regina.types'
import './ReginaCard.css'

type ReginaCardProps = {
  item: ReginaListItem
  index: number
}

export function ReginaCard({ item, index }: ReginaCardProps) {
  const appPath = useAppPath()

  return (
    <motion.article
      className="regina-card meli-glass meli-glass--deep"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to={appPath(`/regine/${item.regina.id}`)} className="regina-card__link">
        <header className="regina-card__header">
          <span className="regina-card__icon" aria-hidden="true">
            <Crown size={22} strokeWidth={1.75} />
          </span>
          <div className="regina-card__titles">
            <h2 className="regina-card__title">{item.displayTitle}</h2>
            <p className="regina-card__subtitle">{item.displaySubtitle}</p>
          </div>
          {item.isAttuale && (
            <Badge variant="honey" className="regina-card__badge">
              Attuale
            </Badge>
          )}
        </header>

        <dl className="regina-card__meta">
          <div>
            <dt>Colore</dt>
            <dd>{item.coloreLabel ?? '—'}</dd>
          </div>
          <div>
            <dt>Stato</dt>
            <dd>{item.statoLabel}</dd>
          </div>
          <div>
            <dt>Apiario</dt>
            <dd>{item.apiario?.nome ?? '—'}</dd>
          </div>
        </dl>
      </Link>
    </motion.article>
  )
}
