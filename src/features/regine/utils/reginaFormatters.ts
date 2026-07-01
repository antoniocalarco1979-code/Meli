import type { Regina, ReginaInput, ReginaStatoOperativo } from '../../../database/types'
import { formatReginaColoreDisplay } from '../../arnie/utils/arniaFormatters'
import { REGINA_STATI } from '../constants/reginaConstants'
import type { ReginaFormDraft } from '../types/regina.types'

export function formatReginaStatoOperativo(stato?: ReginaStatoOperativo): string {
  if (!stato) return '—'
  return REGINA_STATI.find((item) => item.value === stato)?.label ?? stato
}

export function formatReginaDisplayTitle(regina: Pick<Regina, 'numero' | 'anno'>): string {
  const parts = [`#${regina.numero}`]
  if (regina.anno) parts.push(String(regina.anno))
  return parts.join(' · ')
}

export function formatReginaSubtitle(
  regina: Pick<Regina, 'razza'>,
  arniaNumero?: string,
): string {
  const parts: string[] = []
  if (arniaNumero) parts.push(`Arnia ${arniaNumero}`)
  if (regina.razza?.trim()) parts.push(regina.razza.trim())
  return parts.length > 0 ? parts.join(' · ') : 'Regina'
}

export function emptyReginaFormDraft(): ReginaFormDraft {
  return {
    numero: '',
    colore: '',
    anno: String(new Date().getFullYear()),
    razza: '',
    stato: 'fecondata',
    dataInserimento: timestampToDateInput(Date.now()),
    note: '',
  }
}

export function reginaToFormDraft(regina: Regina): ReginaFormDraft {
  return {
    numero: regina.numero,
    colore: regina.colore ?? '',
    anno: regina.anno != null ? String(regina.anno) : '',
    razza: regina.razza ?? '',
    stato: regina.stato ?? 'fecondata',
    dataInserimento: timestampToDateInput(regina.dataInserimento),
    note: regina.note ?? '',
  }
}

export function reginaPayloadToFormDraft(payload?: Partial<Omit<ReginaInput, 'arniaId'>>): ReginaFormDraft {
  const base = emptyReginaFormDraft()
  if (!payload) return base

  return {
    numero: payload.numero ?? base.numero,
    colore: payload.colore ?? base.colore,
    anno: payload.anno != null ? String(payload.anno) : base.anno,
    razza: payload.razza ?? base.razza,
    stato: payload.stato ?? base.stato,
    dataInserimento: timestampToDateInput(payload.dataInserimento) || base.dataInserimento,
    note: payload.note ?? base.note,
  }
}

export function formDraftToReginaInput(draft: ReginaFormDraft): Partial<Omit<ReginaInput, 'arniaId'>> {
  return {
    numero: draft.numero.trim(),
    colore: draft.colore || undefined,
    anno: parseReginaAnno(draft.anno),
    razza: draft.razza.trim() || undefined,
    stato: (draft.stato as ReginaStatoOperativo) || 'fecondata',
    dataInserimento: dateInputToTimestamp(draft.dataInserimento),
    note: draft.note.trim() || undefined,
  }
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

export function parseReginaAnno(value: string): number | undefined {
  if (!value.trim()) return undefined
  const parsed = parseInt(value, 10)
  return Number.isNaN(parsed) ? undefined : parsed
}

export function formatReginaColoreLabel(colore?: string): string | undefined {
  return formatReginaColoreDisplay(colore)
}

export { formatReginaColoreDisplay }
