/** Telaino normalizzato per cronologia e futuro confronto visite. */
export type VisitaCronologiaTelaino = {
  numero: number
  regina?: string
  uova?: string
  covataAperta?: string
  covataOpercolata?: string
  miele?: string
  polline?: string
  celleReali?: string
  varroa?: string
  note?: string
}

export type VisitaCronologiaIntervento = {
  label: string
  note?: string
}

/** Dettaglio strutturato di una visita (sola lettura). */
export type VisitaCronologiaDetail = {
  isGuidata: boolean
  sessionId?: string
  durataLabel?: string
  durataSec?: number
  meteo?: string
  affumicatore?: string
  melario?: string
  escludiRegina?: string
  regina?: string
  varroaVassoio?: string
  noteNido?: string
  celleRealiPresenti?: string
  interventi: VisitaCronologiaIntervento[]
  telaini: VisitaCronologiaTelaino[]
  riepilogoLines: { label: string; value: string }[]
}

/**
 * Snapshot normalizzato per confronto tra visite (Sprint futuro).
 * Usare `buildVisitaCronologiaSnapshot` per costruirlo.
 */
export type VisitaCronologiaSnapshot = {
  visitaId: string
  arniaId: string
  data: number
  durataSec?: number
  telainiCount: number
  interventiCount: number
  fotoCount: number
  reginaVista?: boolean
  meteo?: string
  statoGenerale: string
  saluteValue: number
  detail: VisitaCronologiaDetail
}

/** Coppia per confronto visite (preparazione UI futura). */
export type VisitaCronologiaComparePair = {
  left: VisitaCronologiaSnapshot
  right: VisitaCronologiaSnapshot
}
