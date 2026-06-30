import { Camera } from 'lucide-react'
import type { ReactNode } from 'react'
import { cameraService } from '../../../../services/device'
import type { VisitaGuidataMelario } from '../../types/visitaGuidata.types'
import { OPERCOLATURA_OPTIONS } from '../../types/visitWizard.types'
import { VisitChoiceGrid } from '../visit-engine/VisitChoiceGrid'

type GuidataStepMelarioProps = {
  melario: VisitaGuidataMelario
  onPatch: (patch: Partial<VisitaGuidataMelario>) => void
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <p className="ispezione-field__label">{children}</p>
}

export function GuidataStepMelario({ melario, onPatch }: GuidataStepMelarioProps) {
  const handleCapturePhoto = async () => {
    const photo = await cameraService.capturePhoto({ preferRear: true })
    if (photo) onPatch({ foto: photo.path })
  }

  return (
    <div className="ispezione-step">
      <div className="ispezione-step__question">
        <span className="ispezione-step__emoji" aria-hidden="true">
          🍯
        </span>
        <h2 className="ispezione-step__title">Controllo Melario</h2>
      </div>
      <p className="ispezione-step__lead">Registra lo stato del melario prima di controllare il nido.</p>

      <div className="ispezione-field">
        <FieldLabel>Opercolatura</FieldLabel>
        <VisitChoiceGrid
          variant="radio"
          columns={false}
          options={OPERCOLATURA_OPTIONS}
          value={melario.opercolatura}
          onSelect={(value) => onPatch({ opercolatura: value })}
        />
      </div>

      <div className="ispezione-field">
        <FieldLabel>Foto melario</FieldLabel>
        <button type="button" className="visit-foto__capture" onClick={handleCapturePhoto}>
          <Camera size={28} strokeWidth={1.5} aria-hidden="true" />
          Scatta foto
        </button>
        {melario.foto && (
          <img src={melario.foto} alt="Melario" className="visit-foto__preview" />
        )}
      </div>

      <div className="ispezione-field">
        <FieldLabel>Note melario</FieldLabel>
        <textarea
          className="ispezione-note__field"
          rows={3}
          placeholder="Osservazioni sul melario…"
          value={melario.note}
          onChange={(e) => onPatch({ note: e.target.value })}
        />
      </div>
    </div>
  )
}
