import type { VassoioVarroaChoice } from './ispezioneWizard.types'
import type { TelainoVisitaRecord } from './telainoPanel.types'
import { isTelainoVisitaComplete } from './telainoPanel.types'
import type { VisitOpercolaturaChoice } from './visitWizard.types'
import {
  emptyVisitaInterventiState,
  type VisitaInterventiState,
} from './visitaInterventi.types'

export type VisitaGuidataStepId =
  | 'intro'
  | 'fase-affumicatore'
  | 'fase-melario'
  | 'escludi-regina'
  | 'nido'
  | 'interventi'
  | 'riepilogo'

export type VisitaGuidataStepDef = {
  id: VisitaGuidataStepId
  title: string
  label: string
  phase?: number
}

export type SiNoChoice = 'si' | 'no'

export type EscludiReginaAzione = 'presente' | 'rimosso' | 'assente'

export type ReginaVistaChoice = 'si' | 'no' | 'non_cercata'

export type VisitaGuidataAffumicatore = {
  utilizzato: SiNoChoice | null
  note: string
}

export type VisitaGuidataMelario = {
  presente: SiNoChoice | null
  opercolatura: VisitOpercolaturaChoice | null
  note: string
  foto?: string
}

export type VisitaGuidataEscludiRegina = {
  azione: EscludiReginaAzione | null
  note: string
}

export type VisitaGuidataNido = {
  varroaPresente: VassoioVarroaChoice | null
  reginaVista: ReginaVistaChoice | null
  note: string
  foto?: string
  telaini: TelainoVisitaRecord[]
}

export type VisitaGuidataState = {
  sessionId: string | null
  startedAt: number | null
  meteo?: string
  affumicatore: VisitaGuidataAffumicatore
  melario: VisitaGuidataMelario
  escludiRegina: VisitaGuidataEscludiRegina
  nido: VisitaGuidataNido
  interventi: VisitaInterventiState
}

export type VisitaGuidataDraft = {
  arniaId: string
  stepIndex: number
  state: VisitaGuidataState
  updatedAt: number
}

export const SI_NO_OPTIONS: { value: SiNoChoice; label: string }[] = [
  { value: 'si', label: 'Sì' },
  { value: 'no', label: 'No' },
]

export const ESCLUDI_REGINA_OPTIONS: { value: EscludiReginaAzione; label: string }[] = [
  { value: 'presente', label: 'Presente — lasciato' },
  { value: 'rimosso', label: 'Rimosso per ispezione' },
  { value: 'assente', label: 'Non montato' },
]

export const REGINA_VISTA_OPTIONS: { value: ReginaVistaChoice; label: string }[] = [
  { value: 'si', label: 'Regina vista' },
  { value: 'no', label: 'Regina non vista' },
  { value: 'non_cercata', label: 'Non cercata' },
]

export function emptyVisitaGuidataState(): VisitaGuidataState {
  return {
    sessionId: null,
    startedAt: null,
    affumicatore: { utilizzato: null, note: '' },
    melario: { presente: null, opercolatura: null, note: '' },
    escludiRegina: { azione: null, note: '' },
    nido: { varroaPresente: null, reginaVista: null, note: '', telaini: [] },
    interventi: emptyVisitaInterventiState(),
  }
}

export function createVisitaGuidataSession(meteo?: string): VisitaGuidataState {
  const now = Date.now()
  return {
    ...emptyVisitaGuidataState(),
    sessionId: crypto.randomUUID(),
    startedAt: now,
    meteo,
  }
}

/** Compatibilità bozze precedenti. */
export function normalizeVisitaGuidataState(
  partial: Partial<VisitaGuidataState> & {
    vassoio?: { varroaPresente?: VassoioVarroaChoice | null; note?: string; foto?: string }
    affumicatore?: Partial<VisitaGuidataAffumicatore> & { stato?: 'pronto' | 'in_uso' }
  },
): VisitaGuidataState {
  const base = emptyVisitaGuidataState()
  const legacyAffumicatore = partial.affumicatore as
    | (Partial<VisitaGuidataAffumicatore> & { stato?: 'pronto' | 'in_uso' })
    | undefined

  const utilizzato =
    partial.affumicatore?.utilizzato ??
    (legacyAffumicatore?.stato ? 'si' : base.affumicatore.utilizzato)

  return {
    ...base,
    ...partial,
    sessionId: partial.sessionId ?? base.sessionId,
    startedAt: partial.startedAt ?? base.startedAt,
    meteo: partial.meteo,
    affumicatore: {
      ...base.affumicatore,
      ...partial.affumicatore,
      utilizzato,
    },
    melario: { ...base.melario, ...partial.melario },
    escludiRegina: { ...base.escludiRegina, ...partial.escludiRegina },
    nido: {
      ...base.nido,
      ...partial.nido,
      telaini: partial.nido?.telaini ?? base.nido.telaini,
      varroaPresente:
        partial.nido?.varroaPresente ??
        partial.vassoio?.varroaPresente ??
        base.nido.varroaPresente,
      note: partial.nido?.note ?? partial.vassoio?.note ?? base.nido.note,
      foto: partial.nido?.foto ?? partial.vassoio?.foto ?? base.nido.foto,
    },
    interventi: partial.interventi ?? base.interventi,
  }
}

export function buildVisitaGuidataSteps(): VisitaGuidataStepDef[] {
  return [
    { id: 'intro', title: 'Sessione visita', label: 'Intro' },
    { id: 'fase-affumicatore', title: 'Fase 1', label: 'Fase 1', phase: 1 },
    { id: 'fase-melario', title: 'Fase 2', label: 'Fase 2', phase: 2 },
    { id: 'escludi-regina', title: 'Escludi regina', label: 'Escludi' },
    { id: 'nido', title: 'Controllo Nido', label: 'Nido' },
    { id: 'interventi', title: 'Interventi effettuati', label: 'Interventi' },
    { id: 'riepilogo', title: 'Riepilogo visita', label: 'Riepilogo' },
  ]
}

export function isVisitaGuidataStepComplete(
  stepId: VisitaGuidataStepId,
  state: VisitaGuidataState,
): boolean {
  switch (stepId) {
    case 'intro':
      return false
    case 'fase-affumicatore':
      return state.affumicatore.utilizzato !== null
    case 'fase-melario':
      return state.melario.presente !== null
    case 'escludi-regina':
      return state.escludiRegina.azione !== null
    case 'nido':
      return (
        state.nido.telaini.length > 0 && state.nido.telaini.every(isTelainoVisitaComplete)
      )
    case 'interventi': {
      const cambioRegina = state.interventi.items.find((item) => item.checklistId === 'cambio_regina')
      if (cambioRegina && !cambioRegina.reginaPayload?.numero?.trim()) return false

      const trattamento = state.interventi.items.find(
        (item) => item.checklistId === 'trattamento' || item.checklistId === 'nutrizione',
      )
      if (trattamento && !trattamento.trattamentoPayload?.tipo?.trim()) return false

      return true
    }
    case 'riepilogo':
      return true
    default:
      return false
  }
}

export function formatVisitaDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export function formatVisitaDate(timestamp: number): string {
  return new Intl.DateTimeFormat('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(timestamp)
}

export function formatVisitaTime(timestamp: number): string {
  return new Intl.DateTimeFormat('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(timestamp)
}

export function labelSiNo(value: SiNoChoice | null | undefined): string {
  if (!value) return '—'
  return SI_NO_OPTIONS.find((option) => option.value === value)?.label ?? value
}
