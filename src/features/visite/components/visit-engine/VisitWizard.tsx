import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { parseDexieError } from '../../../../database/errors'
import { useToast } from '../../../../hooks/useToast'
import { cameraService, DEFAULT_GEO_OPTIONS, gpsService, type GeoCoordinates } from '../../../../services/device'
import type { VisitaSaveSummary } from '../../types/visitSave.types'
import { useVisitWizard } from '../../hooks/useVisitWizard'
import { saveVisitWizard } from '../../services/visitSaveService'
import { VisitHeader } from './VisitHeader'
import { VisitProgress } from './VisitProgress'
import { VisitStepContent } from './VisitStepContent'
import './visit-engine.css'

export type VisitWizardProps = {
  open: boolean
  arniaId: string
  arniaNumero: string
  apiarioNome?: string
  onClose: () => void
  onSaved?: (summary: VisitaSaveSummary) => void
}

const stepMotion = {
  initial: { opacity: 0, x: 48 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -48 },
  transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
}

export function VisitWizard({
  open,
  arniaId,
  arniaNumero,
  apiarioNome,
  onClose,
  onSaved,
}: VisitWizardProps) {
  const {
    step,
    stepIndex,
    totalSteps,
    state,
    isFirst,
    patchState,
    goNext,
    goPrev,
    selectAndAdvance,
    handleDragEnd,
    canProceedFromStep,
    readyToSave,
  } = useVisitWizard(open)

  const [gps, setGps] = useState<GeoCoordinates | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const toast = useToast()

  useEffect(() => {
    if (!open) return
    setError('')
    setSaving(false)
    void gpsService.getCurrentPosition(DEFAULT_GEO_OPTIONS).then(setGps)
  }, [open])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  const handleClose = () => {
    setError('')
    onClose()
  }

  const handleCapturePhoto = async () => {
    const photo = await cameraService.capturePhoto({ preferRear: true })
    if (photo) {
      patchState({ photos: [photo.path] })
    }
  }

  const handleSave = async () => {
    if (!readyToSave) return
    setSaving(true)
    setError('')
    try {
      const summary = await saveVisitWizard({
        arniaId,
        wizard: state,
        gps,
      })
      toast.success('Visita salvata ✔ — dati aggiornati', 1100)
      window.setTimeout(() => {
        onSaved?.(summary)
        onClose()
      }, 1100)
    } catch (err) {
      setError(parseDexieError(err))
      setSaving(false)
    }
  }

  const showFooter = step.id === 'azione' || step.id === 'decisioni' || step.id === 'ispezione_telai'

  return (
    <>
      <div className="visit-engine" role="dialog" aria-modal="true" aria-label={`Visita arnia ${arniaNumero}`}>
        <VisitHeader arniaNumero={arniaNumero} apiarioNome={apiarioNome} onClose={handleClose} />
        <VisitProgress currentIndex={stepIndex} totalSteps={totalSteps} stepLabel={step.label} />

        {error && <p className="visit-engine__error">{error}</p>}

        <div className="visit-engine__body">
          <AnimatePresence mode="wait" custom={stepIndex}>
            <motion.div
              key={step.id}
              className="visit-engine__stage"
              custom={stepIndex}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
              {...stepMotion}
            >
              <VisitStepContent
                step={step}
                state={state}
                saving={saving}
                onCapturePhoto={handleCapturePhoto}
                onGoNext={goNext}
                onPatchState={patchState}
                onSelectAndAdvance={selectAndAdvance}
                onSave={handleSave}
              />
            </motion.div>
          </AnimatePresence>

          {showFooter && (
            <div className="visit-engine__footer">
              {!isFirst && (
                <button type="button" className="visit-engine__nav-btn visit-engine__nav-btn--ghost" onClick={goPrev}>
                  Indietro
                </button>
              )}
              <button
                type="button"
                className="visit-engine__nav-btn visit-engine__nav-btn--primary"
                onClick={goNext}
                disabled={!canProceedFromStep(step.id)}
              >
                Avanti
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
