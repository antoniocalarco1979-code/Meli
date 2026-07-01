/**
 * Entità di dominio MELI — schema definitivo Sprint 4.
 * Ogni interfaccia corrisponde a una tabella IndexedDB gestita da Dexie.
 */

/** Stati operativi di un'alveare in campo. */
export type ArniaStato = 'attiva' | 'debole' | 'senza_regina' | 'morta' | 'inattiva'

/** Modello costruttivo dell'arnia — determina telaini e attrezzatura di base. */
export type ArniaModelloId =
  | 'dadant_blatt_10'
  | 'dadant_blatt_12'
  | 'langstroth'
  | 'warre'
  | 'top_bar'
  | 'orizzontale'
  | 'personalizzata'

/**
 * Apiario — sito apistico.
 * Relazione: 1 Apiario → N Arnie.
 */
export type Apiario = {
  id: string
  nome: string
  descrizione?: string
  /** Etichetta località legacy / sintesi (comune + provincia). */
  localita: string
  latitudine?: number
  longitudine?: number
  comune?: string
  provincia?: string
  regione?: string
  indirizzo?: string
  quota?: number
  fotoCopertina?: string
  /** Contatore denormalizzato per dashboard e card. */
  numeroArnie: number
  /** Kg totali da smielature registrate (denormalizzato). */
  kgProduzioneTotale?: number
  /** Kg prodotti nell'anno solare corrente (denormalizzato). */
  kgProduzioneAnno?: number
  /** Esposizione del sito (N, E, S, O, mista). */
  esposizione?: string
  /** Livello di accessibilità al sito. */
  accessibilita?: string
  /** Presenza di acqua nelle vicinanze. */
  presenzaAcqua?: boolean
  /** Fioritura predominante nella zona. */
  fiorituraPrevalente?: string
  createdAt: number
  updatedAt: number
}

/**
 * Arnia — singola colonia.
 * Relazioni: N Arnie → 1 Apiario; 1 Arnia → N Visite | Produzioni | Trattamenti.
 */
export type Arnia = {
  id: string
  /** UUID permanente — non cambia con numero, nome o colore. */
  publicUuid: string
  apiarioId: string
  numero: string
  nome?: string
  /** Payload QR — `meli://arnia/{publicUuid}`. */
  qrCode: string
  /** Immagine QR (PNG data URL) persistita per anteprima, stampa e PDF. */
  qrImageDataUrl?: string
  stato: ArniaStato
  /** Modello costruttivo selezionato in creazione. */
  modelloId: ArniaModelloId
  /** Numero telaini corpo/nucleo derivato dal modello. */
  numeroTelai: number
  /** Presenza melario prevista dal modello. */
  hasMelario: boolean
  /** Supporto vassoio antivarroa previsto dal modello. */
  hasVassoioAntivarroa: boolean
  /** Colore identificativo scelto in creazione. */
  colore?: string
  /** Estensioni modello — struttura aperta per feature future. */
  modelloExtensions?: Record<string, unknown>
  /** Indice di forza famiglia (0–100). */
  forzaFamiglia?: number
  /** FK alla regina attualmente operativa. */
  reginaAttualeId?: string
  fotoCopertina?: string
  note?: string
  createdAt: number
  updatedAt: number
}

/** Colori internazionali marcatura regina. */
export type ReginaColoreInternazionale = 'bianca' | 'gialla' | 'rossa' | 'verde' | 'blu'

/** Stato operativo della regina (Passaporto Regina — Sprint 2A). */
export type ReginaStatoOperativo =
  | 'fecondata'
  | 'vergine'
  | 'in_deposizione'
  | 'da_sostituire'
  | 'persa'

/** Provenienza commerciale o di allevamento. */
export type ReginaOrigineTipo = 'acquistata' | 'autoprodotta'

/**
 * Regina — passaporto regina collegato a un'arnia.
 * Relazione: N Regine → 1 Arnia; una sola attiva via Arnia.reginaAttualeId.
 */
