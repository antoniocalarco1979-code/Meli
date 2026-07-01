import { Camera } from 'lucide-react'
import { cameraService } from '../../../../services/device'
import { VASSOIO_VARROA_OPTIONS } from '../../types/ispezioneWizard.types'
import type { VisitaGuidataNido } from '../../types/visitaGuidata.types'
import type { TelainoVisitaRecord } from '../../types/telainoPanel.types'
import {
  areAllTelainiVisitaCompletati,
  countTelainiVisitaCompletati,
} from '../../types/telainoPanel.types'
import { TelainoPanelHost } from '../telaino-panel/TelainoPanelHost'
import { VisitChoiceGrid } from '../visit-engine/VisitChoiceGrid'
import '../telaino-panel/telaino-panel.css'

type GuidataStepNidoProps = {
  nido: VisitaGuidataNido
  frameCount: number
  onPatch: (patch: Partial<VisitaGuidataNido>) => void
  onSaveTelaino: (record: TelainoVisitaRecord) => void
  onGoToInterventi: () => void
  selectedTelainoId?: string | null
  panelOpen?: boolean
  onSelectTelaino?: (id: string) => void
  onClosePanel?: () => void
}

export function GuidataStepNido({
  nido,
  frameCount,
  onPatch,
  onSaveTelaino,
  onGoToInterventi,
  selectedTelainoId,
  panelOpen,
  onSelectTelaino,
  onClosePanel,
}: GuidataStepNidoProps) {
  const handleCapturePhoto = async () => {
    const photo = await cameraService.capturePhoto({ preferRear: true })
    if (photo) onPatch({ foto: photo.path })
  }

  const completati = countTelainiVisitaCompletati(nido.telaini)
  const total = nido.telaini.length || frameCount
  const allComplete = areAllTelainiVisitaCompletati(nido.telaini)

  return (
    <div
      className={`ispezione-step visita-guidata-step visita-nido-step${panelOpen ? ' visita-nido-step--panel-open' : ''}`}
    >
      <div className="ispezione-step__question">
        <span className="ispezione-step__emoji" aria-hidden="true">
          🍯
        </span>
        <h2 className="ispezione-step__title">Controllo Nido</h2>
      </div>

      <p className="ispezione-step__lead">
        Tocca ogni telaino per aprire il pannello laterale. Compila i dati e premi{' '}
        <strong>Salva Telaino</strong> — passerai automaticamente al telaino successivo.
      </p>

      <div className="visita-nido-step__progress" aria-live="polite">
        <span className="visita-nido-step__progress-label">Telaini completati:</span>
        <strong className="visita-nido-step__progress-value">
          {completati} / {total}
        </strong>
      </div>

      <div
        className={`visita-nido-step__panel-stage${panelOpen ? ' visita-nido-step__panel-stage--open' : ''}`}
      >
        <TelainoPanelHost
          telaini={nido.telaini}
          onSaveTelaino={onSaveTelaino}
          selectedTelainoId={selectedTelainoId}
          panelOpen={panelOpen}
          onSelectTelaino={onSelectTelaino}
          onClosePanel={onClosePanel}
          layout="nido-2d"
        />
      </div>

      {allComplete ? (
        <div className="visita-nido-step__complete meli-glass meli-glass--deep">
          <p className="visita-nido-step__complete-text">
            Tutti i telaini del nido sono stati controllati.
          </p>
          <button type="button" className="visita-nido-step__complete-btn" onClick={onGoToInterventi}>
            VAI AGLI INTERVENTI
          </button>
        </div>
      ) : null}

      <div className="ispezione-field">
        <p className="ispezione-field__label">Varroa vassoio (opzionale)</p>
        <VisitChoiceGrid
          variant="radio"
          columns={false}
          options={VASSOIO_VARROA_OPTIONS}
          value={nido.varroaPresente}
          onSelect={(value) => onPatch({ varroaPresente: value })}
        />
      </div>

      <div className="ispezione-field">
        <p className="ispezione-field__label">Foto nido</p>
        <button type="button" className="visit-foto__capture visita-guidata-action" onClick={handleCapturePhoto}>
          <Camera size={28} strokeWidth={1.5} aria-hidden="true" />
          Scatta foto
        </button>
        {nido.foto && <img src={nido.foto} alt="Nido" className="visit-foto__preview" />}
      </div>

      <div className="ispezione-field">
        <p className="ispezione-field__label">Note nido</p>
        <textarea
          className="ispezione-note__field"
          rows={3}
          placeholder="Osservazioni generali sul nido…"
          value={nido.note}
          onChange={(e) => onPatch({ note: e.target.value })}
        />
      </div>
    </div>
  )
}
