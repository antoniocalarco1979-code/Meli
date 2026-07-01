import type {
  Apiario,
  Arnia,
  ArniaModelloId,
  ArniaStato,
  Foto,
  Produzione,
  Regina,
  ReginaOrigineTipo,
  ReginaStatoOperativo,
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
  esposizione?: string
  accessibilita?: string
  presenzaAcqua?: boolean
  fiorituraPrevalente?: string
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
  stato?: ArniaStato
  forzaFamiglia?: number
  fotoCopertina?: string
  note?: string
  /** Alias UI → numero */
  codice?: string
}

export type ArniaUpdate = Partial<Omit<Arnia, 'id' | 'publicUuid' | 'qrCode' | 'apiarioId' | 'createdAt'>>

export type ReginaInput = {
  arniaId: string
  numero: string
  nome?: string
  anno?: number
  colore?: string
  razza?: string
  provenienza?: string
  allevatore?: string
  origineTipo?: ReginaOrigineTipo
  /** Alias legacy → provenienza */
  origine?: string
  stato?: ReginaStatoOperativo
  marcata?: boolean
  dataNascita?: number
  dataInserimento?: number
  dataSostituzione?: number
  valDocilita?: number
  valProduttivita?: number
  valSciamatura?: number
  valPulizia?: number
  valResistenzaVarroa?: number
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
  reginaId?: string
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

export type ProduzioneUpdate = Partial<Omit<Produzione, 'id' | 'arniaId' | 'apiarioId'>>

/** Registrazione rapida smielatura apiario (Sprint 4). */
export type SmielaturaInput = {
  apiarioId: string
  data: number
  kg: number
  numeroMelari: number
  arnieCoinvolteIds?: string[]
  umidita?: number
  note?: string
}

export type TrattamentoInput = {
  arniaId: string
  data: number
  visitaId?: string
  tipo?: string
  principioAttivo?: string
  dose?: string
  metodo?: string
  note?: string
  scadenza?: number
  /** Alias legacy → principioAttivo */
  prodotto?: string
  /** Alias legacy → scadenza */
  dataProgrammata?: number
}

export type TrattamentoUpdate = Partial<Omit<Trattamento, 'id' | 'arniaId'>>

export type CreateApiarioData = Omit<Apiario, 'id' | 'createdAt' | 'updatedAt'>

export type CreateArniaData = Omit<Arnia, 'id' | 'createdAt' | 'updatedAt'>
