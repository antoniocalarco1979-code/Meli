import type { Apiario, Arnia, Visita } from '../../database/types'
import type { AzioneConsigliata } from '../azioni/types'
import type { SaluteLevel } from '../../utils/salute'

export type { Arnia, ArniaStato } from '../../database/types'
export type { Apiario, Foto, Produzione, Regina, Trattamento, Visita } from '../../database/types'

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
  dataShort: string
  dataFull: string
  oraLabel: string
  summary: string
  statusIcon: string
  statusLevel: SaluteLevel
  statoGeneraleLabel: string
  saluteValue: number
  reginaLabel: string
  covataLabel: string
  scorteLabel: string
  melarioLabel: string
  meteoLabel: string
  temperaturaLabel: string
  operatoreLabel: string
  azioniConsigliate: AzioneConsigliata[]
  noteDisplay?: string
  fotoPaths: string[]
  trattamenti: string[]
  produzione: string[]
}

export type UltimaVisitaSummary = {
  data?: number
  dataLabel: string
  dataFull?: string
  dataShort?: string
  meteo?: string
  note?: string
  reginaVista?: boolean
  reginaLabel: string
  covataLabel: string
  scorteLabel: string
  melarioLabel: string
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
}

export type ArniaListItem = {
  arnia: Arnia
  apiario?: Apiario
  coverFoto?: string
  salute: number
  reginaLabel: string
  ultimaVisitaLabel: string
  ultimaVisitaData?: number | null
  /** Ultima visita grezza — usata per ordinamento giro apiario. */
  ultimaVisita?: Visita
  produzioneAnnoLabel: string
}
