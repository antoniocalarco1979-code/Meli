import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  buildVisitaGuidataSteps,
  emptyVisitaGuidataState,
  isVisitaGuidataStepComplete,
  type VisitaGuidataMelario,
  type VisitaGuidataNido,
  type VisitaGuidataState,
  type VisitaGuidataVassoio,
} from '../types/visitaGuidata.types'
import {
  clearVisitaGuidataDraft,
  restoreVisitaGuidataState,
  saveVisitaGuidataDraft,
} from '../services/visitaGuidataStorage'

type UseVisitaGuidataWizardOptions = {
  arniaId: string
  hasMelario: boolean
}

export function useVisitaGuidataWizard({ arniaId, hasMelario }: UseVisitaGuidataWizardOptions) {
  const steps = useMemo(() => buildVisitaGuidataSteps(hasMelario), [hasMelario])
  const [stepIndex, setStepIndex] = useState(0)
  const [state, setState] = useState<VisitaGuidataState>(emptyVisitaGuidataState)

  useEffect(() => {
    const restored = restoreVisitaGuidataState(arniaId)
    setStepIndex(Math.min(restored.stepIndex, steps.length - 1))
    setState(restored.state)
  }, [arniaId, steps.length])

  useEffect(() => {
    saveVisitaGuidataDraft(arniaId, stepIndex, state)
  }, [arniaId, stepIndex, state])

  const step = steps[stepIndex]
  const isFirst = stepIndex === 0
  const isLast = stepIndex === steps.length - 1

  const patchVassoio = useCallback((patch: Partial<VisitaGuidataVassoio>) => {
    setState((prev) => ({ ...prev, vassoio: { ...prev.vassoio, ...patch } }))
  }, [])

  const patchMelario = useCallback((patch: Partial<VisitaGuidataMelario>) => {
    setState((prev) => ({ ...prev, melario: { ...prev.melario, ...patch } }))
  }, [])

  const patchNido = useCallback((patch: Partial<VisitaGuidataNido>) => {
    setState((prev) => ({ ...prev, nido: { ...prev.nido, ...patch } }))
  }, [])

  const goNext = useCallback(() => {
    setStepIndex((index) => Math.min(index + 1, steps.length - 1))
  }, [steps.length])

  const goPrev = useCallback(() => {
    setStepIndex((index) => Math.max(index - 1, 0))
  }, [])

  const canProceed = useMemo(
    () => isVisitaGuidataStepComplete(step.id, state),
    [step.id, state],
  )

  const reset = useCallback(() => {
    setStepIndex(0)
    setState(emptyVisitaGuidataState())
    clearVisitaGuidataDraft(arniaId)
  }, [arniaId])

  return {
    steps,
    step,
    stepIndex,
    totalSteps: steps.length,
    state,
    isFirst,
    isLast,
    canProceed,
    patchVassoio,
    patchMelario,
    patchNido,
    goNext,
    goPrev,
    reset,
  }
}
