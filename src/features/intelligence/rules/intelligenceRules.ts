import type { IntelligenceRule } from '../types'

const MS_PER_DAY = 86_400_000
const VISITA_SOGLIA_GIORNI = 15

function arniaLabel(ctx: { arniaNumero: string; arniaNome?: string }): string {
  return ctx.arniaNome?.trim()
    ? `Arnia ${ctx.arniaNumero} · ${ctx.arniaNome}`
    : `Arnia ${ctx.arniaNumero}`
}

function giorniVisita(ctx: { giorniDallUltimaVisita: number | null }): number {
  return ctx.giorniDallUltimaVisita ?? Number.POSITIVE_INFINITY
}

/** Registro estendibile — aggiungere nuove regole in coda. */
export const MELI_INTELLIGENCE_RULES: IntelligenceRule[] = [
  {
    id: 'visita-scaduta',
    priorita: 'programmare',
    icon: 'calendar-clock',
    titolo: 'Nuova ispezione consigliata',
    descrizione: (ctx) => {
      const label = arniaLabel(ctx)
      if (!ctx.hasVisita) {
        return `${label}: nessuna visita registrata. Consiglia una nuova ispezione.`
      }
      const giorni = ctx.giorniDallUltimaVisita ?? 0
      return `${label}: ultima visita ${giorni} giorni fa. Consiglia una nuova ispezione.`
    },
    match: (ctx) => giorniVisita(ctx) > VISITA_SOGLIA_GIORNI,
  },
  {
    id: 'regina-non-vista',
    priorita: 'alta',
    icon: 'crown',
    titolo: 'Regina non vista',
    descrizione: (ctx) =>
      `${arniaLabel(ctx)}: la regina non è stata vista all'ultimo controllo. Priorità alta.`,
    match: (ctx) => ctx.hasVisita && ctx.reginaLabel === 'Non vista',
  },
  {
    id: 'covata-assente',
    priorita: 'urgente',
    icon: 'alert-triangle',
    titolo: 'Ispezione urgente',
    descrizione: (ctx) =>
      `${arniaLabel(ctx)}: covata assente. Ispezione urgente consigliata.`,
    match: (ctx) => ctx.hasVisita && ctx.covataLabel === 'Assente',
  },
  {
    id: 'melario-opercolato',
    priorita: 'programmare',
    icon: 'hexagon',
    titolo: 'Smielatura da programmare',
    descrizione: (ctx) =>
      `${arniaLabel(ctx)}: melario opercolato. Programmare smielatura.`,
    match: (ctx) => ctx.hasVisita && ctx.melarioLabel === 'Opercolato',
  },
  {
    id: 'scorte-scarse',
    priorita: 'media',
    icon: 'leaf',
    titolo: 'Scorte da monitorare',
    descrizione: (ctx) =>
      `${arniaLabel(ctx)}: scorte scarse rilevate. Valutare nutrizione.`,
    match: (ctx) => ctx.hasVisita && ctx.scorteLabel === 'Scarse',
  },
]

export { VISITA_SOGLIA_GIORNI, MS_PER_DAY }
