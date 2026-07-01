import type { TelainoVisitaRecord } from '../types/telainoPanel.types'
import {
  TELAINO_CELLE_REALI_OPTIONS,
  TELAINO_COVATA_OPTIONS,
  TELAINO_QUANTITA_OPTIONS,
  TELAINO_REGINA_OPTIONS,
  TELAINO_UOVA_OPTIONS,
  TELAINO_VARROA_OPTIONS,
  isTelainoVisitaTouched,
} from '../types/telainoPanel.types'

function labelFrom<T extends string>(
  options: { value: T; label: string }[],
  value: T | null | undefined,
): string {
  if (!value) return '—'
  return options.find((option) => option.value === value)?.label ?? value
}

function formatCelleReali(record: TelainoVisitaRecord): string {
  if (!record.celleReali) return '—'
  if (record.celleReali === 'numero' && record.celleRealiNumero != null) {
    return `${record.celleRealiNumero} celle`
  }
  return labelFrom(TELAINO_CELLE_REALI_OPTIONS, record.celleReali)
}

function formatVarroa(record: TelainoVisitaRecord): string {
  if (!record.varroa) return '—'
  if (record.varroa === 'numero' && record.varroaNumero != null) {
    return `${record.varroaNumero} acari`
  }
  return labelFrom(TELAINO_VARROA_OPTIONS, record.varroa)
}

export function formatTelainoVisitaBlock(record: TelainoVisitaRecord): string {
  if (!isTelainoVisitaTouched(record)) return ''

  return [
    `Telaino ${record.numero}:`,
    `  Regina: ${labelFrom(TELAINO_REGINA_OPTIONS, record.regina)}`,
    `  Uova: ${labelFrom(TELAINO_UOVA_OPTIONS, record.uova)}`,
    `  Covata aperta: ${labelFrom(TELAINO_COVATA_OPTIONS, record.covataAperta)}`,
    `  Covata opercolata: ${labelFrom(TELAINO_COVATA_OPTIONS, record.covataOpercolata)}`,
    `  Miele: ${labelFrom(TELAINO_QUANTITA_OPTIONS, record.miele)}`,
    `  Polline: ${labelFrom(TELAINO_QUANTITA_OPTIONS, record.polline)}`,
    `  Celle reali: ${formatCelleReali(record)}`,
    `  Varroa: ${formatVarroa(record)}`,
    record.note.trim() ? `  Note: ${record.note.trim()}` : null,
  ]
    .filter(Boolean)
    .join('\n')
}

export function formatTelainiVisitaSection(telaini: TelainoVisitaRecord[]): string {
  const blocks = telaini.map(formatTelainoVisitaBlock).filter(Boolean)
  if (blocks.length === 0) return ''
  return ['Telaini ispezionati:', ...blocks].join('\n')
}

export function deriveReginaVistaFromTelaini(telaini: TelainoVisitaRecord[]): boolean | undefined {
  if (telaini.some((item) => item.regina === 'vista')) return true
  if (telaini.some((item) => item.regina === 'non_vista')) return false
  return undefined
}

export function deriveCelleRealiPresentiFromTelaini(
  telaini: TelainoVisitaRecord[],
): boolean | null {
  const saved = telaini.filter((item) => item.savedAt != null)
  if (saved.length === 0) return null
  return saved.some(
    (item) =>
      item.celleReali === 'presenti' ||
      (item.celleReali === 'numero' && (item.celleRealiNumero ?? 0) > 0),
  )
}

export function collectVisitaGuidataNotes(state: {
  affumicatore: { note: string }
  melario: { note: string }
  escludiRegina: { note: string }
  nido: { note: string }
  interventi: { items: { label: string; note: string }[] }
}): string {
  const parts = [
    state.affumicatore.note.trim() ? `Affumicatore: ${state.affumicatore.note.trim()}` : null,
    state.melario.note.trim() ? `Melario: ${state.melario.note.trim()}` : null,
    state.escludiRegina.note.trim() ? `Escludi regina: ${state.escludiRegina.note.trim()}` : null,
    state.nido.note.trim() ? `Nido: ${state.nido.note.trim()}` : null,
    ...state.interventi.items
      .filter((item) => item.note.trim())
      .map((item) => `${item.label}: ${item.note.trim()}`),
  ].filter(Boolean)

  return parts.length > 0 ? parts.join('\n') : '—'
}

export function collectTelainiPhotos(telaini: TelainoVisitaRecord[]): string[] {
  return telaini.map((item) => item.foto).filter((path): path is string => Boolean(path))
}
