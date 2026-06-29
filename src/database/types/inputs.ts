import type {
  Apiario,
  Arnia,
  ArniaModelloId,
  ArniaStato,
  Foto,
  Produzione,
  Regina,
  Trattamento,
  Visita,
  GiroApiario,
} from './entities'

/** Payload creazione Apiario. */
export type ApiarioInput = {
  nome: string
  localita?: string
  descrizione?: string
  latitudine?: number
  longitudine?: number
  comune?: string
  provincia?: string
  regione?: string
  indirizzo?: string
  quota?: number
  fotoCopertina?: string
  numeroArnie: number
  /** Alias UI → descrizione */
  note?: string
  /** Alias UI → fotoCopertina */
  foto?: string
}

export type ApiarioUpdate = Partial<ApiarioInput>

export type ArniaInput = {
  apiarioId: string
  numero: string
  modelloId: ArniaModelloId
  /** Obbligatorio se modelloId === 'personalizzata'. */
  telaiPersonalizzati?: number
  colore?: string
  nome?: string
  qrCode?: string
  stato?: ArniaStato
  forzaFamiglia?: number
  fotoCopertina?: string
  note?: string
  /** Alias UI → numero */
  codice?: string
}

export type ArniaUpdate = Partial<Omit<Arnia, 'id' | 'apiarioId' | 'createdAt'>>

export type ReginaInput = {
  arniaId: string
  anno?: number
  colore?: string
  razza?: string
  origine?: string
  marcata?: boolean
  note?: string
  /** Se true, imposta come reginaAttualeId sull'arnia. Default: true. */
  impostaComeAttuale?: boolean
}

export type ReginaUpdate = Partial<Omit<Regina, 'id' | 'arniaId'>>

export type VisitaInput = {
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

export type VisitaUpdate = Partial<Omit<Visita, 'id' | 'arniaId'>>

export type GiroApiarioInput = {
  apiarioId: string
}

export type GiroApiarioUpdate = Partial<
  Omit<GiroApiario, 'id' | 'apiarioId' | 'createdAt'>
>

export type FotoInput = {
  path: string
  visitaId?: string
  arniaId?: string
  apiarioId?: string
  thumbnail?: string
  data?: number
  /** Alias legacy → path */
  dataUrl?: string
}

export type FotoUpdate = Partial<Omit<Foto, 'id'>>

export type ProduzioneInput = {
  arniaId: string
  data: number
  kg: number
  tipo?: string
  /** Alias legacy → kg */
  quantita?: number
  /** Alias legacy → data */
  dataRaccolta?: number
}

export type ProduzioneUpdate = Partial<Omit<Produzione, 'id' | 'arniaId'>>

export type TrattamentoInput = {
  arniaId: string
  data: number
  prodotto?: string
  dose?: string
  scadenza?: number
  /** Alias legacy → scadenza */
  dataProgrammata?: number
  /** Alias legacy → prodotto filtro varroa */
  tipo?: string
}

export type TrattamentoUpdate = Partial<Omit<Trattamento, 'id' | 'arniaId'>>

export type CreateApiarioData = Omit<Apiario, 'id' | 'createdAt' | 'updatedAt'>

export type CreateArniaData = Omit<Arnia, 'id' | 'createdAt' | 'updatedAt'>
