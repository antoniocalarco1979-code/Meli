import type { ReactNode } from 'react'
import {
  ESCLUDI_REGINA_OPTIONS,
  type VisitaGuidataEscludiRegina,
} from '../../types/visitaGuidata.types'
import { VisitChoiceGrid } from '../visit-engine/VisitChoiceGrid'

type GuidataStepEscludiReginaProps = {
  escludiRegina: VisitaGuidataEscludiRegina
  onPatch: (patch: Partial<VisitaGuidataEscludiRegina>) => void
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <p className="ispezione-field__label">{children}</p>
}

export function GuidataStepEscludiRegina({ escludiRegina, onPatch }: GuidataStepEscludiReginaProps) {
  return (
    <div className="ispezione-step visita-guidata-step">
      <div className="ispezione-step__question">
        <span className="ispezione-step__emoji" aria-hidden="true">
          🚧
        </span>
        <h2 className="ispezione-step__title">Escludi regina</h2>
      </div>

      <p className="ispezione-step__lead">
        Registra lo stato dell&apos;escludi regina prima del controllo nido.
      </p>

      <div className="ispezione-field">
        <FieldLabel>Situazione escludi</FieldLabel>
        <VisitChoiceGrid
          variant="radio"
          columns={false}
          options={ESCLUDI_REGINA_OPTIONS}
          value={escludiRegina.azione}
          onSelect={(value) => onPatch({ azione: value })}
        />
      </div>

      <div className="ispezione-field">
        <FieldLabel>Note (opzionale)</FieldLabel>
        <textarea
          className="ispezione-note__field"
          rows={2}
          placeholder="Osservazioni sull'escludi…"
          value={escludiRegina.note}
          onChange={(e) => onPatch({ note: e.target.value })}
        />
      </div>
    </div>
  )
}
