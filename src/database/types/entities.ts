/**
 * Entità di dominio MELI — schema definitivo Sprint 4.
 * Ogni interfaccia corrisponde a una tabella IndexedDB gestita da Dexie.
 */

/** Stati operativi di un'alveare in campo. */
export type ArniaStato = 'attiva' | 'debole' | 'senza_regina' | 'morta' | 'inattiva'

/**
 * Apiario — sito apistico.
 * Relazione: 1 Apiario → N Arnie.
 */
export type Apiario = {
  id: string
  nome: string
  descrizione?: string
  localita: string
  latitudine?: number
  longitudine?: number
  quota?: number
  fotoCopertina?: string
  /** Contatore denormalizzato per dashboard e card. */
  numeroArnie: number
  createdAt: number
  updatedAt: number
}

/**
 * Arnia — singola colonia.
 * Relazioni: N Arnie → 1 Apiario; 1 Arnia → N Visite | Produzioni | Trattamenti.
 */
export type Arnia = {
  id: string
  apiarioId: string
  numero: string
  nome?: string
  qrCode?: string
  stato: ArniaStato
  /** Indice di forza famiglia (0–100). */
  forzaFamiglia?: number
  /** FK alla regina attualmente operativa. */
  reginaAttualeId?: string
  fotoCopertina?: string
  note?: string
  createdAt: number
  updatedAt: number
}

/**
 * Regina — anagrafica regina collegata a un'arnia.
 * Relazione: N Regine → 1 Arnia; una sola attiva via Arnia.reginaAttualeId.
 */
export type Regina = {
  id: string
  arniaId: string
  anno?: number
  colore?: string
  razza?: string
  origine?: string
  marcata?: boolean
  note?: string
}

/**
 * Visita — ispezione sul campo.
 * Relazione: N Visite → 1 Arnia; 1 Visita → N Foto.
 */
export type Visita = {
  id: string
  arniaId: string
  data: number
  meteo?: string
  temperatura?: number
  covata?: string
  scorte?: string
  forza?: number
  reginaVista?: boolean
  comportamento?: string
  note?: string
}

/**
 * Foto — allegato multimediale.
 * Può appartenere a Visita, Arnia o Apiario (FK opzionali).
 */
export type Foto = {
  id: string
  visitaId?: string
  arniaId?: string
  apiarioId?: string
  /** Percorso o data URL (Capacitor in futuro). */
  path: string
  thumbnail?: string
  data: number
}

/**
 * Produzione — raccolta di un'arnia.
 * Relazione: N Produzioni → 1 Arnia.
 */
export type Produzione = {
  id: string
  arniaId: string
  data: number
  kg: number
  tipo?: string
}

/**
 * Trattamento sanitario su un'arnia.
 * Relazione: N Trattamenti → 1 Arnia.
 */
export type Trattamento = {
  id: string
  arniaId: string
  data: number
  prodotto?: string
  dose?: string
  scadenza?: number
}

/**
 * Vista UI — Apiario con alias retrocompatibili per le schermate esistenti.
 */
export type ApiarioView = Apiario & {
  /** Alias di fotoCopertina per componenti legacy. */
  foto?: string
  /** Alias di descrizione per componenti legacy. */
  note?: string
}

/** Vista UI — Arnia con alias retrocompatibili. */
export type ArniaView = Arnia & {
  /** Alias di numero per componenti legacy. */
  codice?: string
  /** Alias di fotoCopertina per componenti legacy. */
  coverFoto?: string
}
