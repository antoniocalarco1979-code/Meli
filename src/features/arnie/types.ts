export type { Arnia, ArniaStato } from '../../database/types'
export type { Apiario, Foto, Produzione, Regina, Trattamento, Visita } from '../../database/types'

export type TimelineItem = {
  id: string
  data: number
  titolo: string
  sottotitolo?: string
}

export type HealthScoreRow = {
  label: string
  weight: number
  active: boolean
}

export type HealthSummary = {
  value: number
  lastUpdate: number
  lastUpdateLabel: string
  scoreRows?: HealthScoreRow[]
}

export type QueenSummary = {
  present: boolean
  anno?: number
  colore?: string
  origine?: string
  stato: string
  eta: string
}

export type ProductionSummary = {
  annoTotale: number
  annoTotaleLabel: string
  ultimaSmielatura?: number
  ultimaSmielaturaLabel: string
  chartData: { mese: string; kg: number }[]
}

export type VisitaTimelineEntry = {
  id: string
  data: number
  meteo?: string
  note?: string
  reginaVista?: boolean
  fotoPaths: string[]
  trattamenti: string[]
  produzione: string[]
}

export type UltimaVisitaSummary = {
  data?: number
  dataLabel: string
  dataFull?: string
  meteo?: string
  note?: string
  reginaVista?: boolean
}

export type TrattamentoEntry = {
  id: string
  data: number
  dataLabel: string
  prodotto: string
  dose?: string
  scadenzaLabel?: string
}

export type ArniaDetailData = {
  salute: number
  health: HealthSummary
  queen: QueenSummary
  production: ProductionSummary
  ultimaVisita: UltimaVisitaSummary
  trattamenti: TrattamentoEntry[]
  visitTimeline: VisitaTimelineEntry[]
  reginaLabel: string
  produzioneTotale: string
  ultimaVisitaLabel: string
  trattamentoLabel: string
  timeline: TimelineItem[]
}

export type NuovaVisitaFormState = {
  meteo?: string
  temperatura?: number
  forza?: number
  covata?: string
  scorte?: string
  reginaVista?: boolean
  trattamento?: string
  comportamento?: string
  note?: string
}

export const emptyNuovaVisitaForm: NuovaVisitaFormState = {
  meteo: '',
  temperatura: undefined,
  forza: 8,
  covata: '',
  scorte: '',
  reginaVista: true,
  trattamento: '',
  comportamento: '',
  note: '',
}

import type { Apiario, Arnia } from '../../database/types'

export type ArniaListItem = {
  arnia: Arnia
  apiario?: Apiario
  coverFoto?: string
  salute: number
  reginaLabel: string
  ultimaVisitaLabel: string
  produzioneAnnoLabel: string
}
