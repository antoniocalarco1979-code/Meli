import type { GiroSessionStats } from './giro.types'

/** Stato passato da Apiario → Arnia per aprire il wizard visita. */
export type GiroReturnContext = {
  apiarioId: string
  apiarioNome: string
  arniaIndex: number
  giroActive: boolean
  giroStats: GiroSessionStats
  completedThrough: number
}

/** Stato passato da Arnia → Apiario per riprendere il giro. */
export type GiroResumeContext = {
  nextIndex: number
  giroActive: boolean
  giroStats: GiroSessionStats
  completedThrough: number
}

export type ArniaVisitLocationState = {
  openVisita?: boolean
  giroReturn?: GiroReturnContext
}

export type ApiarioGiroLocationState = {
  giroResume?: GiroResumeContext
}
