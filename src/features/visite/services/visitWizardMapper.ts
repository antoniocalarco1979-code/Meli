import type { NuovaVisitaFormState } from '../types/visitForm.types'
import type { SaluteScoreFlags } from '../../../utils/salute'
import {
  AZIONE_OPTIONS,
  COVATA_OPTIONS,
  FORZA_OPTIONS,
  OPERCOLATURA_OPTIONS,
  REGINA_OPTIONS,
  RISORSA_OPTIONS,
  SCORTE_OPTIONS,
  type VisitCovataChoice,
  type VisitForzaChoice,
  type VisitOpercolaturaChoice,
  type VisitReginaChoice,
  type VisitRisorsaChoice,
  type VisitScorteChoice,
  type VisitWizardState,
} from '../types/visitWizard.types'
import { formatTelaiAuditLines } from './visitTelaiMapper'

const TRATTAMENTO_WINDOW_MS = 90 * 86_400_000

export function inferForzaFromWizard(state: VisitWizardState): VisitForzaChoice {
  if (state.covata === 'compatta' && state.scorte === 'abbondanti') return 'molto_forte'
  if (
    state.covata === 'assente' ||
    state.covata === 'discontinua' ||
    state.scorte === 'scarse'
  ) {
    return 'debole'
  }
  if (state.covata === 'compatta' || state.scorte === 'normali') return 'forte'
  return 'media'
}

export function mapForzaToNumeric(forza: VisitForzaChoice | null): number | undefined {
  switch (forza) {
    case 'molto_forte':
      return 9
    case 'forte':
      return 8
    case 'media':
      return 6
    case 'debole':
      return 4
    default:
      return undefined
  }
}

export function resolveWizardForza(state: VisitWizardState): VisitForzaChoice | null {
  return state.forza ?? (state.covata && state.scorte ? inferForzaFromWizard(state) : null)
}

function mapCovataToText(covata: VisitCovataChoice | null): string {
  switch (covata) {
    case 'compatta':
      return 'Covata compatta'
    case 'discontinua':
      return 'Covata discontinua'
    case 'assente':
      return 'Covata assente'
    default:
      return ''
  }
}

function mapScorteToText(scorte: VisitScorteChoice | null): string {
  switch (scorte) {
    case 'abbondanti':
      return 'Scorte ottime'
    case 'normali':
      return 'Scorte buone'
    case 'scarse':
      return 'Scorte scarse'
    default:
      return ''
  }
}

function mapReginaToVisita(regina: VisitReginaChoice | null): {
  reginaVista?: boolean
  comportamento?: string
} {
  switch (regina) {
    case 'si':
      return { reginaVista: true, comportamento: 'Docile' }
    case 'no':
      return { reginaVista: false }
    case 'non_controllata':
      return { reginaVista: false, comportamento: 'Regina non controllata' }
    default:
      return {}
  }
}

function labelRegina(value: VisitReginaChoice | null): string {
  if (!value) return '—'
  const option = REGINA_OPTIONS.find((o) => o.value === value)
  if (!option) return value
  return option.icon ? `${option.icon} ${option.label}` : option.label
}

function labelCovata(value: VisitCovataChoice | null): string {
  if (!value) return '—'
  return COVATA_OPTIONS.find((o) => o.value === value)?.label ?? value
}

function labelForza(value: VisitForzaChoice | null): string {
  if (!value) return '—'
  return FORZA_OPTIONS.find((o) => o.value === value)?.label ?? value
}

function labelScorte(value: VisitScorteChoice | null): string {
  if (!value) return '—'
  return SCORTE_OPTIONS.find((o) => o.value === value)?.label ?? value
}

function labelRisorsa(value: VisitRisorsaChoice | null): string {
  if (!value) return '—'
  return RISORSA_OPTIONS.find((o) => o.value === value)?.label ?? value
}

function labelOpercolatura(value: VisitOpercolaturaChoice | null): string {
  if (!value) return '—'
  return OPERCOLATURA_OPTIONS.find((o) => o.value === value)?.label ?? value
}

