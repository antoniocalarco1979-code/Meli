import type { Visita } from '../../database/types'
import type { UltimaVisitaSummary } from '../arnie/types'
import {
  formatCovataDisplay,
  formatReginaVisitaDisplay,
  formatScorteDisplay,
  parseMelarioFromNote,
} from '../arnie/utils/arniaFormatters'
import { parseIspezioneNote } from '../visite/services/ispezioneNoteFormat'
import { AZIONI_CONSIGLIATE_RULES } from './rules/azioniRules'
import type { AzioneConsigliata, AzionePriorita, AzioneRuleContext } from './types'

const PRIORITA_ORDER: Record<AzionePriorita, number> = {
  urgente: 0,
  importante: 1,
  programmare: 2,
}

function emptyContext(): AzioneRuleContext {
  return {
    hasVisita: false,
    reginaLabel: '—',
    covataLabel: '—',
    scorteLabel: '—',
    melarioLabel: '—',
    vassoioVarroa: null,
    acariStimati: null,
    telaiTotali: 0,
    telaiConCelleReali: false,
    telaiScorteScarseCount: 0,
    reginaVistaSuTelai: false,
    covataAssenteSuTuttiTelai: false,
  }
}

export function buildAzioneRuleContextFromVisita(visita?: Visita): AzioneRuleContext {
  if (!visita) return emptyContext()

  const parsed = parseIspezioneNote(visita.note)

  return {
    hasVisita: true,
    reginaLabel: formatReginaVisitaDisplay(visita),
    covataLabel: formatCovataDisplay(visita.covata),
    scorteLabel: formatScorteDisplay(visita.scorte),
    melarioLabel: parseMelarioFromNote(visita.note),
    vassoioVarroa: parsed.vassoioVarroa,
    acariStimati: parsed.acariStimati,
    telaiTotali: parsed.telaiTotali,
    telaiConCelleReali: parsed.telaiConCelleReali,
    telaiScorteScarseCount: parsed.telaiScorteScarseCount,
    reginaVistaSuTelai: parsed.reginaVistaSuTelai,
    covataAssenteSuTuttiTelai: parsed.covataAssenteSuTuttiTelai,
  }
}

export function buildAzioneRuleContextFromSummary(visit: UltimaVisitaSummary): AzioneRuleContext {
  const parsed = parseIspezioneNote(visit.note)

  return {
    hasVisita: Boolean(visit.data),
    reginaLabel: visit.reginaLabel,
    covataLabel: visit.covataLabel,
    scorteLabel: visit.scorteLabel,
    melarioLabel: visit.melarioLabel,
    vassoioVarroa: parsed.vassoioVarroa,
    acariStimati: parsed.acariStimati,
    telaiTotali: parsed.telaiTotali,
    telaiConCelleReali: parsed.telaiConCelleReali,
    telaiScorteScarseCount: parsed.telaiScorteScarseCount,
    reginaVistaSuTelai: parsed.reginaVistaSuTelai,
    covataAssenteSuTuttiTelai: parsed.covataAssenteSuTuttiTelai,
  }
}

export function generateAzioniConsigliate(ctx: AzioneRuleContext): AzioneConsigliata[] {
  if (!ctx.hasVisita) return []

  const azioni = AZIONI_CONSIGLIATE_RULES.filter((rule) => rule.match(ctx)).map((rule) => ({
    id: `${rule.id}-${rule.priorita}`,
    ruleId: rule.id,
    priorita: rule.priorita,
    messaggio: rule.message,
  }))

  return azioni.sort((a, b) => PRIORITA_ORDER[a.priorita] - PRIORITA_ORDER[b.priorita])
}

/** Analizza una visita appena salvata (stesso motore regole della UI). */
export function analyzeVisitaSalvata(visita: Visita): AzioneConsigliata[] {
  return generateAzioniConsigliate(buildAzioneRuleContextFromVisita(visita))
}
