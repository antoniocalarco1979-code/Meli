import { MELI_INTELLIGENCE_RULES } from './rules/intelligenceRules'
import type { IntelligenceContext, IntelligencePriority, IntelligenceSuggestion } from './types'

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

function resolveRuleText(
  value: string | ((ctx: IntelligenceContext) => string),
  ctx: IntelligenceContext,
): string {
  return typeof value === 'function' ? value(ctx) : value
}

export function generateIntelligenceSuggestions(
  contexts: IntelligenceContext[],
): IntelligenceSuggestion[] {
  const suggestions: IntelligenceSuggestion[] = []

  for (const ctx of contexts) {
    for (const rule of MELI_INTELLIGENCE_RULES) {
      if (!rule.match(ctx)) continue

      suggestions.push({
        id: `${rule.id}-${ctx.arniaId}`,
        ruleId: rule.id,
        arniaId: ctx.arniaId,
        arniaNumero: ctx.arniaNumero,
        priorita: rule.priorita,
        icon: rule.icon,
        titolo: resolveRuleText(rule.titolo, ctx),
        descrizione: resolveRuleText(rule.descrizione, ctx),
      })
    }
  }

  return suggestions.sort(
    (a, b) =>
      PRIORITA_ORDER[a.priorita] - PRIORITA_ORDER[b.priorita] ||
      compareArniaNumero(a.arniaNumero, b.arniaNumero) ||
      a.ruleId.localeCompare(b.ruleId),
  )
}
