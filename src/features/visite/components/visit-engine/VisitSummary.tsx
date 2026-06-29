import {
  labelAzione,
  labelCovata,
  labelForza,
  labelOpercolatura,
  labelRegina,
  labelRisorsa,
  labelScorte,
  resolveWizardForza,
} from '../../services/visitWizardMapper'
import { formatReginaEsito, formatStarRating, labelTelaioTipo } from '../../services/visitTelaiMapper'
import type { VisitWizardState } from '../../types/visitWizard.types'

type VisitSummaryProps = {
  state: VisitWizardState
  saving: boolean
  onSave: () => void
}

export function VisitSummary({ state, saving, onSave }: VisitSummaryProps) {
  const forza = resolveWizardForza(state)

  return (
    <div className="visit-summary">
      {state.telai.length > 0 && (
        <ul className="visit-summary-telai">
          {state.telai.map((telaio) => (
            <li key={telaio.id} className="visit-summary-telai__item">
              <strong>Telaio {telaio.numero}</strong>
              <span>{labelTelaioTipo(telaio.tipo)}</span>
              <span>
                {telaio.tipo === 'regina_vista'
                  ? formatReginaEsito(telaio.reginaEsito)
                  : formatStarRating(telaio.rating ?? 0)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="visit-summary__rows">
        <div className="visit-summary__row">
          <strong>Regina</strong>
          <span>{labelRegina(state.regina)}</span>
        </div>
        <div className="visit-summary__row">
          <strong>Covata</strong>
          <span>{labelCovata(state.covata)}</span>
        </div>
        <div className="visit-summary__row">
          <strong>Miele</strong>
          <span>{labelRisorsa(state.miele)}</span>
        </div>
        <div className="visit-summary__row">
          <strong>Polline</strong>
          <span>{labelRisorsa(state.polline)}</span>
        </div>
        <div className="visit-summary__row">
          <strong>Scorte</strong>
          <span>{labelScorte(state.scorte)}</span>
        </div>
        <div className="visit-summary__row">
          <strong>Forza</strong>
          <span>{labelForza(forza)}</span>
        </div>
        <div className="visit-summary__row">
          <strong>Melario</strong>
          <span>{state.haMelario === true ? 'Sì' : state.haMelario === false ? 'No' : '—'}</span>
        </div>
        {state.haMelario === true && (
          <div className="visit-summary__row">
            <strong>Opercolatura</strong>
            <span>{labelOpercolatura(state.opercolatura)}</span>
          </div>
        )}
        <div className="visit-summary__row">
          <strong>Azione</strong>
          <span>{labelAzione(state)}</span>
        </div>
        <div className="visit-summary__row">
          <strong>Foto</strong>
          <span>{state.photos.length > 0 ? `${state.photos.length} scattata/e` : 'Nessuna'}</span>
        </div>
        {state.note.trim() && (
          <div className="visit-summary__row">
            <strong>Decisioni</strong>
            <span>{state.note.trim()}</span>
          </div>
        )}
      </div>

      <button type="button" className="visit-summary__save" disabled={saving} onClick={onSave}>
        {saving ? 'Salvataggio…' : 'Salva e continua'}
      </button>
    </div>
  )
}
