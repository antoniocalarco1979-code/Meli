import type { Trattamento, TrattamentoInput } from '../../../database/types'
import { formatFullDate } from '../../../utils/dateFormatters'
import { TRATTAMENTO_METODI, TRATTAMENTO_TIPI } from '../constants/trattamentoConstants'
import type { TrattamentoFormDraft } from '../types/trattamento.types'

export function formatTrattamentoTipoLabel(tipo?: string): string {
  if (!tipo?.trim()) return '—'
  return TRATTAMENTO_TIPI.find((item) => item.value === tipo)?.label ?? tipo
}

export function formatTrattamentoMetodoLabel(metodo?: string): string {
  if (!metodo?.trim()) return '—'
  return TRATTAMENTO_METODI.find((item) => item.value === metodo)?.label ?? metodo
}

export function formatTrattamentoPrincipio(t: Pick<Trattamento, 'principioAttivo' | 'prodotto'>): string {
  return t.principioAttivo?.trim() || t.prodotto?.trim() || '—'
}

export function emptyTrattamentoFormDraft(): TrattamentoFormDraft {
  return {
    tipo: 'varroa',
    principioAttivo: '',
    data: timestampToDateInput(Date.now()),
    dose: '',
    metodo: 'strip',
    note: '',
    scadenza: '',
  }
}

export function trattamentoPayloadToFormDraft(
  payload?: Partial<Omit<TrattamentoInput, 'arniaId'>>,
  visitaData?: number,
): TrattamentoFormDraft {
  const base = emptyTrattamentoFormDraft()
  if (!payload) {
    if (visitaData) base.data = timestampToDateInput(visitaData)
    return base
  }

  return {
    tipo: payload.tipo ?? base.tipo,
    principioAttivo: payload.principioAttivo ?? payload.prodotto ?? base.principioAttivo,
    data: visitaData ? timestampToDateInput(visitaData) : base.data,
    dose: payload.dose ?? base.dose,
    metodo: payload.metodo ?? base.metodo,
    note: payload.note ?? base.note,
    scadenza: timestampToDateInput(payload.scadenza ?? payload.dataProgrammata) || base.scadenza,
  }
}

export function trattamentoToFormDraft(trattamento: Trattamento): TrattamentoFormDraft {
  return {
    tipo: trattamento.tipo ?? 'altro',
    principioAttivo: trattamento.principioAttivo ?? trattamento.prodotto ?? '',
    data: timestampToDateInput(trattamento.data),
    dose: trattamento.dose ?? '',
    metodo: trattamento.metodo ?? '',
    note: trattamento.note ?? '',
    scadenza: timestampToDateInput(trattamento.scadenza),
  }
}

export function formDraftToTrattamentoInput(
  draft: TrattamentoFormDraft,
): Partial<Omit<TrattamentoInput, 'arniaId'>> {
  return {
    tipo: draft.tipo || undefined,
    principioAttivo: draft.principioAttivo.trim() || undefined,
    prodotto: draft.principioAttivo.trim() || undefined,
    data: dateInputToTimestamp(draft.data) ?? Date.now(),
    dose: draft.dose.trim() || undefined,
    metodo: draft.metodo || undefined,
    note: draft.note.trim() || undefined,
    scadenza: dateInputToTimestamp(draft.scadenza),
    dataProgrammata: dateInputToTimestamp(draft.scadenza),
  }
}

export function formatTrattamentoSummary(
  payload: Partial<Omit<TrattamentoInput, 'arniaId'>>,
): string {
  const parts = [
    formatTrattamentoTipoLabel(payload.tipo),
    payload.principioAttivo ?? payload.prodotto,
    payload.dose ? `dose ${payload.dose}` : undefined,
    payload.metodo ? formatTrattamentoMetodoLabel(payload.metodo) : undefined,
  ].filter(Boolean)
  return parts.join(' · ') || 'Trattamento'
}

export function timestampToDateInput(timestamp?: number): string {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function dateInputToTimestamp(value: string): number | undefined {
  if (!value.trim()) return undefined
  const parsed = new Date(`${value}T12:00:00`)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.getTime()
}

export function formatTrattamentoDataLabel(timestamp?: number): string {
  if (!timestamp) return '—'
  return formatFullDate(timestamp)
}
