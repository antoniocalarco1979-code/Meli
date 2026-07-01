import {
  SI_NO_OPTIONS,
  type VisitaGuidataAffumicatore,
} from '../../types/visitaGuidata.types'
import { VisitChoiceGrid } from '../visit-engine/VisitChoiceGrid'

type GuidataStepFaseAffumicatoreProps = {
  affumicatore: VisitaGuidataAffumicatore
  onPatch: (patch: Partial<VisitaGuidataAffumicatore>) => void
}

export function GuidataStepFaseAffumicatore({
  affumicatore,
  onPatch,
}: GuidataStepFaseAffumicatoreProps) {
  return (
    <div className="ispezione-step visita-guidata-step visita-guidata-step--phase">
      <p className="visita-guidata-phase-badge">Fase 1</p>

      <div className="ispezione-step__question">
        <span className="ispezione-step__emoji" aria-hidden="true">
          💨
        </span>
        <h2 className="ispezione-step__title">Hai utilizzato l&apos;affumicatore?</h2>
      </div>

      <VisitChoiceGrid
        variant="radio"
        columns={false}
        options={SI_NO_OPTIONS}
        value={affumicatore.utilizzato}
        onSelect={(value) => onPatch({ utilizzato: value })}
      />
    </div>
  )
}
