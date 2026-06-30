import type { GiroSessionStats } from './giro.types'

/** Stato passato da Apiario → Arnia per aprire il wizard visita. */
export type GiroReturnContext = {
  giroId?: string
  apiarioId: string
  apiarioNome: string
  arniaIndex: number
  giroActive: boolean
  giroStats: GiroSessionStats
  /** Ordine arnie del giro (per avanzamento continuo). */
  arniaIds?: string[]
  visitedArniaIds?: string[]
  completedThrough: number
}

/** Stato passato da Arnia → Apiario per riprendere il giro. */
export type GiroResumeContext = {
  giroId?: string
  nextIndex: number
  giroActive: boolean
  giroStats: GiroSessionStats
  arniaIds?: string[]
  visitedArniaIds?: string[]
  completedThrough: number
}

export type ArniaVisitLocationState = {
  openVisita?: boolean
  giroReturn?: GiroReturnContext
}

export type ApiarioGiroLocationState = {
  giroResume?: GiroResumeContext
  tab?: 'informazioni' | 'statistiche' | 'giro'
  autoStartGiro?: boolean
}

export type VisitWizardLocationState = {
  giroReturn?: GiroReturnContext
}
