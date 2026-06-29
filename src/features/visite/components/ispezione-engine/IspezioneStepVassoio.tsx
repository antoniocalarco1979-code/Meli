import { Camera } from 'lucide-react'
import type { ReactNode } from 'react'
import { cameraService } from '../../../../services/device'
import {
  VASSOIO_ALTRI_INSETTI_OPTIONS,
  VASSOIO_RESIDUI_CERA_OPTIONS,
  VASSOIO_UMIDITA_SPORCO_OPTIONS,
  VASSOIO_VARROA_OPTIONS,
  type VassoioAntivarroa,
} from '../../types/ispezioneWizard.types'
import { VisitChoiceGrid } from '../visit-engine/VisitChoiceGrid'

type IspezioneStepVassoioProps = {
  vassoio: VassoioAntivarroa
  onPatch: (patch: Partial<VassoioAntivarroa>) => void
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <p className="ispezione-field__label">{children}</p>
}

export function IspezioneStepVassoio({ vassoio, onPatch }: IspezioneStepVassoioProps) {
  const handleCapturePhoto = async () => {
    const photo = await cameraService.capturePhoto({ preferRear: true })
    if (photo) onPatch({ foto: photo.path })
  }

  return (
    <div className="ispezione-step ispezione-step--vassoio">
      <p className="ispezione-step__number">Step 0</p>
      <div className="ispezione-step__question">
        <span className="ispezione-step__emoji" aria-hidden="true">
          📋
        </span>
        <h2 className="ispezione-step__title">Controllo vassoio antivarroa</h2>
      </div>
      <p className="ispezione-step__lead">
        Prima di ispezionare i telaini, controlla il vassoio antivarroa.
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
        <FieldLabel>Numero acari stimato</FieldLabel>
        <input
          type="number"
          min={0}
          inputMode="numeric"
          className="ispezione-field__number"
          placeholder="Es. 5"
          value={vassoio.acariStimati ?? ''}
          onChange={(e) => {
            const raw = e.target.value
            onPatch({ acariStimati: raw === '' ? null : Number.parseInt(raw, 10) })
          }}
        />
      </div>

      <div className="ispezione-field">
        <FieldLabel>Residui di cera</FieldLabel>
        <VisitChoiceGrid
          variant="radio"
          columns={false}
          options={VASSOIO_RESIDUI_CERA_OPTIONS}
          value={vassoio.residuiCera}
          onSelect={(value) => onPatch({ residuiCera: value })}
        />
      </div>

      <div className="ispezione-field">
        <FieldLabel>Presenza altri insetti</FieldLabel>
        <VisitChoiceGrid
          variant="radio"
          columns={false}
          options={VASSOIO_ALTRI_INSETTI_OPTIONS}
          value={vassoio.altriInsetti}
          onSelect={(value) => onPatch({ altriInsetti: value })}
        />
      </div>

      <div className="ispezione-field">
        <FieldLabel>Umidità o sporco</FieldLabel>
        <VisitChoiceGrid
          variant="radio"
          columns={false}
          options={VASSOIO_UMIDITA_SPORCO_OPTIONS}
          value={vassoio.umiditaSporco}
          onSelect={(value) => onPatch({ umiditaSporco: value })}
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
