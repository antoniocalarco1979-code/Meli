import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  emptyVisitWizardState,
  getActiveWizardSteps,
  type VisitWizardState,
  type VisitWizardStepId,
} from '../types/visitWizard.types'
import { isWizardReadyToSave } from '../services/visitWizardMapper'
import { isTelaiStepComplete } from '../services/visitTelaiMapper'

const SWIPE_POWER_THRESHOLD = 8000
const FIRST_STEP_ID: VisitWizardStepId = 'arrivo'

function swipePower(offset: number, velocity: number): number {
  return Math.abs(offset) * Math.abs(velocity)
}

export function useVisitWizard(open: boolean) {
  const [currentStepId, setCurrentStepId] = useState<VisitWizardStepId>(FIRST_STEP_ID)
  const [state, setState] = useState<VisitWizardState>(emptyVisitWizardState)
  const stateRef = useRef(state)
  stateRef.current = state

  const activeSteps = useMemo(() => getActiveWizardSteps(state), [state.haMelario])
  const stepIndex = Math.max(
    0,
    activeSteps.findIndex((step) => step.id === currentStepId),
  )
  const step = activeSteps[stepIndex] ?? activeSteps[0]
  const totalSteps = activeSteps.length
  const isFirst = stepIndex === 0
  const isLast = stepIndex === totalSteps - 1

  useEffect(() => {
    if (!open) return
    setCurrentStepId(FIRST_STEP_ID)
    setState(emptyVisitWizardState())
  }, [open])

  useEffect(() => {
    if (activeSteps.some((s) => s.id === currentStepId)) return
    setCurrentStepId(activeSteps[Math.min(stepIndex, activeSteps.length - 1)]?.id ?? FIRST_STEP_ID)
  }, [activeSteps, currentStepId, stepIndex])

  const patchState = useCallback((patch: Partial<VisitWizardState>) => {
    setState((prev) => ({ ...prev, ...patch }))
  }, [])

  const goToStep = useCallback(
    (index: number) => {
      const target = activeSteps[Math.max(0, Math.min(index, activeSteps.length - 1))]
      if (target) setCurrentStepId(target.id)
    },
    [activeSteps],
  )

  const goNext = useCallback(() => {
    setCurrentStepId((id) => {
      const steps = getActiveWizardSteps(stateRef.current)
      const idx = steps.findIndex((s) => s.id === id)
      if (idx < 0 || idx >= steps.length - 1) return id
      return steps[idx + 1].id
    })
  }, [])

  const goPrev = useCallback(() => {
    setCurrentStepId((id) => {
      const steps = getActiveWizardSteps(stateRef.current)
      const idx = steps.findIndex((s) => s.id === id)
      if (idx <= 0) return id
      return steps[idx - 1].id
    })
  }, [])

  const selectAndAdvance = useCallback(
    (patch: Partial<VisitWizardState>, delayMs = 180) => {
      setState((prev) => {
        const next = { ...prev, ...patch }
        window.setTimeout(() => {
          setCurrentStepId((id) => {
            const steps = getActiveWizardSteps(next)
            const idx = steps.findIndex((s) => s.id === id)
            if (idx < 0 || idx >= steps.length - 1) return id
            return steps[idx + 1].id
          })
        }, delayMs)
        return next
      })
    },
    [],
  )

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number }; velocity: { x: number } }) => {
      const power = swipePower(info.offset.x, info.velocity.x)
      if (power < SWIPE_POWER_THRESHOLD) return
      if (info.offset.x < 0 && !isLast) goNext()
      if (info.offset.x > 0 && !isFirst) goPrev()
    },
    [goNext, goPrev, isFirst, isLast],
  )

  const canProceedFromStep = (stepId: VisitWizardStepId): boolean => {
    switch (stepId) {
      case 'arrivo':
      case 'mi_vesto':
      case 'affumicatore':
      case 'attrezzatura':
      case 'apro_arnia':
      case 'estraggo_telaio':
      case 'decisioni':
        return true
      case 'ispezione_telai':
        return isTelaiStepComplete(state.telai)
      case 'scorte':
        return state.scorte !== null
      case 'forza':
        return state.forza !== null
      case 'melario':
        return state.haMelario !== null
      case 'opercolatura':
        return state.opercolatura !== null
      case 'azione':
        if (state.azione == null) return false
        if (state.azione === 'altro') return state.azioneAltro.trim().length > 0
        return true
      case 'salva':
        return isWizardReadyToSave(state)
      default:
        return false
    }
  }

  return {
    step,
    stepIndex,
    totalSteps,
    state,
    isFirst,
    isLast,
    patchState,
    goToStep,
    goNext,
    goPrev,
    selectAndAdvance,
    handleDragEnd,
    canProceedFromStep,
    readyToSave: isWizardReadyToSave(state),
  }
}
