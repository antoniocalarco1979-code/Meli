import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Arnia } from '../../../database/types'
import type { TelainoVisitaRecord } from '../../visite/types/telainoPanel.types'
import {
  frameIdFromTelainoId,
  telainoIdFromFrameId,
} from '../../visite/types/telainoPanel.types'
import { TelainoPanel } from '../../visite/components/telaino-panel/TelainoPanel'
import { useTelainoPanelSelection } from '../../visite/hooks/useTelainoPanelSelection'
import { useGemelloDigitaleInteraction } from '../hooks/useGemelloDigitaleInteraction'
import { createSimulatedGemelloModel } from '../services/createSimulatedGemelloModel'
import { ArniaStackScene } from './ArniaStackScene'
import { GemelloDigitale3DView } from './GemelloDigitale3DView'
import { GemelloSidePanel } from './GemelloSidePanel'
import { NidoTelainiView } from './NidoTelainiView'
import '../styles/gemello-digitale.css'
import '../styles/gemello-3d.css'
import '../../visite/components/telaino-panel/telaino-panel.css'

type GemelloViewMode = '2d' | '3d'

type GemelloDigitaleViewProps = {
  arnia: Arnia
  visitTelaini?: TelainoVisitaRecord[]
  onSaveTelaino?: (record: TelainoVisitaRecord) => void
}

export function GemelloDigitaleView({
  arnia,
  visitTelaini,
  onSaveTelaino,
}: GemelloDigitaleViewProps) {
  const [displayMode, setDisplayMode] = useState<GemelloViewMode>('3d')
  const model = useMemo(() => createSimulatedGemelloModel(arnia), [arnia])
  const interaction = useGemelloDigitaleInteraction(model)
  const visitPanel = useTelainoPanelSelection({ telaini: visitTelaini ?? [] })
  const visitMode = Boolean(visitTelaini && onSaveTelaino)

  const handleTelainoClick = ({ telaino }: { telaino: { id: string; numero: number } }) => {
    if (visitMode) {
      visitPanel.openTelainoByNumero(telaino.numero)
      return
    }
    const full = model.nido.telaini.find((item) => item.id === telaino.id)
    if (full) interaction.handleTelainoClick(full)
  }

  return (
    <motion.section
      className="gemello-digitale meli-glass meli-glass--deep"
      aria-labelledby="gemello-digitale-title"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <header className="gemello-digitale__header">
        <div>
          <p className="gemello-digitale__kicker">Gemello digitale</p>
          <h2 id="gemello-digitale-title" className="gemello-digitale__title">
            Arnia {model.arniaNumero}
          </h2>
        </div>
        <span className="gemello-digitale__badge">
          {displayMode === '3d' ? 'DG-01' : 'v1'}
        </span>
      </header>

      <div className="gemello-digitale__mode-tabs" role="tablist" aria-label="Vista gemello">
        <button
          type="button"
          role="tab"
          aria-selected={displayMode === '3d'}
          className={`gemello-digitale__mode-tab${displayMode === '3d' ? ' gemello-digitale__mode-tab--active' : ''}`}
          onClick={() => setDisplayMode('3d')}
        >
          🧊 Vista 3D
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={displayMode === '2d'}
          className={`gemello-digitale__mode-tab${displayMode === '2d' ? ' gemello-digitale__mode-tab--active' : ''}`}
          onClick={() => setDisplayMode('2d')}
        >
          📐 Vista schematica
        </button>
      </div>

      <AnimatePresence mode="wait">
        {displayMode === '3d' ? (
          <motion.div
            key="gemello-3d"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <GemelloDigitale3DView
              arnia={arnia}
              selectedFrameId={
                visitPanel.selectedTelainoId
                  ? frameIdFromTelainoId(visitPanel.selectedTelainoId)
                  : null
              }
              onFrameSelect={(frameId) => {
                const telainoId = frameId ? telainoIdFromFrameId(frameId) : null
                if (telainoId && visitMode) visitPanel.openTelaino(telainoId)
              }}
            />
            {visitMode && (
              <TelainoPanel
                open={visitPanel.panelOpen}
                telaino={visitPanel.selectedTelaino}
                onClose={visitPanel.closePanel}
                onSave={(record) => {
                  onSaveTelaino?.(record)
                  visitPanel.closePanel()
                }}
                closeOnSave
              />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="gemello-2d"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {!interaction.escludiReginaVisible && (
              <button
                type="button"
                className="gemello-digitale__restore"
                onClick={interaction.restoreEscludiRegina}
              >
                Ripristina escludi regina
              </button>
            )}

            <div
              className={`gemello-digitale__stage${(interaction.panelOpen || visitPanel.panelOpen) ? ' gemello-digitale__stage--panel-open' : ''}`}
            >
              <div className="gemello-digitale__viewport">
                {interaction.view === 'stack' ? (
                  <ArniaStackScene
                    model={model}
                    liftedMelarioIds={interaction.liftedMelarioIds}
                    escludiReginaVisible={interaction.escludiReginaVisible}
                    selectedMelarioId={interaction.selectedMelarioId}
                    onMelarioClick={({ melario }) => interaction.handleMelarioClick(melario)}
                    onEscludiReginaRemove={interaction.handleEscludiReginaClick}
                    onNidoClick={() => interaction.handleNidoClick()}
                  />
                ) : (
                  <NidoTelainiView
                    telaini={model.nido.telaini}
                    selectedTelainoId={
                      visitMode ? visitPanel.selectedTelainoId : interaction.selectedTelainoId
                    }
                    onTelainoClick={handleTelainoClick}
                    onBack={interaction.backToStack}
                  />
                )}
              </div>

              {visitMode ? (
                <TelainoPanel
                  open={visitPanel.panelOpen}
                  telaino={visitPanel.selectedTelaino}
                  onClose={visitPanel.closePanel}
                  onSave={(record) => {
                  onSaveTelaino?.(record)
                  visitPanel.closePanel()
                }}
                closeOnSave
                />
              ) : (
                <GemelloSidePanel
                  open={interaction.panelOpen}
                  target={interaction.panelTarget}
                  telaino={interaction.selectedTelaino}
                  melario={interaction.selectedMelario}
                  onClose={interaction.closePanel}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}
