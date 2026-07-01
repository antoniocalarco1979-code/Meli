import type { Apiario, Arnia, Trattamento, TrattamentoCalendarioPromemoria } from '../../../database/types'

export type TrattamentoListItem = {
  trattamento: Trattamento
  arnia?: Arnia
  apiario?: Apiario
  tipoLabel: string
  dataLabel: string
  principioLabel: string
  hasPromemoria: boolean
}

export type TrattamentoFormDraft = {
  tipo: string
  principioAttivo: string
  data: string
  dose: string
  metodo: string
  note: string
  scadenza: string
}

export type UltimoTrattamentoSummary = {
  present: boolean
  id?: string
  tipoLabel: string
  dataLabel: string
  dataFull?: string
  principioAttivo?: string
  promemoria?: TrattamentoCalendarioPromemoria
}

export type TrattamentoDetailView = {
  trattamento: Trattamento
  arnia?: Arnia
  apiario?: Apiario
  tipoLabel: string
  dataLabel: string
  metodoLabel: string
  promemoria?: TrattamentoCalendarioPromemoria
}
