import { useState } from 'react'
import {
  applyTelaiToWizardState,
  createTelaioEntry,
  formatReginaEsito,
  formatStarRating,
  labelTelaioTipo,
} from '../../services/visitTelaiMapper'
import {
  REGINA_OPTIONS,
  TELAIO_TIPO_OPTIONS,
  type VisitReginaChoice,
  type VisitTelaioTipo,
  type VisitWizardState,
} from '../../types/visitWizard.types'
import { VisitChoiceGrid } from './VisitChoiceGrid'
import { VisitStarRating } from './VisitStarRating'
import { VisitStep } from './VisitStep'

type VisitTelaiStepProps = {
  state: VisitWizardState
  onPatchState: (patch: Partial<VisitWizardState>) => void
}

export function VisitTelaiStep({ state, onPatchState }: VisitTelaiStepProps) {
  const [draftTipo, setDraftTipo] = useState<VisitTelaioTipo>('covata')
  const [draftRating, setDraftRating] = useState(4)
  const [draftReginaEsito, setDraftReginaEsito] = useState<VisitReginaChoice | null>(null)

  const nextNumero = state.telai.length + 1
  const isReginaDraft = draftTipo === 'regina_vista'
  const canAdd = isReginaDraft ? draftReginaEsito != null : draftRating >= 1

  const handleAddTelaio = () => {
    if (!canAdd) return
    const entry = createTelaioEntry(nextNumero, draftTipo, draftRating, draftReginaEsito)
    onPatchState(applyTelaiToWizardState([...state.telai, entry]))
    if (isReginaDraft) setDraftReginaEsito(null)
  }

  return (
    <VisitStep emoji="📦" question="Ispezione telai" hint="Aggiungi ogni telaio estratto">
      {state.telai.length > 0 && (
        <ul className="visit-telai">
          {state.telai.map((telaio, index) => (
            <li key={telaio.id} className="visit-telai__item">
              <p className="visit-telai__title">Telaio {telaio.numero}</p>
              <p className="visit-telai__tipo">{labelTelaioTipo(telaio.tipo)}</p>
              {telaio.tipo === 'regina_vista' ? (
                <p className="visit-telai__regina">{formatReginaEsito(telaio.reginaEsito)}</p>
              ) : (
                <p className="visit-telai__stars" aria-label={`${telaio.rating} stelle`}>
                  {formatStarRating(telaio.rating ?? 0)}
                </p>
              )}
              {index < state.telai.length - 1 && <hr className="visit-telai__divider" />}
            </li>
          ))}
        </ul>
      )}

      <div className="visit-telai-form">
        <p className="visit-telai-form__heading">Telaio {nextNumero}</p>
        <div className="visit-telai-form__types" role="tablist" aria-label="Tipo ispezione">
          {TELAIO_TIPO_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              role="tab"
              aria-selected={draftTipo === option.value}
              className={`visit-telai-form__type${draftTipo === option.value ? ' visit-telai-form__type--active' : ''}`}
              onClick={() => setDraftTipo(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        {isReginaDraft ? (
          <VisitChoiceGrid<VisitReginaChoice>
            variant="status"
            columns={false}
            options={REGINA_OPTIONS}
            value={draftReginaEsito}
            onSelect={setDraftReginaEsito}
          />
        ) : (
          <VisitStarRating value={draftRating} onChange={setDraftRating} />
        )}

        <button
          type="button"
          className="visit-telai-form__add"
          disabled={!canAdd}
          onClick={handleAddTelaio}
        >
          Aggiungi telaio
        </button>
      </div>
    </VisitStep>
  )
}
