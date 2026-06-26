/**
 * Indice salute colonia — modello a punteggio (max 100).
 *
 * | Parametro                 | Peso |
 * | ------------------------- | ---: |
 * | Regina presente           |  +20 |
 * | Covata compatta           |  +20 |
 * | Colonia forte             |  +15 |
 * | Scorte abbondanti         |  +15 |
 * | Nessun sintomo            |  +10 |
 * | Ultima visita < 10 giorni |  +10 |
 * | Trattamenti eseguiti      |  +10 |
 */

import type { Trattamento, Visita } from '../../../database/types'
import type { VisitaChecklistState } from '../components/visitaGuidataSteps'

export const SALUTE_WEIGHTS = {
  reginaPresente: 20,
  covataCompatta: 20,
  coloniaForte: 15,
  scorteAbbondanti: 15,
  nessunSintomo: 10,
  ultimaVisitaRecente: 10,
  trattamentiEseguiti: 10,
} as const

export type SaluteScoreFlags = {
  reginaPresente: boolean
  covataCompatta: boolean
  coloniaForte: boolean
  scorteAbbondanti: boolean
  nessunSintomo: boolean
  ultimaVisitaRecente: boolean
  trattamentiEseguiti: boolean
}

export type SaluteScoreBreakdown = SaluteScoreFlags & {
  totale: number
}

const TRATTAMENTO_WINDOW_MS = 90 * 86_400_000
const VISITA_RECENTE_GIORNI = 10

export function computeSaluteScore(flags: SaluteScoreFlags): number {
  let totale = 0
  if (flags.reginaPresente) totale += SALUTE_WEIGHTS.reginaPresente
  if (flags.covataCompatta) totale += SALUTE_WEIGHTS.covataCompatta
  if (flags.coloniaForte) totale += SALUTE_WEIGHTS.coloniaForte
  if (flags.scorteAbbondanti) totale += SALUTE_WEIGHTS.scorteAbbondanti
  if (flags.nessunSintomo) totale += SALUTE_WEIGHTS.nessunSintomo
  if (flags.ultimaVisitaRecente) totale += SALUTE_WEIGHTS.ultimaVisitaRecente
  if (flags.trattamentiEseguiti) totale += SALUTE_WEIGHTS.trattamentiEseguiti
  return Math.max(0, Math.min(100, totale))
}

export function computeSaluteBreakdown(flags: SaluteScoreFlags): SaluteScoreBreakdown {
  return { ...flags, totale: computeSaluteScore(flags) }
}

function daysSince(timestamp: number, now = Date.now()): number {
  return Math.floor((now - timestamp) / 86_400_000)
}

function hasTrattamentoRecente(trattamento?: Trattamento, now = Date.now()): boolean {
  if (!trattamento) return false
  return now - trattamento.data < TRATTAMENTO_WINDOW_MS
}

function parseCovataCompatta(covata?: string): boolean {
  if (!covata) return false
  const value = covata.toLowerCase()
  return (
    value.includes('compatta') ||
    value.includes('opercolata') ||
    value.includes('controllata')
  )
}

function parseScorteAbbondanti(scorte?: string): boolean {
  if (!scorte) return false
  const value = scorte.toLowerCase()
  return (
    value.includes('abbondant') ||
    value.includes('controllat') ||
    value.includes('adeguat')
  )
}

function parseNessunSintomo(visita: Visita): boolean {
  if (visita.reginaVista === false) return false
  const covata = visita.covata?.toLowerCase() ?? ''
  const scorte = visita.scorte?.toLowerCase() ?? ''
  if (covata.includes('non controll') || scorte.includes('non controll')) return false
  const comportamento = visita.comportamento?.toLowerCase() ?? ''
  if (comportamento.includes('aggress') || comportamento.includes('malattia')) return false
  return true
}

function parseColoniaForte(visita: Visita, reginaPresente: boolean, covataCompatta: boolean, scorteAbbondanti: boolean): boolean {
  if (visita.forza !== undefined && visita.forza >= 7) return true
  return reginaPresente && covataCompatta && scorteAbbondanti
}

export function buildSaluteFlagsFromVisita(
  visita: Visita,
  trattamentoRecente?: Trattamento,
  now = Date.now(),
): SaluteScoreFlags {
  const reginaPresente = visita.reginaVista === true
  const covataCompatta = parseCovataCompatta(visita.covata)
  const scorteAbbondanti = parseScorteAbbondanti(visita.scorte)
  const coloniaForte = parseColoniaForte(visita, reginaPresente, covataCompatta, scorteAbbondanti)

  return {
    reginaPresente,
    covataCompatta,
    coloniaForte,
    scorteAbbondanti,
    nessunSintomo: parseNessunSintomo(visita),
    ultimaVisitaRecente: daysSince(visita.data, now) < VISITA_RECENTE_GIORNI,
    trattamentiEseguiti: hasTrattamentoRecente(trattamentoRecente, now),
  }
}

export function buildSaluteFlagsFromChecklist(
  checklist: VisitaChecklistState,
  hadTrattamento: boolean,
): SaluteScoreFlags {
  const reginaPresente = checklist.reginaVerificata === true
  const covataCompatta = checklist.covataControllata
  const scorteAbbondanti = checklist.scorteControllate
  const coloniaForte = reginaPresente && covataCompatta && scorteAbbondanti
  const nessunSintomo =
    checklist.reginaVerificata !== false && covataCompatta && scorteAbbondanti

  return {
    reginaPresente,
    covataCompatta,
    coloniaForte,
    scorteAbbondanti,
    nessunSintomo,
    ultimaVisitaRecente: true,
    trattamentiEseguiti: hadTrattamento,
  }
}

export const SALUTE_SCORE_LABELS: { key: keyof SaluteScoreFlags; label: string; weight: number }[] = [
  { key: 'reginaPresente', label: 'Regina presente', weight: SALUTE_WEIGHTS.reginaPresente },
  { key: 'covataCompatta', label: 'Covata compatta', weight: SALUTE_WEIGHTS.covataCompatta },
  { key: 'coloniaForte', label: 'Colonia forte', weight: SALUTE_WEIGHTS.coloniaForte },
  { key: 'scorteAbbondanti', label: 'Scorte abbondanti', weight: SALUTE_WEIGHTS.scorteAbbondanti },
  { key: 'nessunSintomo', label: 'Nessun sintomo', weight: SALUTE_WEIGHTS.nessunSintomo },
  { key: 'ultimaVisitaRecente', label: 'Ultima visita < 10 giorni', weight: SALUTE_WEIGHTS.ultimaVisitaRecente },
  { key: 'trattamentiEseguiti', label: 'Trattamenti eseguiti', weight: SALUTE_WEIGHTS.trattamentiEseguiti },
]

export function computeSaluteFromVisita(
  visita: Visita,
  trattamentoRecente?: Trattamento,
  now = Date.now(),
): number {
  return computeSaluteScore(buildSaluteFlagsFromVisita(visita, trattamentoRecente, now))
}

export function buildSaluteScoreRows(flags: SaluteScoreFlags) {
  return SALUTE_SCORE_LABELS.map(({ key, label, weight }) => ({
    label,
    weight,
    active: flags[key],
  }))
}
