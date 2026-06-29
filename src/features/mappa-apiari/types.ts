export type ApiarioMapMarker = {
  id: string
  nome: string
  latitudine: number
  longitudine: number
  numeroArnie: number
  ultimaVisitaLabel: string
  ultimaVisitaData?: number
}

export type MappaApiariData = {
  markers: ApiarioMapMarker[]
  totaleApiari: number
  apiariSenzaCoordinate: number
}

export type MappaApiariCapabilityId =
  | 'navigazione'
  | 'meteo'
  | 'fioriture'
  | 'allerta-incendi'

export type MappaApiariCapability = {
  id: MappaApiariCapabilityId
  label: string
  description: string
  enabled: boolean
}

/** Estensioni future — attivare impostando enabled: true. */
export const MAPPA_APIARI_FUTURE_CAPABILITIES: MappaApiariCapability[] = [
  {
    id: 'navigazione',
    label: 'Navigazione',
    description: 'Avvio navigatore verso l\'apiario selezionato',
    enabled: false,
  },
  {
    id: 'meteo',
    label: 'Meteo',
    description: 'Condizioni meteo locali per ogni sito',
    enabled: false,
  },
  {
    id: 'fioriture',
    label: 'Fioriture',
    description: 'Mappa delle fioriture attive nel raggio',
    enabled: false,
  },
  {
    id: 'allerta-incendi',
    label: 'Allerta incendi',
    description: 'Sovrapposizione rischio incendi boschivi',
    enabled: false,
  },
]
