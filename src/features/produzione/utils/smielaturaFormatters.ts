import type { SmielaturaInput } from '../../../database/types'
import { formatFullDate } from '../../../utils/dateFormatters'
import {
  dateInputToTimestamp,
  timestampToDateInput,
} from '../../trattamenti/utils/trattamentoFormatters'
import type { SmielaturaFormDraft } from '../types/smielatura.types'

export function emptySmielaturaFormDraft(apiarioId = ''): SmielaturaFormDraft {
  return {
    apiarioId,
    data: timestampToDateInput(Date.now()),
    arnieCoinvolteIds: [],
    numeroMelari: '',
    kg: '',
    umidita: '',
    note: '',
  }
}

export function formDraftToSmielaturaInput(draft: SmielaturaFormDraft): SmielaturaInput | null {
  const apiarioId = draft.apiarioId.trim()
  const data = dateInputToTimestamp(draft.data)
  const kg = Number.parseFloat(draft.kg.replace(',', '.'))
  const numeroMelari = Number.parseInt(draft.numeroMelari, 10)
  const umiditaRaw = draft.umidita.trim()
  const umidita = umiditaRaw ? Number.parseFloat(umiditaRaw.replace(',', '.')) : undefined

  if (!apiarioId || !data || !Number.isFinite(kg) || kg <= 0) return null
  if (!Number.isFinite(numeroMelari) || numeroMelari < 0) return null
  if (umiditaRaw && (!Number.isFinite(umidita) || umidita! < 0 || umidita! > 100)) return null

  return {
    apiarioId,
    data,
    kg,
    numeroMelari,
    arnieCoinvolteIds: draft.arnieCoinvolteIds.length ? draft.arnieCoinvolteIds : undefined,
    umidita,
    note: draft.note.trim() || undefined,
  }
}

export function formatSmielaturaDataLabel(timestamp?: number): string {
  if (!timestamp) return '—'
  return formatFullDate(timestamp)
}

export function formatKgLabel(kg: number): string {
  const value = Number.isInteger(kg) ? String(kg) : kg.toFixed(1)
  return `${value} kg`
}

export function formatMelariLabel(numeroMelari?: number): string {
  if (numeroMelari == null) return '—'
  return `${numeroMelari} melari`
}

export function formatUmiditaLabel(umidita?: number): string | undefined {
  if (umidita == null) return undefined
  return `${umidita}%`
}
