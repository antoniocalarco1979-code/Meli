import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { getSaluteLevel } from '../../arnie/utils/arniaFormatters'
import './ApiarioVisitaCard.css'

const STATO_EMOJI = {
  green: '🟢',
  yellow: '🟡',
  red: '🔴',
} as const

type ApiarioVisitaCardProps = {
  arniaId: string
  numero: string
  salute: number
  ultimaVisitaLabel: string
  active?: boolean
  onVisita: () => void
}

export function ApiarioVisitaCard({
  arniaId,
  numero,
  salute,
  ultimaVisitaLabel,
  active,
  onVisita,
}: ApiarioVisitaCardProps) {
  const level = getSaluteLevel(salute)

  return (
    <article
      className={`apiario-visita-card${active ? ' apiario-visita-card--active' : ''}`}
    >
      <Link to={`/arnie/${arniaId}`} className="apiario-visita-card__title">
        <span aria-hidden="true">🐝</span>
        ARNIA {numero}
      </Link>

      <p className="apiario-visita-card__stato">
        <span aria-hidden="true">{STATO_EMOJI[level]}</span>
        <span>Stato</span>
      </p>

      <div className="apiario-visita-card__visita">
        <span className="apiario-visita-card__visita-label">Ultima visita</span>
        <span className="apiario-visita-card__visita-value">{ultimaVisitaLabel}</span>
      </div>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        className="apiario-visita-card__btn"
        onClick={onVisita}
      >
        VISITA
      </Button>
    </article>
  )
}
