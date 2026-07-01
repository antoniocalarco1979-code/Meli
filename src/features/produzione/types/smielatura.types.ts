import type { Apiario, Arnia, Produzione } from '../../../database/types'

export type SmielaturaFormDraft = {
  apiarioId: string
  data: string
  arnieCoinvolteIds: string[]
  numeroMelari: string
  kg: string
  umidita: string
  note: string
}

export type SmielaturaListItem = {
  smielatura: Produzione
  apiario?: Apiario
  arnie: Arnia[]
  dataLabel: string
  kgLabel: string
  melariLabel: string
  umiditaLabel?: string
}
