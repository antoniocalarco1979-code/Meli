/** Sprint 1A.2 — modello telaino condiviso tra vista 2D Free e Gemello 3D Pro. */

export type TelainoReginaChoice = 'vista' | 'non_vista'

export type TelainoUovaChoice = 'assenti' | 'poche' | 'molte'

export type TelainoCovataChoice = 'assente' | 'bassa' | 'media' | 'alta'

export type TelainoQuantitaChoice = 'assente' | 'poco' | 'medio' | 'molto'

export type TelainoCelleRealiChoice = 'nessuna' | 'presenti' | 'numero'

export type TelainoVarroaChoice = 'nessuna' | 'numero'

/** Dati ispezione per singolo telaino — associati alla visita al salvataggio. */
export type TelainoVisitaRecord = {
  id: string
  numero: number
  regina: TelainoReginaChoice | null
  uova: TelainoUovaChoice | null
  covataAperta: TelainoCovataChoice | null
  covataOpercolata: TelainoCovataChoice | null
  miele: TelainoQuantitaChoice | null
  polline: TelainoQuantitaChoice | null
  celleReali: TelainoCelleRealiChoice | null
  celleRealiNumero: number | null
  varroa: TelainoVarroaChoice | null
  varroaNumero: number | null
  foto?: string
  note: string
  savedAt?: number
  updatedAt?: number
}

export const TELAINO_REGINA_OPTIONS: { value: TelainoReginaChoice; label: string }[] = [
  { value: 'vista', label: 'Vista' },
  { value: 'non_vista', label: 'Non vista' },
]

export const TELAINO_UOVA_OPTIONS: { value: TelainoUovaChoice; label: string; short: string }[] = [
  { value: 'assenti', label: 'Assenti', short: '0' },
  { value: 'poche', label: 'Poche', short: '1' },
  { value: 'molte', label: 'Molte', short: '2' },
]

export const TELAINO_COVATA_OPTIONS: { value: TelainoCovataChoice; label: string; short: string }[] = [
  { value: 'assente', label: 'Assente', short: '0' },
  { value: 'bassa', label: 'Bassa', short: '1' },
  { value: 'media', label: 'Media', short: '2' },
  { value: 'alta', label: 'Alta', short: '3' },
]

export const TELAINO_QUANTITA_OPTIONS: { value: TelainoQuantitaChoice; label: string; short: string }[] = [
  { value: 'assente', label: 'Assente', short: '0' },
  { value: 'poco', label: 'Poco', short: '1' },
  { value: 'medio', label: 'Medio', short: '2' },
  { value: 'molto', label: 'Molto', short: '3' },
]

export const TELAINO_CELLE_REALI_OPTIONS: { value: TelainoCelleRealiChoice; label: string }[] = [
  { value: 'nessuna', label: 'Nessuna' },
  { value: 'presenti', label: 'Presenti' },
  { value: 'numero', label: 'Numero' },
]

export const TELAINO_VARROA_OPTIONS: { value: TelainoVarroaChoice; label: string }[] = [
  { value: 'nessuna', label: 'Nessuna' },
  { value: 'numero', label: 'Numero acari' },
]

export function createTelainoVisitaRecord(numero: number): TelainoVisitaRecord {
  return {
    id: `telaino-${numero}`,
    numero,
    regina: null,
    uova: null,
    covataAperta: null,
    covataOpercolata: null,
    miele: null,
    polline: null,
    celleReali: null,
    celleRealiNumero: null,
    varroa: null,
    varroaNumero: null,
    note: '',
  }
}

export function createTelainiVisitaRecords(count: number): TelainoVisitaRecord[] {
  return Array.from({ length: Math.max(1, count) }, (_, index) =>
    createTelainoVisitaRecord(index + 1),
  )
}

export function isTelainoVisitaTouched(record: TelainoVisitaRecord): boolean {
  return (
    record.savedAt != null ||
    record.regina !== null ||
    record.uova !== null ||
    record.covataAperta !== null ||
    record.covataOpercolata !== null ||
    record.miele !== null ||
    record.polline !== null ||
    record.celleReali !== null ||
    record.celleRealiNumero != null ||
    record.varroa !== null ||
    record.varroaNumero != null ||
    Boolean(record.foto) ||
    Boolean(record.note.trim())
  )
}

export function isTelainoVisitaComplete(record: TelainoVisitaRecord): boolean {
  return record.savedAt != null
}

export function choiceToIndex<T extends string>(
  options: { value: T }[],
  value: T | null,
): number {
  if (!value) return 0
  const index = options.findIndex((option) => option.value === value)
  return index >= 0 ? index : 0
}

export function indexToChoice<T extends string>(options: { value: T }[], index: number): T {
  const clamped = Math.max(0, Math.min(index, options.length - 1))
  return options[clamped]?.value ?? options[0].value
}

/** Mappa ID telaino visita ↔ frame 3D (`frame-N`). */
export function telainoIdFromFrameId(frameId: string): string | null {
  const match = frameId.match(/^frame-(\d+)$/)
  return match ? `telaino-${match[1]}` : null
}

export function frameIdFromTelainoId(telainoId: string): string | null {
  const match = telainoId.match(/^telaino-(\d+)$/)
  return match ? `frame-${match[1]}` : null
}

export function gemelloTelainoIdFromNumero(numero: number): string {
  return `gemello-telaino-${numero}`
}

export function telainoNumeroFromId(id: string): number {
  const match = id.match(/(?:telaino|frame|gemello-telaino)-(\d+)/)
  return match ? Number(match[1]) : 0
}

export function countTelainiVisitaCompletati(telaini: TelainoVisitaRecord[]): number {
  return telaini.filter(isTelainoVisitaComplete).length
}

export function areAllTelainiVisitaCompletati(telaini: TelainoVisitaRecord[]): boolean {
  return telaini.length > 0 && telaini.every(isTelainoVisitaComplete)
}

export function getTelainoVisitaSuccessivo(
  telaini: TelainoVisitaRecord[],
  currentNumero: number,
): TelainoVisitaRecord | null {
  return telaini.find((item) => item.numero === currentNumero + 1) ?? null
}
