import {
  SI_NO_OPTIONS,
  type VisitaGuidataMelario,
} from '../../types/visitaGuidata.types'
import { VisitChoiceGrid } from '../visit-engine/VisitChoiceGrid'

type GuidataStepFaseMelarioProps = {
  melario: VisitaGuidataMelario
  onPatch: (patch: Partial<VisitaGuidataMelario>) => void
}

export function GuidataStepFaseMelario({ melario, onPatch }: GuidataStepFaseMelarioProps) {
  return (
    <div className="ispezione-step visita-guidata-step visita-guidata-step--phase">
      <p className="visita-guidata-phase-badge">Fase 2</p>

      <div className="ispezione-step__question">
        <span className="ispezione-step__emoji" aria-hidden="true">
          🍯
        </span>
        <h2 className="ispezione-step__title">È presente un melario?</h2>
      </div>

      <VisitChoiceGrid
        variant="radio"
        columns={false}
        options={SI_NO_OPTIONS}
        value={melario.presente}
        onSelect={(value) => onPatch({ presente: value })}
      />
    </div>
  )
}
