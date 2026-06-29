import { useCallback, useMemo, useState } from 'react'
import { isModelloPersonalizzato } from '../models/arniaModelli'
import {
  ARNIA_WIZARD_STEPS,
  ARNIA_WIZARD_TOTAL_STEPS,
  emptyArniaWizardState,
  type ArniaWizardState,
  type ArniaWizardStepId,
} from '../types/arniaWizard.types'

function validateStep(stepId: ArniaWizardStepId, state: ArniaWizardState): string | null {
  switch (stepId) {
    case 'tipo': {
      if (isModelloPersonalizzato(state.modelloId)) {
        const telai = Number.parseInt(state.telaiPersonalizzati, 10)
        if (!state.telaiPersonalizzati.trim() || Number.isNaN(telai) || telai < 1) {
          return 'Indica il numero dei telaini (minimo 1).'
        }
      }
      return null
    }
    case 'numero':
      return state.numero.trim() ? null : 'Il numero arnia è obbligatorio.'
    case 'colore':
      return state.coloreId ? null : 'Seleziona un colore per l\'arnia.'
    case 'nome':
    case 'riepilogo':
      return null
    default:
      return null
  }
}

export function useArniaWizard() {
  const [stepIndex, setStepIndex] = useState(0)
  const [state, setState] = useState<ArniaWizardState>(emptyArniaWizardState)
  const [stepError, setStepError] = useState('')

  const step = ARNIA_WIZARD_STEPS[stepIndex]
  const isFirst = stepIndex === 0
  const isLast = stepIndex === ARNIA_WIZARD_TOTAL_STEPS - 1

  const patchState = useCallback((patch: Partial<ArniaWizardState>) => {
    setState((prev) => ({ ...prev, ...patch }))
    setStepError('')
  }, [])

  const goNext = useCallback(() => {
    const error = validateStep(step.id, state)
    if (error) {
      setStepError(error)
      return false
    }
    setStepIndex((index) => Math.min(index + 1, ARNIA_WIZARD_TOTAL_STEPS - 1))
    setStepError('')
    return true
  }, [state, step.id])

  const goPrev = useCallback(() => {
    setStepIndex((index) => Math.max(index - 1, 0))
    setStepError('')
  }, [])

  const reset = useCallback(() => {
    setStepIndex(0)
    setState(emptyArniaWizardState())
    setStepError('')
  }, [])

  const validateAll = useMemo(() => {
    for (const wizardStep of ARNIA_WIZARD_STEPS) {
      if (wizardStep.id === 'riepilogo') continue
      const error = validateStep(wizardStep.id, state)
      if (error) return error
    }
    return null
  }, [state])

  return {
    step,
    stepIndex,
    totalSteps: ARNIA_WIZARD_TOTAL_STEPS,
    state,
    stepError,
    isFirst,
    isLast,
    patchState,
    goNext,
    goPrev,
    reset,
    validateAll,
  }
}