export type Regina = {
  id: string
  arniaId: string
  /** Numero identificativo regina (marcatura o codice interno). */
  numero: string
  nome?: string
  colore?: ReginaColoreInternazionale | string
  anno?: number
  razza?: string
  provenienza?: string
  allevatore?: string
  origineTipo?: ReginaOrigineTipo
  /** @deprecated Usare provenienza — mantenuto per retrocompatibilità. */
  origine?: string
  stato?: ReginaStatoOperativo
  /** @deprecated Usare stato — mantenuto per retrocompatibilità. */
  marcata?: boolean
  dataNascita?: number
  dataInserimento?: number
  dataSostituzione?: number
  /** Valutazioni 1–5 (Passaporto Regina). */
  valDocilita?: number
  valProduttivita?: number
  valSciamatura?: number
  valPulizia?: number
  valResistenzaVarroa?: number
  note?: string
  createdAt: number
  updatedAt: number
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
  reginaId?: string
  /** Percorso o data URL (Capacitor in futuro). */
  path: string
  thumbnail?: string
  data: number
}

/**
 * Produzione — raccolta per arnia (legacy) o smielatura apiario (Sprint 4).
 * Smielatura: apiarioId + tipo `smielatura`; arniaId opzionale.
 */
export type Produzione = {
  id: string
  /** Legacy per-arnia — assente nelle smielature apiario. */
  arniaId?: string
  /** Apiario della smielatura (Sprint 4). */
  apiarioId?: string
  data: number
  kg: number
  tipo?: string
  numeroMelari?: number
  umidita?: number
  arnieCoinvolteIds?: string[]
  note?: string
  createdAt?: number
  updatedAt?: number
}

/**
 * Trattamento sanitario su un'arnia.
 * Relazione: N Trattamenti → 1 Arnia; opzionale collegamento a Visita.
 */
export type Trattamento = {
  id: string
  arniaId: string
  visitaId?: string
  data: number
  /** Tipo trattamento (Varroa, Nutrizione, …). */
  tipo?: string
  principioAttivo?: string
  /** @deprecated Alias di principioAttivo — retrocompatibilità. */
  prodotto?: string
  dose?: string
  metodo?: string
  note?: string
  /** Data follow-up / rimozione strip — base per promemoria calendario. */
  scadenza?: number
  /** Promemoria calendario preparato (Sprint 3 — push non implementato). */
  promemoriaCalendario?: TrattamentoCalendarioPromemoria
  createdAt: number
  updatedAt: number
}

/**
 * Promemoria calendario derivato da un trattamento.
 * Architettura pronta per notifiche push future (notificationChannel).
 */
export type TrattamentoCalendarioPromemoria = {
  id: string
  trattamentoId: string
  arniaId: string
  titolo: string
  dataPromemoria: number
  tipoPromemoria: 'controllo' | 'richiusura' | 'rimozione' | 'follow_up'
  /** Solo calendario in Sprint 3; estendibile a `push`. */
  notificationChannel: 'calendar' | 'push'
  stato: 'programmato' | 'completato' | 'annullato'
  createdAt: number
}

/** Stato di una sessione Giro Apiario. */
export type GiroApiarioStato = 'in_corso' | 'completato' | 'interrotto'

/**
 * Giro Apiario — sessione di ispezioni sul campo.
 * Relazione: N Giri → 1 Apiario.
 */
export type GiroApiario = {
  id: string
  apiarioId: string
  startedAt: number
  completedAt?: number
  stato: GiroApiarioStato
  /** Arnie ispezionate durante il giro. */
  arnieVisitateIds: string[]
  ispezioniCompletate: number
  durataSecondi?: number
  trattamenti?: number
  foto?: number
  noteInserite?: number
  regineDaControllare?: number
  createdAt: number
  updatedAt: number
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
