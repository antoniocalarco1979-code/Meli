import type { VisitAzioneChoice, VisitWizardState } from '../../types/visitWizard.types'
import { AZIONE_OPTIONS } from '../../types/visitWizard.types'
import { VisitChoiceGrid } from './VisitChoiceGrid'
import { VisitStep } from './VisitStep'

type VisitAzioneStepProps = {
  state: VisitWizardState
  onPatchState: (patch: Partial<VisitWizardState>) => void
}

export function VisitAzioneStep({ state, onPatchState }: VisitAzioneStepProps) {
  const showAltroField = state.azione === 'altro'

  return (
    <VisitStep emoji="⚡" question="Azione">
      <VisitChoiceGrid<VisitAzioneChoice>
        variant="radio"
        columns={false}
        options={AZIONE_OPTIONS}
        value={state.azione}
        onSelect={(value) =>
          onPatchState({
            azione: value,
            azioneAltro: value === 'altro' ? state.azioneAltro : '',
          })
        }
      />

      {showAltroField && (
        <input
          type="text"
          className="visit-field visit-field--single visit-azione__altro"
          placeholder="Descrivi l'azione…"
          value={state.azioneAltro}
          onChange={(e) => onPatchState({ azioneAltro: e.target.value })}
          autoFocus
        />
      )}
    </VisitStep>
  )
}
