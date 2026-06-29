export type AzionePriorita = 'urgente' | 'importante' | 'programmare'

export type AzioneConsigliata = {
  id: string
  ruleId: string
  priorita: AzionePriorita
  messaggio: string
}

export type AzioneConsigliataConArnia = AzioneConsigliata & {
  arniaId: string
  arniaNumero: string
}

export type AzioneRuleContext = {
  hasVisita: boolean
  reginaLabel: string
  covataLabel: string
  scorteLabel: string
  melarioLabel: string
  /** Dati v2 dal vassoio antivarroa (null se visita legacy). */
  vassoioVarroa: string | null
  acariStimati: number | null
  telaiTotali: number
  telaiConCelleReali: boolean
  telaiScorteScarseCount: number
  reginaVistaSuTelai: boolean
  covataAssenteSuTuttiTelai: boolean
}

export type AzioneRule = {
  id: string
  priorita: AzionePriorita
  match: (ctx: AzioneRuleContext) => boolean
  message: string
}
