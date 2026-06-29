import { useCallback, useMemo, useState } from 'react'
import {
  createTelainoInspection,
  emptyIspezioneWizardState,
  ISPEZIONE_WIZARD_STEPS,
  ISPEZIONE_WIZARD_TOTAL_STEPS,
  isIspezioneReadyToSave,
  isTelainoComplete,
  isVassoioComplete,
  type IspezioneWizardState,
  type TelainoInspection,
  type VassoioAntivarroa,
} from '../types/ispezioneWizard.types'

export function useIspezioneWizard() {
  const [stepIndex, setStepIndex] = useState(0)
  const [state, setState] = useState<IspezioneWizardState>(emptyIspezioneWizardState)

  const step = ISPEZIONE_WIZARD_STEPS[stepIndex]
  const isFirst = stepIndex === 0
  const isLast = stepIndex === ISPEZIONE_WIZARD_TOTAL_STEPS - 1

  const patchState = useCallback((patch: Partial<IspezioneWizardState>) => {
    setState((prev) => ({ ...prev, ...patch }))
  }, [])

  const patchVassoio = useCallback((patch: Partial<VassoioAntivarroa>) => {
    setState((prev) => ({ ...prev, vassoio: { ...prev.vassoio, ...patch } }))
  }, [])

  const updateTelaino = useCallback((id: string, patch: Partial<TelainoInspection>) => {
    setState((prev) => ({
      ...prev,
      telai: prev.telai.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }))
  }, [])

  const addTelaino = useCallback(() => {
    setState((prev) => {
      const nextNumero = prev.telai.length + 1
      return { ...prev, telai: [...prev.telai, createTelainoInspection(nextNumero)] }
    })
  }, [])

  const removeTelaino = useCallback((id: string) => {
    setState((prev) => {
      if (prev.telai.length <= 1) return prev
      const telai = prev.telai
        .filter((t) => t.id !== id)
        .map((t, index) => ({ ...t, numero: index + 1 }))
      return { ...prev, telai }
    })
  }, [])

  const goNext = useCallback(() => {
    setStepIndex((index) => Math.min(index + 1, ISPEZIONE_WIZARD_TOTAL_STEPS - 1))
  }, [])

  const goPrev = useCallback(() => {
    setStepIndex((index) => Math.max(index - 1, 0))
  }, [])

  const canProceed = useMemo(() => {
    switch (step.id) {
      case 'vassoio':
        return isVassoioComplete(state.vassoio)
      case 'telai':
        return state.telai.some(isTelainoComplete)
      case 'salva':
        return false
      default:
        return false
    }
  }, [step.id, state])

  const readyToSave = useMemo(() => isIspezioneReadyToSave(state), [state])

  const reset = useCallback(() => {
    setStepIndex(0)
    setState(emptyIspezioneWizardState())
  }, [])

  return {
    step,
    stepIndex,
    totalSteps: ISPEZIONE_WIZARD_TOTAL_STEPS,
    state,
    isFirst,
    isLast,
    patchState,
    patchVassoio,
    updateTelaino,
    addTelaino,
    removeTelaino,
    goNext,
    goPrev,
    canProceed,
    readyToSave,
    reset,
  }
}
