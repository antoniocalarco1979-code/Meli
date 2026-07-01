import type { Arnia } from '../../../database/types'
import type {
  GemelloDigitaleModel,
  MelarioGemelloModel,
  TelainoGemelloModel,
  TelainoHistoryEntry,
  TelainoSimulatedSnapshot,
  TelainoTimelineEvent,
} from '../types/gemelloDigitale.types'

const MOCK_SNAPSHOTS: TelainoSimulatedSnapshot[] = [
  {
    covata: 'Buona',
    polline: 'Buono',
    scorte: 'Buone',
    api: 'Normali',
    regina: 'Non vista',
    varroa: 'Assente',
    note: 'Famiglia vigorosa.',
  },
  {
    covata: 'Poca',
    polline: 'Scarso',
    scorte: 'Poche',
    api: 'Poche',
    regina: 'Vista',
    varroa: 'Da monitorare',
    note: 'Controllare scorte entro 7 giorni.',
  },
  {
    covata: 'Assente',
    polline: 'Medio',
    scorte: 'Medie',
    api: 'Normali',
    regina: 'Non vista',
    varroa: 'Assente',
    note: 'Telaino di riserva.',
  },
]

const ACCENT_COLORS = ['#c9a227', '#5a9e4b', '#e8960c', '#8b6914', '#6b8cce']

function createHistory(numero: number, current: TelainoSimulatedSnapshot): TelainoHistoryEntry[] {
  const base = Date.now() - numero * 86_400_000
  return [
    {
      id: `hist-${numero}-1`,
      at: base - 604_800_000,
      label: 'Ispezione simulata',
      snapshot: MOCK_SNAPSHOTS[(numero + 1) % MOCK_SNAPSHOTS.length]!,
    },
    {
      id: `hist-${numero}-2`,
      at: base,
      label: 'Ultimo stato simulato',
      snapshot: current,
    },
  ]
}

function createTimeline(numero: number): TelainoTimelineEvent[] {
  return [
    {
      id: `tl-${numero}-1`,
      at: Date.now() - numero * 172_800_000,
      label: `Telaino ${numero} · controllo rapido`,
      kind: 'ispezione',
    },
  ]
}

function createTelaino(index: number): TelainoGemelloModel {
  const numero = index + 1
  const current = MOCK_SNAPSHOTS[index % MOCK_SNAPSHOTS.length]!

  return {
    id: `gemello-telaino-${numero}`,
    numero,
    visual: {
      accentColor: ACCENT_COLORS[index % ACCENT_COLORS.length],
    },
    current,
    history: createHistory(numero, current),
    photos: [],
    timeline: createTimeline(numero),
  }
}

function createMelari(hasMelario: boolean): MelarioGemelloModel[] {
  if (!hasMelario) return []

  return [
    {
      id: 'gemello-melario-2',
      label: 'Melario superiore',
      stackIndex: 2,
      visual: { accentColor: '#f0d090' },
    },
    {
      id: 'gemello-melario-1',
      label: 'Melario',
      stackIndex: 1,
      visual: { accentColor: '#d4a85a' },
    },
  ]
}

/**
 * Modello simulato con struttura definitiva per Gemello Digitale v1.
 */
export function createSimulatedGemelloModel(
  arnia: Pick<Arnia, 'numero' | 'numeroTelai' | 'hasMelario' | 'hasVassoioAntivarroa'>,
): GemelloDigitaleModel {
  const telainiCount = Math.max(arnia.numeroTelai, 1)

  return {
    arniaNumero: arnia.numero,
    melari: createMelari(arnia.hasMelario),
    escludiRegina: {
      id: 'gemello-escludi-regina',
      label: 'Escludi regina',
      visual: { accentColor: '#cfc4b4' },
    },
    nido: {
      id: 'gemello-nido',
      label: 'Nido',
      telaini: Array.from({ length: telainiCount }, (_, index) => createTelaino(index)),
    },
    hasVassoio: arnia.hasVassoioAntivarroa,
  }
}

/** @deprecated */
export const buildGemelloStructure = createSimulatedGemelloModel
