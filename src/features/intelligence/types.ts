export type IntelligencePriority = 'urgente' | 'alta' | 'media' | 'programmare'

export type IntelligenceIconId =
  | 'calendar-clock'
  | 'crown'
  | 'alert-triangle'
  | 'hexagon'
  | 'leaf'

export type IntelligenceContext = {
  arniaId: string
  arniaNumero: string
  arniaNome?: string
  hasVisita: boolean
  ultimaVisitaData: number | null
  giorniDallUltimaVisita: number | null
  reginaLabel: string
  covataLabel: string
  scorteLabel: string
  melarioLabel: string
}

export type IntelligenceSuggestion = {
  id: string
  ruleId: string
  arniaId: string
  arniaNumero: string
  priorita: IntelligencePriority
  icon: IntelligenceIconId
  titolo: string
  descrizione: string
}

export type IntelligenceRule = {
  id: string
  priorita: IntelligencePriority
  icon: IntelligenceIconId
  titolo: string | ((ctx: IntelligenceContext) => string)
  descrizione: string | ((ctx: IntelligenceContext) => string)
  match: (ctx: IntelligenceContext) => boolean
}
