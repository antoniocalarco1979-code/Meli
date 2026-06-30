import { VASSOIO_VARROA_OPTIONS } from '../../types/ispezioneWizard.types'
import type { VisitaGuidataState } from '../../types/visitaGuidata.types'
import { OPERCOLATURA_OPTIONS } from '../../types/visitWizard.types'

type GuidataStepSalvaProps = {
  state: VisitaGuidataState
  hasMelario: boolean
  saving: boolean
  onSave: () => void
}

function labelFrom<T extends string>(
  options: { value: T; label: string }[],
  value: T | null | undefined,
): string {
  if (!value) return '—'
  return options.find((option) => option.value === value)?.label ?? value
}

export function GuidataStepSalva({ state, hasMelario, saving, onSave }: GuidataStepSalvaProps) {
  const fotoCount = [state.vassoio.foto, state.melario.foto, state.nido.foto].filter(Boolean).length

  return (
    <div className="ispezione-step ispezione-step--salva">
      <div className="ispezione-step__question">
        <span className="ispezione-step__emoji" aria-hidden="true">
          ✅
        </span>
        <h2 className="ispezione-step__title">Riepilogo visita</h2>
      </div>
      <p className="ispezione-step__lead">Verifica i dati raccolti prima di salvare la visita.</p>

      <dl className="ispezione-riepilogo">
        <div className="ispezione-riepilogo__row ispezione-riepilogo__row--highlight">
          <dt>Varroa vassoio</dt>
          <dd>{labelFrom(VASSOIO_VARROA_OPTIONS, state.vassoio.varroaPresente)}</dd>
        </div>
        {hasMelario && (
          <div className="ispezione-riepilogo__row">
            <dt>Opercolatura melario</dt>
            <dd>{labelFrom(OPERCOLATURA_OPTIONS, state.melario.opercolatura)}</dd>
          </div>
        )}
        <div className="ispezione-riepilogo__row">
          <dt>Foto allegate</dt>
          <dd>{fotoCount}</dd>
        </div>
        {(state.vassoio.note || state.melario.note || state.nido.note) && (
          <div className="ispezione-riepilogo__row">
            <dt>Note</dt>
            <dd>
              {[state.vassoio.note, state.melario.note, state.nido.note]
                .filter((note) => note.trim())
                .join(' · ') || '—'}
            </dd>
          </div>
        )}
      </dl>

      <button type="button" className="ispezione-salva-btn" onClick={onSave} disabled={saving}>
        {saving ? 'Salvataggio…' : 'SALVA VISITA'}
      </button>
    </div>
  )
}
