import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  buildVisitaGuidataSteps,
  emptyVisitaGuidataState,
  isVisitaGuidataStepComplete,
  type VisitaGuidataAffumicatore,
  type VisitaGuidataEscludiRegina,
  type VisitaGuidataMelario,
  type VisitaGuidataNido,
  type VisitaGuidataState,
} from '../types/visitaGuidata.types'
import {
  createTelainiVisitaRecords,
  type TelainoVisitaRecord,
} from '../types/telainoPanel.types'
import {
  createInterventoDraft,
  type VisitaInterventoChecklistId,
  type VisitaInterventoDraft,
} from '../types/visitaInterventi.types'
import type { ReginaInput } from '../../../database/types'
import type { TrattamentoInput } from '../../../database/types'
import {
  beginVisitaGuidataSession,
  restoreVisitaGuidataState,
  saveVisitaGuidataDraft,
} from '../services/visitaGuidataStorage'

type UseVisitaGuidataWizardOptions = {
  arniaId: string
  startNewSession?: boolean
  meteo?: string
  frameCount?: number
}

export function useVisitaGuidataWizard({
  arniaId,
  startNewSession = false,
  meteo,
  frameCount = 10,
}: UseVisitaGuidataWizardOptions) {
  const steps = useMemo(() => buildVisitaGuidataSteps(), [])
  const [stepIndex, setStepIndex] = useState(0)
  const [state, setState] = useState<VisitaGuidataState>(emptyVisitaGuidataState)
  const initializedRef = useRef(false)

  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    if (startNewSession) {
      const session = beginVisitaGuidataSession(arniaId, meteo)
      setStepIndex(session.stepIndex)
      setState(session.state)
      return
    }

    const restored = restoreVisitaGuidataState(arniaId)
    if (restored.state.sessionId) {
      setStepIndex(Math.min(restored.stepIndex, steps.length - 1))
      setState(restored.state)
      return
    }

    const session = beginVisitaGuidataSession(arniaId, meteo)
    setStepIndex(session.stepIndex)
    setState(session.state)
  }, [arniaId, meteo, startNewSession, steps.length])

  useEffect(() => {
    if (frameCount <= 0) return
    setState((prev) => {
      if (prev.nido.telaini.length === frameCount) return prev

      const existing = new Map(prev.nido.telaini.map((item) => [item.numero, item]))
      const telaini = createTelainiVisitaRecords(frameCount).map(
        (item) => existing.get(item.numero) ?? item,
      )

      return {
        ...prev,
        nido: {
          ...prev.nido,
          telaini,
        },
      }
    })
  }, [frameCount])

  useEffect(() => {
    if (!state.sessionId) return
    saveVisitaGuidataDraft(arniaId, stepIndex, state)
  }, [arniaId, stepIndex, state])

  const step = steps[stepIndex]
  const isFirst = stepIndex === 0
  const isLast = stepIndex === steps.length - 1

  const patchAffumicatore = useCallback((patch: Partial<VisitaGuidataAffumicatore>) => {
    setState((prev) => ({ ...prev, affumicatore: { ...prev.affumicatore, ...patch } }))
  }, [])

  const patchMelario = useCallback((patch: Partial<VisitaGuidataMelario>) => {
    setState((prev) => ({ ...prev, melario: { ...prev.melario, ...patch } }))
  }, [])

  const patchEscludiRegina = useCallback((patch: Partial<VisitaGuidataEscludiRegina>) => {
    setState((prev) => ({ ...prev, escludiRegina: { ...prev.escludiRegina, ...patch } }))
  }, [])

  const patchNido = useCallback((patch: Partial<VisitaGuidataNido>) => {
    setState((prev) => ({ ...prev, nido: { ...prev.nido, ...patch } }))
  }, [])

  const saveTelaino = useCallback((record: TelainoVisitaRecord) => {
    setState((prev) => {
      const telaini = prev.nido.telaini.map((item) =>
        item.id === record.id ? record : item,
      )
      const reginaVistaSi = telaini.some((item) => item.regina === 'vista')
      const reginaVistaNo = telaini.some((item) => item.regina === 'non_vista')

      return {
        ...prev,
        nido: {
          ...prev.nido,
          telaini,
          reginaVista: reginaVistaSi ? 'si' : reginaVistaNo ? 'no' : prev.nido.reginaVista,
        },
      }
    })
  }, [])

  const toggleIntervento = useCallback((checklistId: VisitaInterventoChecklistId) => {
    setState((prev) => {
      const existing = prev.interventi.items.find((item) => item.checklistId === checklistId)
      if (existing) {
        return {
          ...prev,
          interventi: {
            items: prev.interventi.items.filter((item) => item.id !== existing.id),
          },
        }
      }
      return {
        ...prev,
        interventi: {
          items: [...prev.interventi.items, createInterventoDraft(checklistId)],
        },
      }
    })
  }, [])

  const patchIntervento = useCallback((id: string, patch: Partial<VisitaInterventoDraft>) => {
    setState((prev) => ({
      ...prev,
      interventi: {
        items: prev.interventi.items.map((item) =>
          item.id === id ? { ...item, ...patch } : item,
        ),
      },
    }))
  }, [])

  const patchReginaPayload = useCallback(
    (id: string, patch: Partial<Omit<ReginaInput, 'arniaId'>>) => {
      setState((prev) => ({
        ...prev,
        interventi: {
          items: prev.interventi.items.map((item) =>
            item.id === id
              ? { ...item, reginaPayload: { ...item.reginaPayload, ...patch } }
              : item,
          ),
        },
      }))
    },
    [],
  )

  const patchTrattamentoPayload = useCallback(
    (id: string, patch: Partial<Omit<TrattamentoInput, 'arniaId' | 'data'>>) => {
      setState((prev) => ({
        ...prev,
        interventi: {
          items: prev.interventi.items.map((item) =>
            item.id === id
              ? { ...item, trattamentoPayload: { ...item.trattamentoPayload, ...patch } }
              : item,
          ),
        },
      }))
    },
    [],
  )

  const goNext = useCallback(() => {
    setStepIndex((index) => Math.min(index + 1, steps.length - 1))
  }, [steps.length])

  const goPrev = useCallback(() => {
    setStepIndex((index) => Math.max(index - 1, 0))
  }, [])

  const startControllo = useCallback(() => {
    goNext()
  }, [goNext])

  const canProceed = useMemo(
    () => isVisitaGuidataStepComplete(step.id, state),
    [step.id, state],
  )

  const hideFooterNext = step.id === 'intro' || step.id === 'riepilogo'
  const hideFooterBack = step.id === 'intro' || step.id === 'fase-affumicatore'

  return {
    steps,
    step,
    stepIndex,
    totalSteps: steps.length,
    state,
    isFirst,
    isLast,
    canProceed,
    hideFooterNext,
    hideFooterBack,
    patchAffumicatore,
    patchMelario,
    patchEscludiRegina,
    patchNido,
    saveTelaino,
    toggleIntervento,
    patchIntervento,
    patchReginaPayload,
    patchTrattamentoPayload,
    startControllo,
    goNext,
    goPrev,
  }
}
