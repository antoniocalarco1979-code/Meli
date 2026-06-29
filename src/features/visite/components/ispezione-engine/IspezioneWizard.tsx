import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { parseDexieError } from '../../../../database/errors'
import { getArniaById } from '../../../../database/services/arnieService'
import { useToast } from '../../../../hooks/useToast'
import { useIspezioneWizard } from '../../hooks/useIspezioneWizard'
import {
  getNextArniaIdInApiario,
  saveIspezioneWizard,
} from '../../services/ispezioneSaveService'
import { IspezioneContinueDialog } from './IspezioneContinueDialog'
import { IspezioneFooter } from './IspezioneFooter'
import { IspezioneHeader } from './IspezioneHeader'
import { IspezioneStepSalva } from './IspezioneStepSalva'
import { IspezioneStepTelai } from './IspezioneStepTelai'
import { IspezioneStepVassoio } from './IspezioneStepVassoio'
import '../visit-engine/visit-engine.css'
import './ispezione-engine.css'

type IspezioneWizardProps = {
  arniaId: string
  apiarioId: string
  arniaNumero: string
  onClose: () => void
}

const stepMotion = {
  initial: { opacity: 0, x: 32 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -32 },
  transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const },
}

export function IspezioneWizard({
  arniaId,
  apiarioId,
  arniaNumero,
  onClose,
}: IspezioneWizardProps) {
  const navigate = useNavigate()
  const toast = useToast()
  const {
    step,
    stepIndex,
    totalSteps,
    state,
    goNext,
    canProceed,
    readyToSave,
    reset,
    initFromArnia,
    patchVassoio,
    updateTelaino,
    addTelaino,
    removeTelaino,
  } = useIspezioneWizard()

  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [continueOpen, setContinueOpen] = useState(false)
  const [nextArniaId, setNextArniaId] = useState<string>()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    void getArniaById(arniaId).then((arnia) => {
      if (arnia?.numeroTelai && arnia.numeroTelai > 0) {
        initFromArnia(arnia.numeroTelai)
      }
    })
  }, [arniaId, initFromArnia])

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleNext = () => {
    if (!canProceed) return
    goNext()
  }

  const finishToArnia = (targetArniaId = arniaId) => {
    setContinueOpen(false)
    reset()
    navigate(`/arnie/${targetArniaId}`, { replace: true })
  }

  const handleSave = async () => {
    if (!readyToSave || saving) return

    setSaving(true)
    setSaveError('')

    try {
      await saveIspezioneWizard(arniaId, state)
      const nextId = await getNextArniaIdInApiario(apiarioId, arniaId)
      setNextArniaId(nextId)
      toast.success('Ispezione salvata con successo.')
      setContinueOpen(true)
    } catch (err) {
      setSaveError(parseDexieError(err))
    } finally {
      setSaving(false)
    }
  }

  const handleContinue = () => {
    if (!nextArniaId) {
      finishToArnia()
      return
    }
    setContinueOpen(false)
    reset()
    navigate(`/arnie/${nextArniaId}/visita`, { replace: true })
  }

  const renderStep = () => {
    switch (step.id) {
      case 'vassoio':
        return <IspezioneStepVassoio vassoio={state.vassoio} onPatch={patchVassoio} />
      case 'telai':
        return (
          <IspezioneStepTelai
            telai={state.telai}
            onUpdate={updateTelaino}
            onAdd={addTelaino}
            onRemove={removeTelaino}
          />
        )
      case 'salva':
        return (
          <IspezioneStepSalva
            state={state}
            saving={saving}
            disabled={!readyToSave}
            onSave={handleSave}
          />
        )
      default:
        return null
    }
  }

  return (
    <>
      <div className="ispezione-engine" role="dialog" aria-modal="true" aria-label="Motore ispezione">
        <IspezioneHeader arniaNumero={arniaNumero} onClose={handleClose} />

        <div className="ispezione-engine__divider" aria-hidden="true" />

        <div className="ispezione-engine__body">
          {saveError && <p className="ispezione-engine__error">{saveError}</p>}
          <AnimatePresence mode="wait">
            <motion.div key={step.id} className="ispezione-engine__stage" {...stepMotion}>
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        <IspezioneFooter
          stepIndex={stepIndex}
          totalSteps={totalSteps}
          canProceed={canProceed}
          showNext={step.id !== 'salva'}
          onNext={handleNext}
        />
      </div>

      <IspezioneContinueDialog
        open={continueOpen}
        hasNextArnia={Boolean(nextArniaId)}
        onContinue={handleContinue}
        onFinish={() => finishToArnia()}
      />
    </>
  )
}
