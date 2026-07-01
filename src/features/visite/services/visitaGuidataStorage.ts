import {
  createVisitaGuidataSession,
  emptyVisitaGuidataState,
  normalizeVisitaGuidataState,
  type VisitaGuidataDraft,
  type VisitaGuidataState,
} from '../types/visitaGuidata.types'

const PREFIX = 'meli-visita-guidata'
const ACTIVE_KEY = `${PREFIX}:active`

function storageKey(arniaId: string): string {
  return `${PREFIX}:${arniaId}`
}

export function loadVisitaGuidataDraft(arniaId: string): VisitaGuidataDraft | null {
  try {
    const raw = localStorage.getItem(storageKey(arniaId))
    if (!raw) return null
    const parsed = JSON.parse(raw) as VisitaGuidataDraft
    if (!parsed.state?.sessionId) return null
    return parsed
  } catch {
    return null
  }
}

export function hasVisitaGuidataDraft(arniaId: string): boolean {
  return loadVisitaGuidataDraft(arniaId) !== null
}

export function getActiveVisitaDraftArniaId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_KEY)
  } catch {
    return null
  }
}

export function saveVisitaGuidataDraft(
  arniaId: string,
  stepIndex: number,
  state: VisitaGuidataState,
): void {
  const draft: VisitaGuidataDraft = {
    arniaId,
    stepIndex,
    state,
    updatedAt: Date.now(),
  }
  localStorage.setItem(storageKey(arniaId), JSON.stringify(draft))
  localStorage.setItem(ACTIVE_KEY, arniaId)
}

export function clearVisitaGuidataDraft(arniaId: string): void {
  localStorage.removeItem(storageKey(arniaId))
  if (localStorage.getItem(ACTIVE_KEY) === arniaId) {
    localStorage.removeItem(ACTIVE_KEY)
  }
}

export function restoreVisitaGuidataState(arniaId: string): {
  stepIndex: number
  state: VisitaGuidataState
} {
  const draft = loadVisitaGuidataDraft(arniaId)
  if (!draft) {
    return { stepIndex: 0, state: emptyVisitaGuidataState() }
  }
  return {
    stepIndex: draft.stepIndex,
    state: normalizeVisitaGuidataState(draft.state),
  }
}

export function beginVisitaGuidataSession(
  arniaId: string,
  meteo?: string,
): { stepIndex: number; state: VisitaGuidataState } {
  clearVisitaGuidataDraft(arniaId)
  const state = createVisitaGuidataSession(meteo)
  saveVisitaGuidataDraft(arniaId, 0, state)
  return { stepIndex: 0, state }
}
