import type { ProduzioneInput, ReginaInput, TrattamentoInput } from '../../../database/types'

/** Voce checklist interventi effettuati (Sprint 1A.4). */
export type VisitaInterventoChecklistId =
  | 'aggiunto_melario'
  | 'tolto_melario'
  | 'nutrizione'
  | 'trattamento'
  | 'cambio_regina'
  | 'foglio_cereo'
  | 'altro'

export type VisitaInterventoDraft = {
  id: string
  checklistId: VisitaInterventoChecklistId
  label: string
  note: string
  reginaPayload?: Partial<Omit<ReginaInput, 'arniaId'>>
  trattamentoPayload?: Partial<Omit<TrattamentoInput, 'arniaId' | 'data'>>
  produzionePayload?: Partial<Omit<ProduzioneInput, 'arniaId' | 'data'>>
}

export type VisitaInterventiState = {
  items: VisitaInterventoDraft[]
}

export type VisitaInterventiApplyResult = {
  trattamentiCreati: number
  regineCreate: number
  produzioniCreate: number
  altriRegistrati: number
}

export const INTERVENTO_CHECKLIST: {
  id: VisitaInterventoChecklistId
  label: string
  icon: string
}[] = [
  { id: 'aggiunto_melario', label: 'Aggiunto melario', icon: '➕' },
  { id: 'tolto_melario', label: 'Tolto melario', icon: '➖' },
  { id: 'nutrizione', label: 'Nutrizione', icon: '🍬' },
  { id: 'trattamento', label: 'Trattamento', icon: '💊' },
  { id: 'cambio_regina', label: 'Cambio regina', icon: '👑' },
  { id: 'foglio_cereo', label: 'Inserito foglio cereo', icon: '📄' },
  { id: 'altro', label: 'Altro', icon: '✏️' },
]

export function emptyVisitaInterventiState(): VisitaInterventiState {
  return { items: [] }
}

export function createInterventoDraft(
  checklistId: VisitaInterventoChecklistId,
): VisitaInterventoDraft {
  const preset = INTERVENTO_CHECKLIST.find((item) => item.id === checklistId)
  return {
    id: `intervento-${checklistId}-${Date.now()}`,
    checklistId,
    label: preset?.label ?? checklistId,
    note: '',
    ...(checklistId === 'cambio_regina'
      ? {
          reginaPayload: {
            stato: 'fecondata' as const,
            dataInserimento: Date.now(),
            anno: new Date().getFullYear(),
          },
        }
      : {}),
    ...(checklistId === 'trattamento'
      ? { trattamentoPayload: { tipo: 'varroa', metodo: 'strip' } }
      : {}),
    ...(checklistId === 'nutrizione'
      ? { trattamentoPayload: { tipo: 'nutrizione', metodo: 'sciropo' } }
      : {}),
    ...(checklistId === 'aggiunto_melario' ? { produzionePayload: { kg: 0 } } : {}),
  }
}

export function isInterventoChecklistSelected(
  state: VisitaInterventiState,
  checklistId: VisitaInterventoChecklistId,
): boolean {
  return state.items.some((item) => item.checklistId === checklistId)
}
