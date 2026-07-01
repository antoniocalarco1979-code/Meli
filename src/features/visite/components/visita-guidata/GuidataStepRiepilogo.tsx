import { useElapsedSeconds } from '../../hooks/useElapsedSeconds'
import {
  collectVisitaGuidataNotes,
  deriveCelleRealiPresentiFromTelaini,
  deriveReginaVistaFromTelaini,
} from '../../services/telainoPanelNoteFormat'
import { countTelainiVisitaCompletati } from '../../types/telainoPanel.types'
import {
  formatVisitaDate,
  formatVisitaDuration,
  formatVisitaTime,
  labelSiNo,
  type VisitaGuidataState,
} from '../../types/visitaGuidata.types'

type GuidataStepRiepilogoProps = {
  arniaNumero: string
  state: VisitaGuidataState
  saving: boolean
  saved: boolean
  isGiroActive: boolean
  onSave: () => void
  onContinue: () => void
}

function formatSiNo(value: boolean | null | undefined): string {
  if (value == null) return '—'
  return value ? 'Sì' : 'No'
}

export function GuidataStepRiepilogo({
  arniaNumero,
  state,
  saving,
  saved,
  isGiroActive,
  onSave,
  onContinue,
}: GuidataStepRiepilogoProps) {
  const elapsed = useElapsedSeconds(state.startedAt ?? Date.now(), Boolean(state.startedAt))
  const reginaVista = deriveReginaVistaFromTelaini(state.nido.telaini) ?? state.nido.reginaVista === 'si'
  const reginaVistaKnown =
    deriveReginaVistaFromTelaini(state.nido.telaini) != null || state.nido.reginaVista != null
  const celleReali = deriveCelleRealiPresentiFromTelaini(state.nido.telaini)
  const noteText = collectVisitaGuidataNotes(state)
  const telainiCompletati = countTelainiVisitaCompletati(state.nido.telaini)

  if (saved) {
    return (
      <div className="ispezione-step ispezione-step--salva visita-guidata-step visita-guidata-step--success">
        <div className="ispezione-step__question">
          <span className="ispezione-step__emoji" aria-hidden="true">
            ✅
          </span>
          <h2 className="ispezione-step__title">Visita salvata</h2>
        </div>

        <p className="visita-guidata-step__success-text">
          La visita è stata registrata nella cronologia dell&apos;arnia.
        </p>

        <button
          type="button"
          className="ispezione-salva-btn visita-guidata-action visita-guidata-action--primary"
          onClick={onContinue}
        >
          {isGiroActive ? 'VAI ALL\'ARNIA SUCCESSIVA' : 'TORNA ALLA SCHEDA ARNIA'}
        </button>
      </div>
    )
  }

  return (
    <div className="ispezione-step ispezione-step--salva visita-guidata-step visita-guidata-step--riepilogo">
      <div className="ispezione-step__question">
        <span className="ispezione-step__emoji" aria-hidden="true">
          📋
        </span>
        <h2 className="ispezione-step__title">Riepilogo visita</h2>
      </div>

      <p className="ispezione-step__lead">
        Verifica i dati raccolti prima del salvataggio definitivo.
      </p>

      <dl className="ispezione-riepilogo visita-guidata-riepilogo">
        <div className="ispezione-riepilogo__row ispezione-riepilogo__row--highlight">
          <dt>Arnia</dt>
          <dd>{arniaNumero}</dd>
        </div>
        <div className="ispezione-riepilogo__row">
          <dt>Data e ora</dt>
          <dd>
            {state.startedAt
              ? `${formatVisitaDate(state.startedAt)} · ${formatVisitaTime(state.startedAt)}`
              : '—'}
          </dd>
        </div>
        <div className="ispezione-riepilogo__row">
          <dt>Durata visita</dt>
          <dd>{state.startedAt ? formatVisitaDuration(elapsed) : '—'}</dd>
        </div>
        <div className="ispezione-riepilogo__row">
          <dt>Affumicatore</dt>
          <dd>{labelSiNo(state.affumicatore.utilizzato)}</dd>
        </div>
        <div className="ispezione-riepilogo__row">
          <dt>Melario</dt>
          <dd>{labelSiNo(state.melario.presente)}</dd>
        </div>
        <div className="ispezione-riepilogo__row">
          <dt>Telaini controllati</dt>
          <dd>
            {telainiCompletati} / {state.nido.telaini.length}
          </dd>
        </div>
        <div className="ispezione-riepilogo__row">
          <dt>Regina vista</dt>
          <dd>{reginaVistaKnown ? formatSiNo(reginaVista) : '—'}</dd>
        </div>
        <div className="ispezione-riepilogo__row">
          <dt>Celle reali presenti</dt>
          <dd>{formatSiNo(celleReali)}</dd>
        </div>
        <div className="ispezione-riepilogo__row ispezione-riepilogo__row--multiline">
          <dt>Note</dt>
          <dd>{noteText}</dd>
        </div>
        <div className="ispezione-riepilogo__row ispezione-riepilogo__row--multiline">
          <dt>Interventi selezionati</dt>
          <dd>
            {state.interventi.items.length > 0
              ? state.interventi.items.map((item) => item.label).join(', ')
              : 'Nessuno'}
          </dd>
        </div>
      </dl>

      <button
        type="button"
        className="ispezione-salva-btn visita-guidata-action visita-guidata-action--primary"
        onClick={onSave}
        disabled={saving}
      >
        {saving ? 'Salvataggio…' : 'SALVA VISITA'}
      </button>
    </div>
  )
}
