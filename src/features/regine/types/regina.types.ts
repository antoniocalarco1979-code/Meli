import type { Apiario, Arnia, Regina } from '../../../database/types'

export type ReginaListItem = {
  regina: Regina
  arnia?: Arnia
  apiario?: Apiario
  isAttuale: boolean
  displayTitle: string
  displaySubtitle: string
  coloreLabel?: string
  statoLabel: string
}

export type ReginaFormDraft = {
  numero: string
  colore: string
  anno: string
  razza: string
  stato: string
  dataInserimento: string
  note: string
}

export type ReginaDetailView = {
  regina: Regina
  arnia?: Arnia
  apiario?: Apiario
  isAttuale: boolean
  displayTitle: string
  coloreLabel?: string
  statoLabel: string
}
