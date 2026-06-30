import {
  emptyVisitaGuidataState,
  type VisitaGuidataDraft,
  type VisitaGuidataState,
} from '../types/visitaGuidata.types'

const PREFIX = 'meli-visita-guidata'

function storageKey(arniaId: string): string {
  return `${PREFIX}:${arniaId}`
}

export function loadVisitaGuidataDraft(arniaId: string): VisitaGuidataDraft | null {
  try {
    const raw = sessionStorage.getItem(storageKey(arniaId))
    if (!raw) return null
    const parsed = JSON.parse(raw) as VisitaGuidataDraft
    if (!parsed.state) return null
    return parsed
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
    stepIndex,
    state,
    updatedAt: Date.now(),
  }
  sessionStorage.setItem(storageKey(arniaId), JSON.stringify(draft))
}

export function clearVisitaGuidataDraft(arniaId: string): void {
  sessionStorage.removeItem(storageKey(arniaId))
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
    state: { ...emptyVisitaGuidataState(), ...draft.state },
  }
}
