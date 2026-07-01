import type { ArniaStato, Visita } from '../../../database/types'
import type { ArniaListItem } from '../../arnie/types'
import { buildIntelligenceContext } from '../../intelligence/services/intelligenceContextBuilder'
import { MELI_INTELLIGENCE_RULES } from '../../intelligence/rules/intelligenceRules'
import type { IntelligenceContext, IntelligencePriority } from '../../intelligence/types'

const GIRO_ELIGIBLE_STATES: ArniaStato[] = ['attiva', 'debole', 'senza_regina']

const PRIORITA_ORDER: Record<IntelligencePriority, number> = {
  urgente: 0,
  alta: 1,
  media: 2,
  programmare: 3,
}

function compareArniaNumero(a: string, b: string): number {
  const na = Number.parseInt(a, 10)
  const nb = Number.parseInt(b, 10)
  if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb
  return a.localeCompare(b, 'it', { numeric: true })
}

export function resolveGiroPriorityRank(ctx: IntelligenceContext): number {
  let best = 99
  for (const rule of MELI_INTELLIGENCE_RULES) {
    if (!rule.match(ctx)) continue
    best = Math.min(best, PRIORITA_ORDER[rule.priorita])
  }
  return best
}

type GiroOrderCandidate = ArniaListItem & {
  ultimaVisita?: Visita
}

function compareForGiro(a: GiroOrderCandidate, b: GiroOrderCandidate): number {
  const ctxA = buildIntelligenceContext(a.arnia, a.ultimaVisita)
  const ctxB = buildIntelligenceContext(b.arnia, b.ultimaVisita)

  const visitedA = ctxA.hasVisita ? 1 : 0
  const visitedB = ctxB.hasVisita ? 1 : 0
  if (visitedA !== visitedB) return visitedA - visitedB

  const dateA = ctxA.ultimaVisitaData ?? 0
  const dateB = ctxB.ultimaVisitaData ?? 0
  if (dateA !== dateB) return dateA - dateB

  const priorityA = resolveGiroPriorityRank(ctxA)
  const priorityB = resolveGiroPriorityRank(ctxB)
  if (priorityA !== priorityB) return priorityA - priorityB

  return compareArniaNumero(a.arnia.numero, b.arnia.numero)
}

export function filterArnieEligibleForGiro(items: ArniaListItem[]): ArniaListItem[] {
  return items.filter((item) => GIRO_ELIGIBLE_STATES.includes(item.arnia.stato))
}

export function orderArnieForGiro(items: ArniaListItem[]): ArniaListItem[] {
  const eligible = filterArnieEligibleForGiro(items)
  return [...eligible].sort(compareForGiro)
}
