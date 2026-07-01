import type { ApiarioPosizioneState } from '../types/apiarioPosizione.types'

type ApiarioPosizioneSummaryProps = {
  value: Pick<
    ApiarioPosizioneState,
    'latitudine' | 'longitudine' | 'comune' | 'provincia' | 'regione' | 'quota' | 'indirizzo'
  >
}

export function ApiarioPosizioneSummary({ value }: ApiarioPosizioneSummaryProps) {
  const hasCoords = value.latitudine != null && value.longitudine != null
  if (!hasCoords) return null

  return (
    <dl className="apiario-posizione__summary">
      <div>
        <dt>Coordinate</dt>
        <dd>
          {value.latitudine}, {value.longitudine}
        </dd>
      </div>
      {value.comune && (
        <div>
          <dt>Comune</dt>
          <dd>{value.comune}</dd>
        </div>
      )}
      {value.provincia && (
        <div>
          <dt>Provincia</dt>
          <dd>{value.provincia}</dd>
        </div>
      )}
      {value.regione && (
        <div>
          <dt>Regione</dt>
          <dd>{value.regione}</dd>
        </div>
      )}
      {value.quota != null && (
        <div>
          <dt>Quota</dt>
          <dd>{value.quota} m</dd>
        </div>
      )}
      {value.indirizzo && (
        <div className="apiario-posizione__summary-wide">
          <dt>Indirizzo</dt>
          <dd>{value.indirizzo}</dd>
        </div>
      )}
    </dl>
  )
}
