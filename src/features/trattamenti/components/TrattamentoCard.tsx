import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '../../../components/ui/Badge'
import { useAppPath } from '../../../demo/useAppPath'
import type { TrattamentoListItem } from '../types/trattamento.types'
import './TrattamentoCard.css'

type TrattamentoCardProps = {
  item: TrattamentoListItem
  index: number
}

export function TrattamentoCard({ item, index }: TrattamentoCardProps) {
  const appPath = useAppPath()

  return (
    <motion.article
      className="trattamento-card meli-glass meli-glass--deep"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to={appPath(`/trattamenti/${item.trattamento.id}`)} className="trattamento-card__link">
        <header className="trattamento-card__header">
          <span className="trattamento-card__icon" aria-hidden="true">
            <Shield size={22} strokeWidth={1.75} />
          </span>
          <div className="trattamento-card__titles">
            <h2 className="trattamento-card__title">{item.tipoLabel}</h2>
            <p className="trattamento-card__subtitle">
              {item.arnia ? `Arnia ${item.arnia.numero}` : '—'}
              {item.apiario ? ` · ${item.apiario.nome}` : ''}
            </p>
          </div>
          {item.hasPromemoria && (
            <Badge variant="honey" className="trattamento-card__badge">
              Promemoria
            </Badge>
          )}
        </header>

        <dl className="trattamento-card__meta">
          <div>
            <dt>Data</dt>
            <dd>{item.dataLabel}</dd>
          </div>
          <div>
            <dt>Principio</dt>
            <dd>{item.principioLabel}</dd>
          </div>
        </dl>
      </Link>
    </motion.article>
  )
}
