import type { VisitOpercolaturaChoice } from './visitWizard.types'
import type { VassoioVarroaChoice } from './ispezioneWizard.types'

export type VisitaGuidataStepId = 'vassoio' | 'melario' | 'nido' | 'salva'

export type VisitaGuidataStepDef = {
  id: VisitaGuidataStepId
  title: string
  label: string
}

export type VisitaGuidataVassoio = {
  varroaPresente: VassoioVarroaChoice | null
  note: string
  foto?: string
}

export type VisitaGuidataMelario = {
  opercolatura: VisitOpercolaturaChoice | null
  note: string
  foto?: string
}

export type VisitaGuidataNido = {
  note: string
  foto?: string
}

export type VisitaGuidataState = {
  vassoio: VisitaGuidataVassoio
  melario: VisitaGuidataMelario
  nido: VisitaGuidataNido
}

export type VisitaGuidataDraft = {
  stepIndex: number
  state: VisitaGuidataState
  updatedAt: number
}

export function emptyVisitaGuidataState(): VisitaGuidataState {
  return {
    vassoio: { varroaPresente: null, note: '' },
    melario: { opercolatura: null, note: '' },
    nido: { note: '' },
  }
}

export function buildVisitaGuidataSteps(hasMelario: boolean): VisitaGuidataStepDef[] {
  const steps: VisitaGuidataStepDef[] = [
    { id: 'vassoio', title: 'Controllo Vassoio', label: 'Vassoio' },
  ]

  if (hasMelario) {
    steps.push({ id: 'melario', title: 'Controllo Melario', label: 'Melario' })
  }

  steps.push(
    { id: 'nido', title: 'Controllo Nido', label: 'Nido' },
    { id: 'salva', title: 'Riepilogo visita', label: 'Salva' },
  )

  return steps
}

export function isVisitaGuidataStepComplete(
  stepId: VisitaGuidataStepId,
  state: VisitaGuidataState,
): boolean {
  switch (stepId) {
    case 'vassoio':
      return state.vassoio.varroaPresente !== null
    case 'melario':
      return state.melario.opercolatura !== null
    case 'nido':
      return true
    case 'salva':
      return false
    default:
      return false
  }
}
