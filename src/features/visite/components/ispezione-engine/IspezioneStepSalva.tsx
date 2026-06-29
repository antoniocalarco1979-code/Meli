import { computeIspezioneSummary, type IspezioneWizardState } from '../../types/ispezioneWizard.types'

type IspezioneStepSalvaProps = {
  state: IspezioneWizardState
  saving: boolean
  disabled: boolean
  onSave: () => void
}

export function IspezioneStepSalva({ state, saving, disabled, onSave }: IspezioneStepSalvaProps) {
  const summary = computeIspezioneSummary(state)

  return (
    <div className="ispezione-step ispezione-step--salva">
      <div className="ispezione-step__question">
        <span className="ispezione-step__emoji" aria-hidden="true">
          ✅
        </span>
        <h2 className="ispezione-step__title">Riepilogo ispezione</h2>
      </div>
      <p className="ispezione-step__lead">
        Verifica i dati raccolti prima di salvare.
      </p>

      <dl className="ispezione-riepilogo">
        <div className="ispezione-riepilogo__row">
          <dt>Telaini controllati</dt>
          <dd>{summary.totaleTelai}</dd>
        </div>
        <div className="ispezione-riepilogo__row">
          <dt>Telaini con covata</dt>
          <dd>{summary.telaiConCovata}</dd>
        </div>
        <div className="ispezione-riepilogo__row">
          <dt>Telaini scorte buone</dt>
          <dd>{summary.telaiScorteBuone}</dd>
        </div>
        <div className="ispezione-riepilogo__row">
          <dt>Regina vista</dt>
          <dd>{summary.reginaVista ? 'Sì' : 'No'}</dd>
        </div>
        <div className="ispezione-riepilogo__row">
          <dt>Problemi</dt>
          <dd>{summary.problemi.length > 0 ? summary.problemi.join(', ') : 'Nessuno'}</dd>
        </div>
        <div className="ispezione-riepilogo__row ispezione-riepilogo__row--highlight">
          <dt>Vassoio antivarroa</dt>
          <dd>
            Varroa {summary.vassoioVarroaLabel}
            {summary.vassoioAcariStimati != null ? ` · ${summary.vassoioAcariStimati} acari` : ''}
          </dd>
        </div>
      </dl>

      <button
        type="button"
        className="ispezione-salva-btn"
        onClick={onSave}
        disabled={disabled || saving}
      >
        {saving ? 'Salvataggio…' : 'SALVA ISPEZIONE'}
      </button>
    </div>
  )
}
