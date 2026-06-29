import { Camera } from 'lucide-react'
import type { VisitWizardStepDef } from '../../types/visitWizard.types'
import {
  FORZA_OPTIONS,
  MELARIO_OPTIONS,
  OPERCOLATURA_OPTIONS,
  SCORTE_OPTIONS,
  type VisitForzaChoice,
  type VisitOpercolaturaChoice,
  type VisitScorteChoice,
  type VisitWizardState,
} from '../../types/visitWizard.types'
import { VisitAzioneStep } from './VisitAzioneStep'
import { VisitChoiceGrid } from './VisitChoiceGrid'
import { VisitStep } from './VisitStep'
import { VisitSummary } from './VisitSummary'
import { VisitTelaiStep } from './VisitTelaiStep'

type VisitStepContentProps = {
  step: VisitWizardStepDef
  state: VisitWizardState
  saving: boolean
  onCapturePhoto: () => void
  onGoNext: () => void
  onPatchState: (patch: Partial<VisitWizardState>) => void
  onSelectAndAdvance: (patch: Partial<VisitWizardState>) => void
  onSave: () => void
}

function ProceedStep({
  step,
  onGoNext,
}: {
  step: VisitWizardStepDef
  onGoNext: () => void
}) {
  return (
    <VisitStep emoji={step.emoji} question={step.question} hint={step.hint}>
      <button type="button" className="visit-step__proceed" onClick={onGoNext}>
        Continua
      </button>
    </VisitStep>
  )
}

export function VisitStepContent({
  step,
  state,
  saving,
  onCapturePhoto,
  onGoNext,
  onPatchState,
  onSelectAndAdvance,
  onSave,
}: VisitStepContentProps) {
  switch (step.id) {
    case 'arrivo':
    case 'mi_vesto':
    case 'affumicatore':
    case 'attrezzatura':
    case 'apro_arnia':
    case 'estraggo_telaio':
      return <ProceedStep step={step} onGoNext={onGoNext} />

    case 'ispezione_telai':
      return <VisitTelaiStep state={state} onPatchState={onPatchState} />

    case 'scorte':
      return (
        <VisitStep emoji={step.emoji} question={step.question}>
          <VisitChoiceGrid<VisitScorteChoice>
            variant="radio"
            columns={false}
            options={SCORTE_OPTIONS}
            value={state.scorte}
            onSelect={(value) => onSelectAndAdvance({ scorte: value })}
          />
        </VisitStep>
      )

    case 'forza':
      return (
        <VisitStep emoji={step.emoji} question={step.question}>
          <VisitChoiceGrid<VisitForzaChoice>
            options={FORZA_OPTIONS}
            value={state.forza}
            onSelect={(value) => onSelectAndAdvance({ forza: value })}
          />
        </VisitStep>
      )

    case 'melario':
      return (
        <VisitStep emoji={step.emoji} question={step.question}>
          <VisitChoiceGrid<'yes' | 'no'>
            options={MELARIO_OPTIONS}
            value={state.haMelario === true ? 'yes' : state.haMelario === false ? 'no' : null}
            onSelect={(value) =>
              onSelectAndAdvance({
                haMelario: value === 'yes',
                opercolatura: value === 'yes' ? state.opercolatura : null,
              })
            }
          />
        </VisitStep>
      )

    case 'opercolatura':
      return (
        <VisitStep emoji={step.emoji} question={step.question}>
          <VisitChoiceGrid<VisitOpercolaturaChoice>
            variant="checkbox"
            columns={false}
            options={OPERCOLATURA_OPTIONS}
            value={state.opercolatura}
            onSelect={(value) => onSelectAndAdvance({ opercolatura: value })}
          />
        </VisitStep>
      )

    case 'azione':
      return <VisitAzioneStep state={state} onPatchState={onPatchState} />

    case 'decisioni':
      return (
        <VisitStep emoji={step.emoji} question={step.question} hint={step.hint}>
          <textarea
            className="visit-field"
            placeholder="Decisioni e osservazioni sul campo…"
            value={state.note}
            onChange={(e) => onPatchState({ note: e.target.value })}
            rows={4}
          />
          <button type="button" className="visit-foto__capture visit-foto__capture--compact" onClick={onCapturePhoto}>
            <Camera size={28} strokeWidth={1.5} aria-hidden="true" />
            Scatta foto
          </button>
          {state.photos[0] && (
            <img src={state.photos[0]} alt="Anteprima telaio" className="visit-foto__preview" />
          )}
        </VisitStep>
      )

    case 'salva':
      return (
        <VisitStep emoji={step.emoji} question={step.question} hint="Salva e passa all'arnia successiva">
          <VisitSummary state={state} saving={saving} onSave={onSave} />
        </VisitStep>
      )

    default:
      return null
  }
}
