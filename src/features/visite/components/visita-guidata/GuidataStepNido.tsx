import { Camera } from 'lucide-react'
import type { ReactNode } from 'react'
import { cameraService } from '../../../../services/device'
import type { VisitaGuidataNido } from '../../types/visitaGuidata.types'

type GuidataStepNidoProps = {
  nido: VisitaGuidataNido
  onPatch: (patch: Partial<VisitaGuidataNido>) => void
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <p className="ispezione-field__label">{children}</p>
}

export function GuidataStepNido({ nido, onPatch }: GuidataStepNidoProps) {
  const handleCapturePhoto = async () => {
    const photo = await cameraService.capturePhoto({ preferRear: true })
    if (photo) onPatch({ foto: photo.path })
  }

  return (
    <div className="ispezione-step">
      <div className="ispezione-step__question">
        <span className="ispezione-step__emoji" aria-hidden="true">
          👑
        </span>
        <h2 className="ispezione-step__title">Controllo Nido</h2>
      </div>
      <p className="ispezione-step__lead">
        Annota le osservazioni sul nido. Il controllo dettagliato dei telaini arriverà in una
        prossima versione.
      </p>

      <div className="ispezione-field">
        <FieldLabel>Foto nido</FieldLabel>
        <button type="button" className="visit-foto__capture" onClick={handleCapturePhoto}>
          <Camera size={28} strokeWidth={1.5} aria-hidden="true" />
          Scatta foto
        </button>
        {nido.foto && <img src={nido.foto} alt="Nido" className="visit-foto__preview" />}
      </div>

      <div className="ispezione-field">
        <FieldLabel>Note nido</FieldLabel>
        <textarea
          className="ispezione-note__field"
          rows={4}
          placeholder="Covata, regina, scorte, problemi…"
          value={nido.note}
          onChange={(e) => onPatch({ note: e.target.value })}
        />
      </div>
    </div>
  )
}
