import type {
  VisitaCronologiaDetail,
  VisitaCronologiaIntervento,
  VisitaCronologiaTelaino,
} from '../types/visitaCronologia.types'
import { stripVisitMetadataBlock } from './visitMetadata'

const GUIDATA_MARKER = '--- Visita guidata MELI'

const TELAINO_FIELD_MAP: Record<string, keyof VisitaCronologiaTelaino> = {
  Regina: 'regina',
  Uova: 'uova',
  'Covata aperta': 'covataAperta',
  'Covata opercolata': 'covataOpercolata',
  Miele: 'miele',
  Polline: 'polline',
  'Celle reali': 'celleReali',
  Varroa: 'varroa',
  Note: 'note',
}

function parseDurataSec(label: string): number | undefined {
  const match = label.trim().match(/^(\d+):(\d{2})$/)
  if (!match) return undefined
  return Number(match[1]) * 60 + Number(match[2])
}

function readKeyValue(line: string): { key: string; value: string } | null {
  const index = line.indexOf(':')
  if (index <= 0) return null
  return {
    key: line.slice(0, index).trim(),
    value: line.slice(index + 1).trim(),
  }
}

function parseTelainiSection(lines: string[]): VisitaCronologiaTelaino[] {
  const telaini: VisitaCronologiaTelaino[] = []
  let current: VisitaCronologiaTelaino | null = null

  for (const line of lines) {
    const telainoMatch = line.match(/^Telaino\s+(\d+):?\s*$/)
    if (telainoMatch) {
      if (current) telaini.push(current)
      current = { numero: Number(telainoMatch[1]) }
      continue
    }

    if (!current) continue

    const kv = readKeyValue(line.trim())
    if (!kv) continue

    const field = TELAINO_FIELD_MAP[kv.key]
    if (field && field !== 'numero') {
      current[field] = kv.value
    }
  }

  if (current) telaini.push(current)
  return telaini.sort((a, b) => a.numero - b.numero)
}

function parseInterventiSection(lines: string[]): VisitaCronologiaIntervento[] {
  return lines
    .map((line) => line.replace(/^-\s*/, '').trim())
    .filter(Boolean)
    .map((line) => {
      const kv = readKeyValue(line)
      if (kv) return { label: kv.key, note: kv.value }
      return { label: line }
    })
}

export function parseVisitaGuidataNote(note?: string): VisitaCronologiaDetail {
  const cleaned = stripVisitMetadataBlock(note ?? '')
  const isGuidata = cleaned.includes(GUIDATA_MARKER)

  if (!isGuidata) {
    return {
      isGuidata: false,
      interventi: [],
      telaini: [],
      riepilogoLines: [],
    }
  }

  const lines = cleaned.split('\n')
  const detail: VisitaCronologiaDetail = {
    isGuidata: true,
    interventi: [],
    telaini: [],
    riepilogoLines: [],
  }

  let section: 'none' | 'telaini' | 'interventi' = 'none'
  const telainiBuffer: string[] = []
  const interventiBuffer: string[] = []

  for (const rawLine of lines) {
    const line = rawLine.trimEnd()
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith('---')) continue

    if (trimmed === 'Telaini ispezionati:') {
      section = 'telaini'
      continue
    }
    if (trimmed === 'Interventi effettuati:') {
      section = 'interventi'
      continue
    }
    if (trimmed.startsWith('Bridge interventi:')) continue

    if (section === 'telaini') {
      telainiBuffer.push(line)
      continue
    }
    if (section === 'interventi') {
      interventiBuffer.push(trimmed)
      continue
    }

    const kv = readKeyValue(trimmed)
    if (!kv) continue

    switch (kv.key) {
      case 'Sessione':
        detail.sessionId = kv.value
        break
      case 'Durata':
        detail.durataLabel = kv.value
        detail.durataSec = parseDurataSec(kv.value)
        break
      case 'Meteo':
        detail.meteo = kv.value
        break
      case 'Affumicatore utilizzato':
        detail.affumicatore = kv.value
        detail.riepilogoLines.push({ label: 'Affumicatore', value: kv.value })
        break
      case 'Melario presente':
        detail.melario = kv.value
        detail.riepilogoLines.push({ label: 'Melario', value: kv.value })
        break
      case 'Escludi regina':
        detail.escludiRegina = kv.value
        break
      case 'Regina':
        detail.regina = kv.value
        detail.riepilogoLines.push({ label: 'Regina vista', value: kv.value })
        break
      case 'Varroa vassoio':
        detail.varroaVassoio = kv.value
        break
      case 'Note nido':
        detail.noteNido = kv.value
        break
      case 'Celle reali presenti':
        detail.celleRealiPresenti = kv.value
        detail.riepilogoLines.push({ label: 'Celle reali', value: kv.value })
        break
      default:
        if (kv.key.startsWith('Note ')) {
          detail.riepilogoLines.push({ label: kv.key, value: kv.value })
        }
        break
    }
  }

  detail.telaini = parseTelainiSection(telainiBuffer)
  detail.interventi = parseInterventiSection(interventiBuffer)

  if (detail.telaini.length > 0) {
    detail.riepilogoLines.push({
      label: 'Telaini controllati',
      value: String(detail.telaini.length),
    })
  }

  return detail
}
