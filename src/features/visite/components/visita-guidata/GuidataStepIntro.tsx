import { useElapsedSeconds } from '../../hooks/useElapsedSeconds'
import {
  formatVisitaDate,
  formatVisitaDuration,
  formatVisitaTime,
} from '../../types/visitaGuidata.types'

type GuidataStepIntroProps = {
  arniaNumero: string
  startedAt: number
  meteo?: string
  onStartControllo: () => void
}

export function GuidataStepIntro({
  arniaNumero,
  startedAt,
  meteo,
  onStartControllo,
}: GuidataStepIntroProps) {
  const elapsed = useElapsedSeconds(startedAt)

  return (
    <div className="ispezione-step visita-guidata-step visita-guidata-step--intro">
      <div className="ispezione-step__question">
        <span className="ispezione-step__emoji" aria-hidden="true">
          🐝
        </span>
        <h2 className="ispezione-step__title">Visita guidata</h2>
      </div>

      <p className="ispezione-step__lead">
        Sessione avviata per l&apos;arnia <strong>{arniaNumero}</strong>. I dati vengono salvati
        automaticamente ad ogni passaggio.
      </p>

      <dl className="visita-guidata-intro-grid">
        <div className="visita-guidata-intro-grid__row">
          <dt>Arnia</dt>
          <dd>{arniaNumero}</dd>
        </div>
        <div className="visita-guidata-intro-grid__row">
          <dt>Data</dt>
          <dd>{formatVisitaDate(startedAt)}</dd>
        </div>
        <div className="visita-guidata-intro-grid__row">
          <dt>Ora</dt>
          <dd>{formatVisitaTime(startedAt)}</dd>
        </div>
        <div className="visita-guidata-intro-grid__row visita-guidata-intro-grid__row--highlight">
          <dt>Timer</dt>
          <dd className="visita-guidata-intro-grid__timer">{formatVisitaDuration(elapsed)}</dd>
        </div>
        {meteo ? (
          <div className="visita-guidata-intro-grid__row">
            <dt>Meteo</dt>
            <dd>{meteo}</dd>
          </div>
        ) : null}
      </dl>

      <button
        type="button"
        className="visita-guidata-action visita-guidata-action--primary"
        onClick={onStartControllo}
      >
        INIZIA CONTROLLO
      </button>
    </div>
  )
}
