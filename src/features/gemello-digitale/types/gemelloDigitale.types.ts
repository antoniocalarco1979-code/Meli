/**
 * Gemello Digitale — modello dati definitivo (v1 simulato).
 */

export type GemelloVisualState = {
  accentColor?: string
  pulse?: boolean
  animationKey?: string
}

export type TelainoSimulatedSnapshot = {
  covata: string
  polline: string
  scorte: string
  api: string
  regina: string
  varroa: string
  note: string
}

/** Voce cronologia telaino — pronta per persistenza reale. */
export type TelainoHistoryEntry = {
  id: string
  at: number
  label: string
  snapshot: TelainoSimulatedSnapshot
}

/** Evento timeline telaino — v2+. */
export type TelainoTimelineEvent = {
  id: string
  at: number
  label: string
  kind: 'ispezione' | 'foto' | 'nota' | 'alert'
}

/** Riferimento foto telaino — v2+. */
export type TelainoPhotoRef = {
  id: string
  url?: string
  caption?: string
  at: number
}

export type TelainoGemelloModel = {
  id: string
  numero: number
  visual: GemelloVisualState
  current: TelainoSimulatedSnapshot
  history: TelainoHistoryEntry[]
  photos: TelainoPhotoRef[]
  timeline: TelainoTimelineEvent[]
}

export type MelarioGemelloModel = {
  id: string
  label: string
  stackIndex: number
  visual: GemelloVisualState
}

export type EscludiReginaGemelloModel = {
  id: string
  label: string
  visual: GemelloVisualState
}

export type NidoGemelloModel = {
  id: string
  label: string
  telaini: TelainoGemelloModel[]
}

export type GemelloDigitaleModel = {
  arniaNumero: string
  melari: MelarioGemelloModel[]
  escludiRegina: EscludiReginaGemelloModel
  nido: NidoGemelloModel
  hasVassoio: boolean
}

export type GemelloDigitaleViewMode = 'stack' | 'nido'

export type GemelloPanelTarget = 'telaino' | 'melario' | null

export type GemelloInteractionSnapshot = {
  view: GemelloDigitaleViewMode
  liftedMelarioIds: string[]
  escludiReginaVisible: boolean
  selectedMelarioId: string | null
  selectedTelainoId: string | null
  panelOpen: boolean
  panelTarget: GemelloPanelTarget
  at: number
}

export type TelainoGemelloPanelField =
  | 'covata'
  | 'polline'
  | 'scorte'
  | 'api'
  | 'regina'
  | 'varroa'
  | 'foto'
  | 'note'

export const TELAINO_GEMELLO_PANEL_FIELDS: {
  key: TelainoGemelloPanelField
  label: string
  emoji: string
  snapshotKey: keyof TelainoSimulatedSnapshot | 'photos'
}[] = [
  { key: 'covata', label: 'Covata', emoji: '🥚', snapshotKey: 'covata' },
  { key: 'polline', label: 'Polline', emoji: '🌼', snapshotKey: 'polline' },
  { key: 'scorte', label: 'Scorte', emoji: '🍯', snapshotKey: 'scorte' },
  { key: 'api', label: 'Api', emoji: '🐝', snapshotKey: 'api' },
  { key: 'regina', label: 'Regina', emoji: '👑', snapshotKey: 'regina' },
  { key: 'varroa', label: 'Varroa', emoji: '⚠️', snapshotKey: 'varroa' },
  { key: 'foto', label: 'Foto', emoji: '📷', snapshotKey: 'photos' },
  { key: 'note', label: 'Note', emoji: '📝', snapshotKey: 'note' },
]

/** @deprecated Usare GemelloDigitaleModel */
export type GemelloDigitaleStructure = GemelloDigitaleModel
