import { Camera } from 'lucide-react'
import type { ReactNode } from 'react'
import { cameraService } from '../../../../services/device'
import { VASSOIO_VARROA_OPTIONS } from '../../types/ispezioneWizard.types'
import type { VisitaGuidataVassoio } from '../../types/visitaGuidata.types'
import { VisitChoiceGrid } from '../visit-engine/VisitChoiceGrid'

type GuidataStepVassoioProps = {
  vassoio: VisitaGuidataVassoio
  onPatch: (patch: Partial<VisitaGuidataVassoio>) => void
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <p className="ispezione-field__label">{children}</p>
}

export function GuidataStepVassoio({ vassoio, onPatch }: GuidataStepVassoioProps) {
  const handleCapturePhoto = async () => {
    const photo = await cameraService.capturePhoto({ preferRear: true })
    if (photo) onPatch({ foto: photo.path })
  }

  return (
    <div className="ispezione-step ispezione-step--vassoio">
      <div className="ispezione-step__question">
        <span className="ispezione-step__emoji" aria-hidden="true">
          📋
        </span>
        <h2 className="ispezione-step__title">Controllo Vassoio</h2>
      </div>
      <p className="ispezione-step__lead">
        Controlla il vassoio antivarroa prima di passare al resto della visita.
      </p>

      <div className="ispezione-field">
        <FieldLabel>Varroa presente</FieldLabel>
        <VisitChoiceGrid
          variant="radio"
          columns={false}
          options={VASSOIO_VARROA_OPTIONS}
          value={vassoio.varroaPresente}
          onSelect={(value) => onPatch({ varroaPresente: value })}
        />
      </div>

      <div className="ispezione-field">
        <FieldLabel>Foto vassoio</FieldLabel>
        <button type="button" className="visit-foto__capture" onClick={handleCapturePhoto}>
          <Camera size={28} strokeWidth={1.5} aria-hidden="true" />
          Scatta foto
        </button>
        {vassoio.foto && (
          <img src={vassoio.foto} alt="Vassoio antivarroa" className="visit-foto__preview" />
        )}
      </div>

      <div className="ispezione-field">
        <FieldLabel>Note vassoio</FieldLabel>
        <textarea
          className="ispezione-note__field"
          rows={3}
          placeholder="Osservazioni sul vassoio…"
          value={vassoio.note}
          onChange={(e) => onPatch({ note: e.target.value })}
        />
      </div>
    </div>
  )
}
