import type {
  VisitCovataChoice,
  VisitReginaChoice,
  VisitRisorsaChoice,
  VisitTelaioEntry,
  VisitTelaioTipo,
  VisitWizardState,
} from '../types/visitWizard.types'
import { REGINA_OPTIONS } from '../types/visitWizard.types'

const TELAIO_TYPE_LABELS: Record<VisitTelaioTipo, string> = {
  covata: 'Covata',
  miele: 'Miele',
  polline: 'Polline',
  regina_vista: 'Regina vista',
}

export function labelTelaioTipo(tipo: VisitTelaioTipo): string {
  return TELAIO_TYPE_LABELS[tipo]
}

export function formatReginaEsito(esito: VisitReginaChoice | null): string {
  if (!esito) return '—'
  const option = REGINA_OPTIONS.find((o) => o.value === esito)
  if (!option) return esito
  return `${option.icon ?? ''} ${option.label}`.trim()
}

export function formatStarRating(rating: number): string {
  const filled = Math.max(0, Math.min(5, Math.round(rating)))
  return `${'★'.repeat(filled)}${'☆'.repeat(5 - filled)}`
}

function bestRating(telai: VisitTelaioEntry[], tipo: VisitTelaioTipo): number | null {
  const ratings = telai
    .filter((t) => t.tipo === tipo && t.rating != null)
    .map((t) => t.rating as number)
  if (ratings.length === 0) return null
  return Math.max(...ratings)
}

function starsToCovata(stars: number): VisitCovataChoice {
  if (stars >= 4) return 'compatta'
  if (stars >= 2) return 'discontinua'
  return 'assente'
}

function starsToRisorsa(stars: number): VisitRisorsaChoice {
  if (stars >= 4) return 'presente'
  if (stars === 3) return 'scarso'
  return 'assente'
}

function deriveRegina(telai: VisitTelaioEntry[]): VisitReginaChoice | null {
  const esiti = telai
    .filter((t) => t.tipo === 'regina_vista' && t.reginaEsito != null)
    .map((t) => t.reginaEsito as VisitReginaChoice)
  if (esiti.length === 0) return null
  if (esiti.includes('si')) return 'si'
  if (esiti.includes('no')) return 'no'
  return 'non_controllata'
}

export function deriveFieldsFromTelai(telai: VisitTelaioEntry[]): Pick<
  VisitWizardState,
  'regina' | 'covata' | 'miele' | 'polline'
> {
  const covataStars = bestRating(telai, 'covata')
  const mieleStars = bestRating(telai, 'miele')
  const pollineStars = bestRating(telai, 'polline')

  return {
    regina: deriveRegina(telai),
    covata: covataStars != null ? starsToCovata(covataStars) : null,
    miele: mieleStars != null ? starsToRisorsa(mieleStars) : null,
    polline: pollineStars != null ? starsToRisorsa(pollineStars) : null,
  }
}

export function applyTelaiToWizardState(telai: VisitTelaioEntry[]): Partial<VisitWizardState> {
  return {
    telai,
    ...deriveFieldsFromTelai(telai),
  }
}

export function isTelaioEntryComplete(entry: VisitTelaioEntry): boolean {
  if (entry.tipo === 'regina_vista') return entry.reginaEsito != null
  return entry.rating != null && entry.rating >= 1
}

const REQUIRED_TELAIO_TYPES: VisitTelaioTipo[] = ['covata', 'miele', 'polline', 'regina_vista']

export function isTelaiStepComplete(telai: VisitTelaioEntry[]): boolean {
  if (telai.length === 0) return false
  return REQUIRED_TELAIO_TYPES.every((tipo) =>
    telai.some((t) => t.tipo === tipo && isTelaioEntryComplete(t)),
  )
}

export function formatTelaiAuditLines(telai: VisitTelaioEntry[]): string[] {
  return telai.map((t) => {
    const label = labelTelaioTipo(t.tipo)
    if (t.tipo === 'regina_vista') {
      return `- Telaio ${t.numero}: ${label} ${formatReginaEsito(t.reginaEsito)}`
    }
    return `- Telaio ${t.numero}: ${label} ${formatStarRating(t.rating ?? 0)}`
  })
}

export function createTelaioEntry(
  numero: number,
  tipo: VisitTelaioTipo,
  rating: number | null,
  reginaEsito: VisitReginaChoice | null,
): VisitTelaioEntry {
  return {
    id: `telaio-${numero}-${Date.now()}`,
    numero,
    tipo,
    rating: tipo === 'regina_vista' ? null : rating,
    reginaEsito: tipo === 'regina_vista' ? reginaEsito : null,
  }
}
