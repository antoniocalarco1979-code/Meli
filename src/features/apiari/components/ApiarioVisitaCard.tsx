import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { useAppPath } from '../../../demo/useAppPath'
import { getSaluteLevel } from '../../../utils/salute'
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
  const appPath = useAppPath()
  const level = getSaluteLevel(salute)

  return (
    <article
      className={`apiario-visita-card${active ? ' apiario-visita-card--active' : ''}`}
    >
      <h2 className="apiario-visita-card__title">
        <span aria-hidden="true">🐝</span>
        ARNIA {numero}
      </h2>

      <p className="apiario-visita-card__stato">
        <span aria-hidden="true">{STATO_EMOJI[level]}</span>
        <span>Stato</span>
      </p>

      <div className="apiario-visita-card__visita">
        <span className="apiario-visita-card__visita-label">Ultima visita</span>
        <span className="apiario-visita-card__visita-value">{ultimaVisitaLabel}</span>
      </div>

      <div className="apiario-visita-card__actions">
        <Link
          to={appPath(`/arnie/${arniaId}`)}
          className="ui-button ui-button--secondary ui-button--lg ui-button--full apiario-visita-card__btn"
        >
          Apri arnia
        </Link>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          className="apiario-visita-card__btn"
          onClick={onVisita}
        >
          Visita
        </Button>
      </div>
    </article>
  )
}
