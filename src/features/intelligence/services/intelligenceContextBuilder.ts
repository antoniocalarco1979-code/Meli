import type { Arnia, Visita } from '../../../database/types'
import {
  formatCovataDisplay,
  formatReginaVisitaDisplay,
  formatScorteDisplay,
  resolveMelarioStatusFromNote,
} from '../../arnie/utils/arniaFormatters'
import type { IntelligenceContext } from '../types'
import { MS_PER_DAY } from '../rules/intelligenceRules'

export function buildIntelligenceContext(
  arnia: Arnia,
  ultimaVisita?: Visita,
  now = Date.now(),
): IntelligenceContext {
  const giorniDallUltimaVisita = ultimaVisita
    ? Math.floor((now - ultimaVisita.data) / MS_PER_DAY)
    : null

  return {
    arniaId: arnia.id,
    arniaNumero: arnia.numero,
    arniaNome: arnia.nome,
    hasVisita: Boolean(ultimaVisita),
    ultimaVisitaData: ultimaVisita?.data ?? null,
    giorniDallUltimaVisita,
    reginaLabel: ultimaVisita ? formatReginaVisitaDisplay(ultimaVisita) : '—',
    covataLabel: formatCovataDisplay(ultimaVisita?.covata),
    scorteLabel: formatScorteDisplay(ultimaVisita?.scorte),
    melarioLabel: resolveMelarioStatusFromNote(ultimaVisita?.note),
  }
}
