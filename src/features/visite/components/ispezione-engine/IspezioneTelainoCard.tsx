import { Camera, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { cameraService } from '../../../../services/device'
import {
  TELAINO_API_OPTIONS,
  TELAINO_CELLE_REALI_OPTIONS,
  TELAINO_COVATA_OPTIONS,
  TELAINO_POLLINE_OPTIONS,
  TELAINO_PROBLEMI_OPTIONS,
  TELAINO_REGINA_OPTIONS,
  TELAINO_SCORTE_OPTIONS,
  type TelainoInspection,
} from '../../types/ispezioneWizard.types'
import { VisitChoiceGrid } from '../visit-engine/VisitChoiceGrid'

type IspezioneTelainoCardProps = {
  telaino: TelainoInspection
  canRemove: boolean
  onUpdate: (patch: Partial<TelainoInspection>) => void
  onRemove: () => void
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <p className="ispezione-telaino-card__label">{children}</p>
}

export function IspezioneTelainoCard({
  telaino,
  canRemove,
  onUpdate,
  onRemove,
}: IspezioneTelainoCardProps) {
  const handleCapturePhoto = async () => {
    const photo = await cameraService.capturePhoto({ preferRear: true })
    if (photo) onUpdate({ foto: photo.path })
  }

  return (
    <article className="ispezione-telaino-card">
      <header className="ispezione-telaino-card__header">
        <h3 className="ispezione-telaino-card__title">Telaino {telaino.numero}</h3>
        {canRemove && (
          <button
            type="button"
            className="ispezione-telaino-card__remove"
            onClick={onRemove}
            aria-label={`Rimuovi telaino ${telaino.numero}`}
          >
            <Trash2 size={20} aria-hidden="true" />
          </button>
        )}
      </header>

      <div className="ispezione-telaino-card__field">
        <FieldLabel>Covata</FieldLabel>
        <VisitChoiceGrid
          variant="radio"
          columns={false}
          options={TELAINO_COVATA_OPTIONS}
          value={telaino.covata}
          onSelect={(value) => onUpdate({ covata: value })}
        />
      </div>

      <div className="ispezione-telaino-card__field">
        <FieldLabel>Polline</FieldLabel>
        <VisitChoiceGrid
          variant="radio"
          columns={false}
          options={TELAINO_POLLINE_OPTIONS}
          value={telaino.polline}
          onSelect={(value) => onUpdate({ polline: value })}
        />
      </div>

      <div className="ispezione-telaino-card__field">
        <FieldLabel>Scorte miele</FieldLabel>
        <VisitChoiceGrid
          variant="radio"
          columns={false}
          options={TELAINO_SCORTE_OPTIONS}
          value={telaino.scorteMiele}
          onSelect={(value) => onUpdate({ scorteMiele: value })}
        />
      </div>

      <div className="ispezione-telaino-card__field">
        <FieldLabel>Regina vista</FieldLabel>
        <VisitChoiceGrid
          variant="status"
          columns={false}
          options={TELAINO_REGINA_OPTIONS.map((o) => ({
            ...o,
            icon: o.value === 'si' ? '🟢' : '🔴',
          }))}
          value={telaino.reginaVista}
          onSelect={(value) => onUpdate({ reginaVista: value })}
        />
      </div>

      <div className="ispezione-telaino-card__field">
        <FieldLabel>Celle reali</FieldLabel>
        <VisitChoiceGrid
          variant="radio"
          columns={false}
          options={TELAINO_CELLE_REALI_OPTIONS}
          value={telaino.celleReali}
          onSelect={(value) => onUpdate({ celleReali: value })}
        />
      </div>

      <div className="ispezione-telaino-card__field">
        <FieldLabel>Api presenti</FieldLabel>
        <VisitChoiceGrid
          variant="radio"
          columns={false}
          options={TELAINO_API_OPTIONS}
          value={telaino.apiPresenti}
          onSelect={(value) => onUpdate({ apiPresenti: value })}
        />
      </div>

      <div className="ispezione-telaino-card__field">
        <FieldLabel>Problemi</FieldLabel>
        <VisitChoiceGrid
          variant="radio"
          columns={false}
          options={TELAINO_PROBLEMI_OPTIONS}
          value={telaino.problemi}
          onSelect={(value) => onUpdate({ problemi: value })}
        />
      </div>

      <div className="ispezione-telaino-card__field">
        <FieldLabel>Foto</FieldLabel>
        <button type="button" className="visit-foto__capture visit-foto__capture--compact" onClick={handleCapturePhoto}>
          <Camera size={24} strokeWidth={1.5} aria-hidden="true" />
          Scatta foto
        </button>
        {telaino.foto && (
          <img src={telaino.foto} alt={`Telaino ${telaino.numero}`} className="visit-foto__preview" />
        )}
      </div>

      <div className="ispezione-telaino-card__field">
        <FieldLabel>Note</FieldLabel>
        <textarea
          className="ispezione-note__field"
          rows={2}
          placeholder="Note sul telaino…"
          value={telaino.note}
          onChange={(e) => onUpdate({ note: e.target.value })}
        />
      </div>
    </article>
  )
}
