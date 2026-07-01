import type { Visita } from '../../../database/types'
import type { VisitaCronologiaDetail, VisitaCronologiaSnapshot } from '../types/visitaCronologia.types'
import {
  formatCovataDisplay,
  formatReginaVisitaDisplay,
  formatSaluteStatoLabel,
  formatScorteDisplay,
} from '../../arnie/utils/arniaFormatters'
import { resolveVisitMeteo } from './visitMetadata'
import { parseVisitaGuidataNote } from './visitaGuidataNoteParser'

type BuildSnapshotParams = {
  visita: Visita
  fotoPaths: string[]
  saluteValue: number
  interventiExtra?: number
}

function buildLegacyDetail(visita: Visita): VisitaCronologiaDetail {
  return {
    isGuidata: false,
    meteo: resolveVisitMeteo(visita),
    regina: formatReginaVisitaDisplay(visita),
    interventi: [],
    telaini: [],
    riepilogoLines: [
      { label: 'Covata', value: formatCovataDisplay(visita.covata) },
      { label: 'Scorte', value: formatScorteDisplay(visita.scorte) },
      { label: 'Regina', value: formatReginaVisitaDisplay(visita) },
    ],
    noteNido: visita.note,
  }
}

export function buildVisitaCronologiaDetail(visita: Visita): VisitaCronologiaDetail {
  const parsed = parseVisitaGuidataNote(visita.note)
  if (parsed.isGuidata) {
    if (!parsed.meteo) parsed.meteo = resolveVisitMeteo(visita)
    return parsed
  }
  return buildLegacyDetail(visita)
}

export function buildVisitaCronologiaSnapshot({
  visita,
  fotoPaths,
  saluteValue,
  interventiExtra = 0,
}: BuildSnapshotParams): VisitaCronologiaSnapshot {
  const detail = buildVisitaCronologiaDetail(visita)
  const interventiCount = detail.interventi.length || interventiExtra

  return {
    visitaId: visita.id,
    arniaId: visita.arniaId,
    data: visita.data,
    durataSec: detail.durataSec,
    telainiCount: detail.telaini.length,
    interventiCount,
    fotoCount: fotoPaths.length,
    reginaVista: visita.reginaVista,
    meteo: detail.meteo ?? resolveVisitMeteo(visita),
    statoGenerale: formatSaluteStatoLabel(saluteValue),
    saluteValue,
    detail,
  }
}

export function formatVisitaCronologiaDurata(detail: VisitaCronologiaDetail): string {
  if (detail.durataLabel) return detail.durataLabel
  return '—'
}
