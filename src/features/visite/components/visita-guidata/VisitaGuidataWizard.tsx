import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { parseDexieError } from '../../../../database/errors'
import { useToast } from '../../../../hooks/useToast'
import { useVisitaGuidataWizard } from '../../hooks/useVisitaGuidataWizard'
import { clearVisitaGuidataDraft } from '../../services/visitaGuidataStorage'
import { saveVisitaGuidata } from '../../services/visitaGuidataSaveService'
import type { VisitaSaveSummary } from '../../types/visitSave.types'
import { GuidataStepMelario } from './GuidataStepMelario'
import { GuidataStepNido } from './GuidataStepNido'
import { GuidataStepSalva } from './GuidataStepSalva'
import { GuidataStepVassoio } from './GuidataStepVassoio'
import { VisitaGuidataFooter } from './VisitaGuidataFooter'
import { VisitaGuidataHeader } from './VisitaGuidataHeader'
import '../ispezione-engine/ispezione-engine.css'
import '../visit-engine/visit-engine.css'
import './visita-guidata.css'

export type VisitaGuidataWizardProps = {
  arniaId: string
  arniaNumero: string
  apiarioNome?: string
  hasMelario: boolean
  giroProgress?: {
    current: number
    total: number
    apiarioNome: string
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
  hasMelario,
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
    isFirst,
    isLast,
    canProceed,
    patchVassoio,
    patchMelario,
    patchNido,
    goNext,
    goPrev,
  } = useVisitaGuidataWizard({ arniaId, hasMelario })

  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

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
    if (saving) return

    setSaving(true)
    setSaveError('')

    try {
      const summary = await saveVisitaGuidata(arniaId, state, hasMelario)
      clearVisitaGuidataDraft(arniaId)
      toast.success('Visita salvata ✔ — dati aggiornati', 1100)
      window.setTimeout(async () => {
        await onSaved?.(summary)
      }, 1100)
    } catch (err) {
      setSaveError(parseDexieError(err))
      setSaving(false)
    }
  }

  const renderStep = () => {
    switch (step.id) {
      case 'vassoio':
        return <GuidataStepVassoio vassoio={state.vassoio} onPatch={patchVassoio} />
      case 'melario':
        return <GuidataStepMelario melario={state.melario} onPatch={patchMelario} />
      case 'nido':
        return <GuidataStepNido nido={state.nido} onPatch={patchNido} />
      case 'salva':
        return (
          <GuidataStepSalva
            state={state}
            hasMelario={hasMelario}
            saving={saving}
            onSave={handleSave}
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
        apiarioNome={apiarioNome}
        giroProgress={giroProgress}
        onClose={onClose}
      />

      <div className="ispezione-engine__divider" aria-hidden="true" />

      <div className="ispezione-engine__body">
        {saveError && <p className="ispezione-engine__error">{saveError}</p>}
        <AnimatePresence mode="wait">
          <motion.div key={step.id} className="ispezione-engine__stage" {...stepMotion}>
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      <VisitaGuidataFooter
        stepIndex={stepIndex}
        totalSteps={totalSteps}
        stepLabel={step.label}
        canProceed={canProceed}
        showBack={!isFirst}
        showNext={!isLast}
        onBack={goPrev}
        onNext={handleNext}
      />
    </div>
  )
}
