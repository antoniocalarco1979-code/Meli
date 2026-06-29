import type { Visita } from '../../../database/types'
import {
  ACARI_STIMATI_ALTI_SOGLIA,
  computeIspezioneSummary,
  isTelainoComplete,
  TELAINO_API_OPTIONS,
  TELAINO_CELLE_REALI_OPTIONS,
  TELAINO_COVATA_OPTIONS,
  TELAINO_POLLINE_OPTIONS,
  TELAINO_PROBLEMI_OPTIONS,
  TELAINO_REGINA_OPTIONS,
  TELAINO_SCORTE_OPTIONS,
  VASSOIO_ALTRI_INSETTI_OPTIONS,
  VASSOIO_RESIDUI_CERA_OPTIONS,
  VASSOIO_UMIDITA_SPORCO_OPTIONS,
  VASSOIO_VARROA_OPTIONS,
  type IspezioneWizardState,
  type TelainoInspection,
  type VassoioAntivarroa,
} from '../types/ispezioneWizard.types'

export type ParsedIspezioneNote = {
  isV2: boolean
  vassoioVarroa: string | null
  acariStimati: number | null
  telaiTotali: number
  telaiConCelleReali: boolean
  telaiScorteScarseCount: number
  reginaVistaSuTelai: boolean
  covataAssenteSuTuttiTelai: boolean
  problemiTelai: string[]
  vassoioRiepilogo: string
}

function labelFrom<T extends string>(
  options: { value: T; label: string }[],
  value: T | null | undefined,
): string {
  if (!value) return '—'
  return options.find((o) => o.value === value)?.label ?? value
}

function formatTelainoLine(telaino: TelainoInspection): string {
  return [
    `#${telaino.numero}`,
    `covata:${telaino.covata ?? '-'}`,
    `polline:${telaino.polline ?? '-'}`,
    `scorte:${telaino.scorteMiele ?? '-'}`,
    `regina:${telaino.reginaVista ?? '-'}`,
    `celle:${telaino.celleReali ?? '-'}`,
    `api:${telaino.apiPresenti ?? '-'}`,
    `prob:${telaino.problemi ?? '-'}`,
    `note:${telaino.note.trim() || '-'}`,
  ].join(' | ')
}

function buildVassoioBlock(vassoio: VassoioAntivarroa): string[] {
  const lines = [
    '[VASSOIO]',
    `Varroa: ${labelFrom(VASSOIO_VARROA_OPTIONS, vassoio.varroaPresente)}`,
    `Acari stimati: ${vassoio.acariStimati ?? '—'}`,
    `Residui cera: ${labelFrom(VASSOIO_RESIDUI_CERA_OPTIONS, vassoio.residuiCera)}`,
    `Altri insetti: ${labelFrom(VASSOIO_ALTRI_INSETTI_OPTIONS, vassoio.altriInsetti)}`,
    `Umidità/sporco: ${labelFrom(VASSOIO_UMIDITA_SPORCO_OPTIONS, vassoio.umiditaSporco)}`,
  ]
  if (vassoio.note.trim()) {
    lines.push(`Note vassoio: ${vassoio.note.trim()}`)
  }
  return lines
}

export function buildIspezioneStructuredNote(state: IspezioneWizardState): string {
  const summary = computeIspezioneSummary(state)
  const completeTelai = state.telai.filter(isTelainoComplete)
  const problemiLabel = summary.problemi.length > 0 ? summary.problemi.join(', ') : 'nessuno'
  const acariPart =
    summary.vassoioAcariStimati != null ? ` (${summary.vassoioAcariStimati} acari)` : ''

  const lines = [
    'Protocollo ispezione v2:',
    ...buildVassoioBlock(state.vassoio),
    '',
    '[RIEPILOGO]',
    `Telai controllati: ${summary.totaleTelai}`,
    `Telai con covata: ${summary.telaiConCovata}`,
    `Telai scorte buone: ${summary.telaiScorteBuone}`,
    `Regina vista: ${summary.reginaVista ? 'Sì' : 'No'}`,
    `Problemi: ${problemiLabel}`,
    `Vassoio: Varroa ${summary.vassoioVarroaLabel}${acariPart}`,
    '',
    '[TELAI]',
    ...completeTelai.map(formatTelainoLine),
  ]

  return lines.join('\n')
}

