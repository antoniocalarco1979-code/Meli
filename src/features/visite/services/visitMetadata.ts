import type { Visita, VisitaInput } from '../../../database/types'

export const VISIT_METADATI_MARKER = '[METADATI VISITA]'
export const VISIT_METEO_PLACEHOLDER = 'Non registrato'
export const VISIT_OPERATORE_DEFAULT = 'Apicoltore'

export type ParsedVisitMetadata = {
  timestamp?: number
  operatore?: string
  meteo?: string
  temperatura?: string
}

function formatTemperaturaLabel(value?: number): string {
  if (value == null || Number.isNaN(value)) return '—'
  return `${value}°C`
}

export function buildVisitMetadataBlock(params: {
  timestamp: number
  operatore: string
  meteo: string
  temperatura: string
}): string {
  const iso = new Date(params.timestamp).toISOString()
  return [
    VISIT_METADATI_MARKER,
    `Timestamp: ${iso}`,
    `Operatore: ${params.operatore}`,
    `Meteo: ${params.meteo}`,
    `Temperatura: ${params.temperatura}`,
  ].join('\n')
}

export function stripVisitMetadataBlock(note?: string): string {
  if (!note) return ''
  const markerIndex = note.indexOf(VISIT_METADATI_MARKER)
  if (markerIndex < 0) return note.trim()

  const before = note.slice(0, markerIndex).trim()
  const afterMarker = note.slice(markerIndex + VISIT_METADATI_MARKER.length)
  const afterLines = afterMarker.split('\n').slice(1)
  const restStart = afterLines.findIndex((line) => line.trim().length > 0)
  const rest = restStart >= 0 ? afterLines.slice(restStart).join('\n').trim() : ''

  return [before, rest].filter(Boolean).join('\n\n').trim()
}

export function appendVisitMetadataBlock(note: string | undefined, block: string): string {
  const cleaned = stripVisitMetadataBlock(note)
  return cleaned ? `${cleaned}\n\n${block}` : block
}

export function parseVisitMetadata(note?: string): ParsedVisitMetadata | null {
  if (!note?.includes(VISIT_METADATI_MARKER)) return null

  const section = note.slice(note.indexOf(VISIT_METADATI_MARKER))
  const timestampMatch = section.match(/^Timestamp:\s*(.+)$/m)
  const operatoreMatch = section.match(/^Operatore:\s*(.+)$/m)
  const meteoMatch = section.match(/^Meteo:\s*(.+)$/m)
  const temperaturaMatch = section.match(/^Temperatura:\s*(.+)$/m)

  const parsed: ParsedVisitMetadata = {}

  if (timestampMatch?.[1]) {
    const ms = Date.parse(timestampMatch[1].trim())
    if (!Number.isNaN(ms)) parsed.timestamp = ms
  }
  if (operatoreMatch?.[1]) parsed.operatore = operatoreMatch[1].trim()
  if (meteoMatch?.[1]) parsed.meteo = meteoMatch[1].trim()
  if (temperaturaMatch?.[1]) parsed.temperatura = temperaturaMatch[1].trim()

  return parsed
}

export function enrichVisitaInputForSave(input: VisitaInput): VisitaInput {
  const timestamp = input.data ?? Date.now()
  const meteo = input.meteo?.trim() || VISIT_METEO_PLACEHOLDER
  const meteoForMetadata = input.meteo?.trim() || VISIT_METEO_PLACEHOLDER
  const temperaturaForMetadata = formatTemperaturaLabel(input.temperatura)

  const metadataBlock = buildVisitMetadataBlock({
    timestamp,
    operatore: VISIT_OPERATORE_DEFAULT,
    meteo: meteoForMetadata,
    temperatura: temperaturaForMetadata,
  })

  return {
    ...input,
    data: timestamp,
    meteo,
    note: appendVisitMetadataBlock(input.note, metadataBlock),
  }
}

export function resolveVisitOperatore(visita: Pick<Visita, 'note'>): string {
  return parseVisitMetadata(visita.note)?.operatore ?? '—'
}

export function resolveVisitMeteo(visita: Pick<Visita, 'meteo' | 'note'>): string {
  const fromField = visita.meteo?.trim()
  if (fromField) return fromField

  const fromMetadata = parseVisitMetadata(visita.note)?.meteo
  if (fromMetadata) return fromMetadata

  return '—'
}

export function resolveVisitTemperatura(visita: Pick<Visita, 'temperatura' | 'note'>): string {
  if (visita.temperatura != null && !Number.isNaN(visita.temperatura)) {
    return `${visita.temperatura}°C`
  }

  const fromMetadata = parseVisitMetadata(visita.note)?.temperatura
  if (fromMetadata && fromMetadata !== '—') return fromMetadata

  return '—'
}

export function extractTimelineUserNote(note?: string): string | undefined {
  if (!note?.trim()) return undefined

  const text = stripVisitMetadataBlock(note)
  const protocolMarkers = ['Protocollo ispezione v2:', 'Protocollo campo:']

  for (const marker of protocolMarkers) {
    const idx = text.indexOf(marker)
    if (idx < 0) continue

    const userPart = text
      .slice(0, idx)
      .split('\n')
      .filter((line) => !line.trim().startsWith('GPS:'))
      .join('\n')
      .trim()

    if (userPart) return userPart

    if (marker === 'Protocollo ispezione v2:') {
      const vassoioNoteMatch = text.match(/Note vassoio:\s*(.+)/i)
      if (vassoioNoteMatch?.[1]?.trim()) return vassoioNoteMatch[1].trim()
    }

    return undefined
  }

  const plain = text
    .split('\n')
    .filter((line) => !line.trim().startsWith('GPS:'))
    .join('\n')
    .trim()

  return plain || undefined
}
