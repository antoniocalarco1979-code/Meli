import type { VisitaInput } from '../../../database/types/inputs'
import type { SaluteScoreFlags } from '../../../utils/salute'
import {
  computeIspezioneSummary,
  isTelainoComplete,
  type IspezioneWizardState,
  type TelainoCovataChoice,
  type TelainoScorteChoice,
} from '../types/ispezioneWizard.types'
import { buildIspezioneStructuredNote } from './ispezioneNoteFormat'

const COVATA_RANK: Record<TelainoCovataChoice, number> = {
  assente: 0,
  poca: 1,
  buona: 2,
  abbondante: 3,
}

const SCORTE_RANK: Record<TelainoScorteChoice, number> = {
  assenti: 0,
  poche: 1,
  buone: 2,
  abbondanti: 3,
}

function aggregateCovata(telai: ReturnType<typeof filterCompleteTelai>): string | undefined {
  if (telai.length === 0) return undefined
  const best = telai.reduce((acc, t) => {
    const rank = COVATA_RANK[t.covata!]
    return rank > acc.rank ? { rank, value: t.covata! } : acc
  }, { rank: -1, value: 'assente' as TelainoCovataChoice })

  switch (best.value) {
    case 'abbondante':
      return 'Covata ottima'
    case 'buona':
      return 'Covata buona'
    case 'poca':
      return 'Covata scarsa'
    case 'assente':
      return 'Covata assente'
  }
}

function aggregateScorte(telai: ReturnType<typeof filterCompleteTelai>): string | undefined {
  if (telai.length === 0) return undefined
  const best = telai.reduce((acc, t) => {
    const rank = SCORTE_RANK[t.scorteMiele!]
    return rank > acc.rank ? { rank, value: t.scorteMiele! } : acc
  }, { rank: -1, value: 'assenti' as TelainoScorteChoice })

  switch (best.value) {
    case 'abbondanti':
      return 'Scorte abbondanti'
    case 'buone':
      return 'Scorte normali'
    case 'poche':
    case 'assenti':
      return 'Scorte scarse'
  }
}

function filterCompleteTelai(state: IspezioneWizardState) {
  return state.telai.filter(isTelainoComplete)
}

export function mapIspezioneToVisitaInput(
  arniaId: string,
  state: IspezioneWizardState,
): VisitaInput {
  const completeTelai = filterCompleteTelai(state)
  const summary = computeIspezioneSummary(state)
  const structuredNote = buildIspezioneStructuredNote(state)

  return {
    arniaId,
    data: Date.now(),
    covata: aggregateCovata(completeTelai),
    scorte: aggregateScorte(completeTelai),
    reginaVista: summary.reginaVista,
    note: structuredNote,
  }
}

export function collectIspezionePhotos(state: IspezioneWizardState): string[] {
  const photos: string[] = []
  if (state.vassoio.foto) photos.push(state.vassoio.foto)
  for (const telaino of state.telai) {
    if (telaino.foto) photos.push(telaino.foto)
  }
  return photos
}

export function buildSaluteFlagsFromIspezione(state: IspezioneWizardState): SaluteScoreFlags {
  const summary = computeIspezioneSummary(state)
  const completeTelai = filterCompleteTelai(state)
  const covataCompatta = completeTelai.some(
    (t) => t.covata === 'buona' || t.covata === 'abbondante',
  )
  const scorteAbbondanti = completeTelai.some(
    (t) => t.scorteMiele === 'abbondanti' || t.scorteMiele === 'buone',
  )
  const reginaPresente = summary.reginaVista
  const coloniaForte = reginaPresente && covataCompatta && scorteAbbondanti
  const nessunSintomo =
    summary.problemi.length === 0 &&
    state.vassoio.varroaPresente !== 'si' &&
    !completeTelai.some((t) => t.covata === 'assente' || t.scorteMiele === 'assenti')

  return {
    reginaPresente,
    covataCompatta,
    coloniaForte,
    scorteAbbondanti,
    nessunSintomo,
    ultimaVisitaRecente: true,
    trattamentiEseguiti: false,
  }
}
