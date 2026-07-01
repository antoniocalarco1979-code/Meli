import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { parseDexieError } from '../../../../database/errors'
import { useToast } from '../../../../hooks/useToast'
import { DADANT_BLATT_10 } from '../../../gemello-digitale/DigitalTwin/constants/dadantBlatt10'
import { useTelainoPanelSelection } from '../../hooks/useTelainoPanelSelection'
import { useVisitaGuidataWizard } from '../../hooks/useVisitaGuidataWizard'
import { clearVisitaGuidataDraft } from '../../services/visitaGuidataStorage'
import { saveVisitaGuidata } from '../../services/visitaGuidataSaveService'
import type { TelainoVisitaRecord } from '../../types/telainoPanel.types'
import { getTelainoVisitaSuccessivo } from '../../types/telainoPanel.types'
import type { VisitaSaveSummary } from '../../types/visitSave.types'
import { GuidataStepEscludiRegina } from './GuidataStepEscludiRegina'
import { GuidataStepFaseAffumicatore } from './GuidataStepFaseAffumicatore'
import { GuidataStepFaseMelario } from './GuidataStepFaseMelario'
import { GuidataStepInterventi } from './GuidataStepInterventi'
import { GuidataStepIntro } from './GuidataStepIntro'
import { GuidataStepNido } from './GuidataStepNido'
import { GuidataStepRiepilogo } from './GuidataStepRiepilogo'
import { GiroSessionHud } from '../giro/GiroSessionHud'
import { VisitaGuidataFooter } from './VisitaGuidataFooter'
import { VisitaGuidataHeader } from './VisitaGuidataHeader'
import '../ispezione-engine/ispezione-engine.css'
import '../visit-engine/visit-engine.css'
import '../telaino-panel/telaino-panel.css'
import './visita-guidata.css'

export type VisitaGuidataWizardProps = {
  arniaId: string
  arniaNumero: string
  apiarioNome?: string
  meteo?: string
  startNewSession?: boolean
  frameCount?: number
  hasMelario?: boolean
  isGiroActive?: boolean
  giroProgress?: {
    current: number
    total: number
    apiarioNome: string
    startedAt: number
  }
  onClose: () => void
  onSaved?: (summary: VisitaSaveSummary) => void | Promise<void>
}

const stepMotion = {
  initial: { opacity: 0, x: 32 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -32 },
  transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const },
}