function parseTelainoLine(line: string): TelainoInspection | null {
  const match = line.match(/^#(\d+)/)
  if (!match) return null

  const fields: Record<string, string> = {}
  for (const part of line.split('|').slice(1)) {
    const [key, ...rest] = part.trim().split(':')
    if (key) fields[key.trim()] = rest.join(':').trim()
  }

  const read = <T extends string>(key: string): T | null => {
    const val = fields[key]
    return val && val !== '-' ? (val as T) : null
  }

  return {
    id: crypto.randomUUID(),
    numero: Number.parseInt(match[1], 10),
    covata: read('covata'),
    polline: read('polline'),
    scorteMiele: read('scorte'),
    reginaVista: read('regina'),
    celleReali: read('celle'),
    apiPresenti: read('api'),
    problemi: read('prob'),
    note: fields.note && fields.note !== '-' ? fields.note : '',
  }
}

export function parseIspezioneNote(note?: string): ParsedIspezioneNote {
  const empty: ParsedIspezioneNote = {
    isV2: false,
    vassoioVarroa: null,
    acariStimati: null,
    telaiTotali: 0,
    telaiConCelleReali: false,
    telaiScorteScarseCount: 0,
    reginaVistaSuTelai: false,
    covataAssenteSuTuttiTelai: false,
    problemiTelai: [],
    vassoioRiepilogo: '—',
  }

  if (!note?.includes('Protocollo ispezione v2:')) return empty

  const vassoioVarroaMatch = note.match(/Varroa:\s*(.+)/i)
  const acariMatch = note.match(/Acari stimati:\s*(\d+|—)/i)
  const telaiMatch = note.match(/Telai controllati:\s*(\d+)/i)
  const vassoioRiepilogoMatch = note.match(/Vassoio:\s*(.+)/i)

  const telaiSection = note.split('[TELAI]')[1] ?? ''
  const telai = telaiSection
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('#'))
    .map(parseTelainoLine)
    .filter((t): t is TelainoInspection => t !== null)

  const completeTelai = telai.filter(isTelainoComplete)
  const telaiScorteScarseCount = completeTelai.filter(
    (t) => t.scorteMiele === 'assenti' || t.scorteMiele === 'poche',
  ).length

  return {
    isV2: true,
    vassoioVarroa: vassoioVarroaMatch?.[1]?.trim() ?? null,
    acariStimati:
      acariMatch?.[1] && acariMatch[1] !== '—' ? Number.parseInt(acariMatch[1], 10) : null,
    telaiTotali: telaiMatch ? Number.parseInt(telaiMatch[1], 10) : completeTelai.length,
    telaiConCelleReali: completeTelai.some((t) => t.celleReali === 'presenti'),
    telaiScorteScarseCount,
    reginaVistaSuTelai: completeTelai.some((t) => t.reginaVista === 'si'),
    covataAssenteSuTuttiTelai:
      completeTelai.length > 0 && completeTelai.every((t) => t.covata === 'assente'),
    problemiTelai: [
      ...new Set(
        completeTelai
          .map((t) => t.problemi)
          .filter((p): p is Exclude<typeof p, null | 'nessuno'> => p !== null && p !== 'nessuno'),
      ),
    ],
    vassoioRiepilogo: vassoioRiepilogoMatch?.[1]?.trim() ?? '—',
  }
}

export function isAcariStimatiAlti(acari: number | null | undefined): boolean {
  return acari != null && acari >= ACARI_STIMATI_ALTI_SOGLIA
}

export function isVarroaVassoioPositiva(varroa: string | null | undefined): boolean {
  return varroa?.toLowerCase() === 'sì' || varroa?.toLowerCase() === 'si'
}

/** Etichetta telaino per display (usata internamente dal mapper). */
export function telainoFieldLabels(telaino: TelainoInspection) {
  return {
    covata: labelFrom(TELAINO_COVATA_OPTIONS, telaino.covata),
    polline: labelFrom(TELAINO_POLLINE_OPTIONS, telaino.polline),
    scorte: labelFrom(TELAINO_SCORTE_OPTIONS, telaino.scorteMiele),
    regina: labelFrom(TELAINO_REGINA_OPTIONS, telaino.reginaVista),
    celle: labelFrom(TELAINO_CELLE_REALI_OPTIONS, telaino.celleReali),
    api: labelFrom(TELAINO_API_OPTIONS, telaino.apiPresenti),
    problemi: labelFrom(TELAINO_PROBLEMI_OPTIONS, telaino.problemi),
  }
}

export function getParsedIspezioneFromVisita(visita?: Visita): ParsedIspezioneNote {
  return parseIspezioneNote(visita?.note)
}