function labelAzione(state: VisitWizardState): string {
  if (!state.azione) return '—'
  if (state.azione === 'altro') {
    return state.azioneAltro.trim() || '+ Altro…'
  }
  return AZIONE_OPTIONS.find((o) => o.value === state.azione)?.label ?? state.azione
}

function resolveTrattamentoFromAzione(state: VisitWizardState): string {
  const extra = state.trattamento.trim()
  if (extra) return extra
  switch (state.azione) {
    case 'trattare':
      return 'Trattamento'
    case 'nutrire':
      return 'Nutrizione'
    default:
      return ''
  }
}

function buildWizardAuditNote(state: VisitWizardState): string {
  const forza = resolveWizardForza(state)
  const lines = [
    'Protocollo campo:',
    ...formatTelaiAuditLines(state.telai),
    `- Regina (sintesi): ${labelRegina(state.regina)}`,
    `- Covata: ${labelCovata(state.covata)}`,
    `- Miele: ${labelRisorsa(state.miele)}`,
    `- Polline: ${labelRisorsa(state.polline)}`,
    `- Scorte: ${labelScorte(state.scorte)}`,
    `- Forza: ${labelForza(forza)}`,
    `- Melario: ${state.haMelario === true ? 'Sì' : state.haMelario === false ? 'No' : '—'}`,
  ]

  if (state.haMelario === true) {
    lines.push(`- Opercolatura: ${labelOpercolatura(state.opercolatura)}`)
  }

  lines.push(`- Azione: ${labelAzione(state)}`)
  lines.push(`- Foto: ${state.photos.length > 0 ? 'Sì' : 'No'}`)
  return lines.join('\n')
}

export function mapWizardToForm(state: VisitWizardState): NuovaVisitaFormState {
  const reginaFields = mapReginaToVisita(state.regina)
  const wizardNote = buildWizardAuditNote(state)
  const forza = resolveWizardForza(state)

  return {
    reginaVista: reginaFields.reginaVista,
    comportamento: reginaFields.comportamento,
    covata: mapCovataToText(state.covata),
    scorte: mapScorteToText(state.scorte),
    forza: mapForzaToNumeric(forza),
    trattamento: resolveTrattamentoFromAzione(state),
    note: [state.note.trim(), wizardNote].filter(Boolean).join('\n\n'),
  }
}

export function buildSaluteFlagsFromWizard(
  state: VisitWizardState,
  trattamentoRecenteMs?: number,
  now = Date.now(),
): SaluteScoreFlags {
  const reginaPresente = state.regina === 'si'
  const covataCompatta = state.covata === 'compatta'
  const scorteAbbondanti = state.scorte === 'abbondanti'
  const forza = resolveWizardForza(state)
  const forzaNum = mapForzaToNumeric(forza) ?? 0
  const coloniaForte =
    forzaNum >= 7 || (reginaPresente && covataCompatta && scorteAbbondanti)

  const nessunSintomo =
    state.regina === 'si' &&
    state.covata !== 'assente' &&
    state.covata !== 'discontinua'

  const hadTrattamento =
    state.azione === 'trattare' ||
    state.azione === 'nutrire' ||
    Boolean(state.trattamento.trim()) ||
    (trattamentoRecenteMs !== undefined && now - trattamentoRecenteMs < TRATTAMENTO_WINDOW_MS)

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

export function isWizardReadyToSave(state: VisitWizardState): boolean {
  const baseReady =
    state.regina !== null &&
    state.covata !== null &&
    state.miele !== null &&
    state.polline !== null &&
    state.scorte !== null &&
    state.forza !== null &&
    state.haMelario !== null

  if (!baseReady) return false
  if (state.haMelario === true && state.opercolatura === null) return false
  if (state.azione == null) return false
  if (state.azione === 'altro' && !state.azioneAltro.trim()) return false
  return true
}

export {
  labelRegina,
  labelCovata,
  labelForza,
  labelScorte,
  labelRisorsa,
  labelOpercolatura,
  labelAzione,
}