export function VisitaGuidataWizard({
  arniaId,
  arniaNumero,
  apiarioNome,
  meteo,
  startNewSession,
  frameCount = DADANT_BLATT_10.frameCount,
  isGiroActive = false,
  giroProgress,
  onClose,
  onSaved,
}: VisitaGuidataWizardProps) {
  const toast = useToast()
  const {
    step,
    stepIndex,
    totalSteps,
    state,
    isLast,
    canProceed,
    hideFooterNext,
    hideFooterBack,
    patchAffumicatore,
    patchEscludiRegina,
    patchNido,
    saveTelaino,
    toggleIntervento,
    patchIntervento,
    patchReginaPayload,
    patchTrattamentoPayload,
    patchMelario,
    startControllo,
    goNext,
    goPrev,
  } = useVisitaGuidataWizard({ arniaId, startNewSession, meteo, frameCount })

  const telainoPanel = useTelainoPanelSelection({ telaini: state.nido.telaini })

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')
  const saveSummaryRef = useRef<VisitaSaveSummary | null>(null)

  const handleSaveTelaino = useCallback(
    (record: TelainoVisitaRecord) => {
      saveTelaino(record)

      const nextTelaino = getTelainoVisitaSuccessivo(state.nido.telaini, record.numero)
      if (nextTelaino) {
        telainoPanel.openTelaino(nextTelaino.id)
      } else {
        telainoPanel.closePanel()
      }
    },
    [saveTelaino, state.nido.telaini, telainoPanel],
  )

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const handleNext = () => {
    if (!canProceed) return
    goNext()
  }

  const handleSave = async () => {
    if (saving || saved) return

    setSaving(true)
    setSaveError('')

    try {
      const summary = await saveVisitaGuidata(arniaId, state)
      clearVisitaGuidataDraft(arniaId)
      saveSummaryRef.current = summary
      setSaved(true)
      toast.success('Visita salvata con successo', 2200)
    } catch (err) {
      setSaveError(parseDexieError(err))
    } finally {
      setSaving(false)
    }
  }

  const handleContinueAfterSave = async () => {
    const summary = saveSummaryRef.current
    if (summary) {
      await onSaved?.(summary)
    } else {
      onClose()
    }
  }

  const showFooters = !saved

  const renderStep = () => {
    if (!state.startedAt) return null

    switch (step.id) {
      case 'intro':
        return (
          <GuidataStepIntro
            arniaNumero={arniaNumero}
            startedAt={state.startedAt}
            meteo={state.meteo}
            onStartControllo={startControllo}
          />
        )
      case 'fase-affumicatore':
        return (
          <GuidataStepFaseAffumicatore
            affumicatore={state.affumicatore}
            onPatch={patchAffumicatore}
          />
        )
      case 'fase-melario':
        return <GuidataStepFaseMelario melario={state.melario} onPatch={patchMelario} />
      case 'escludi-regina':
        return (
          <GuidataStepEscludiRegina escludiRegina={state.escludiRegina} onPatch={patchEscludiRegina} />
        )
      case 'nido':
        return (
          <GuidataStepNido
            nido={state.nido}
            frameCount={frameCount}
            onPatch={patchNido}
            onSaveTelaino={handleSaveTelaino}
            onGoToInterventi={goNext}
            selectedTelainoId={telainoPanel.selectedTelainoId}
            panelOpen={telainoPanel.panelOpen}
            onSelectTelaino={telainoPanel.openTelaino}
            onClosePanel={telainoPanel.closePanel}
          />
        )
      case 'interventi':
        return (
          <GuidataStepInterventi
            interventi={state.interventi}
            onToggle={toggleIntervento}
            onPatchNote={(id, note) => patchIntervento(id, { note })}
            onPatchReginaPayload={patchReginaPayload}
            onPatchTrattamentoPayload={patchTrattamentoPayload}
          />
        )
      case 'riepilogo':
        return (
          <GuidataStepRiepilogo
            arniaNumero={arniaNumero}
            state={state}
            saving={saving}
            saved={saved}
            isGiroActive={isGiroActive}
            onSave={handleSave}
            onContinue={handleContinueAfterSave}
          />
        )
      default:
        return null
    }
  }

  return (
    <div
      className="ispezione-engine"
      role="dialog"
      aria-modal="true"
      aria-label={`Visita guidata arnia ${arniaNumero}`}
    >
      <VisitaGuidataHeader
        arniaNumero={arniaNumero}
        apiarioNome={giroProgress ? undefined : apiarioNome}
        startedAt={state.startedAt}
        onClose={saved ? handleContinueAfterSave : onClose}
      />

      {giroProgress ? (
        <div className="ispezione-engine__giro-hud">
          <GiroSessionHud
            current={giroProgress.current}
            total={giroProgress.total}
            startedAt={giroProgress.startedAt}
            apiarioNome={giroProgress.apiarioNome}
          />
        </div>
      ) : null}

      {showFooters ? (
        <VisitaGuidataFooter
          stepIndex={stepIndex}
          totalSteps={totalSteps}
          stepLabel={step.label}
          canProceed={canProceed}
          showBack={!hideFooterBack}
          showNext={!hideFooterNext && !isLast}
          onBack={goPrev}
          onNext={handleNext}
          variant="top"
        />
      ) : null}

      <div className="ispezione-engine__divider" aria-hidden="true" />

      <div className="ispezione-engine__body">
        {saveError && <p className="ispezione-engine__error">{saveError}</p>}
        <AnimatePresence mode="wait">
          <motion.div key={saved ? 'saved' : step.id} className="ispezione-engine__stage" {...stepMotion}>
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {showFooters ? (
        <VisitaGuidataFooter
          stepIndex={stepIndex}
          totalSteps={totalSteps}
          stepLabel={step.label}
          canProceed={canProceed}
          showBack={!hideFooterBack}
          showNext={!hideFooterNext && !isLast}
          onBack={goPrev}
          onNext={handleNext}
        />
      ) : null}
    </div>
  )
}
