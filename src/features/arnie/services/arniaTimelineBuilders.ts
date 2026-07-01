import type { Foto, Produzione, Trattamento, Visita } from '../../../database/types'
import {
  buildAzioneRuleContextFromVisita,
  generateAzioniConsigliate,
} from '../../azioni/generateAzioniConsigliate'
import {
  buildVisitaCronologiaSnapshot,
  formatVisitaCronologiaDurata,
} from '../../visite/services/visitaCronologiaService'
import {
  extractTimelineUserNote,
  resolveVisitMeteo,
  resolveVisitOperatore,
  resolveVisitTemperatura,
} from '../../visite/services/visitMetadata'
import { formatFullDate, formatVisitaDateShort, formatVisitaTime } from '../../../utils/dateFormatters'
import { computeSaluteFromVisita, getSaluteLevel } from '../../../utils/salute'
import { formatTrattamentoTipoLabel } from '../../trattamenti/utils/trattamentoFormatters'
import type { VisitaTimelineEntry } from '../types'
import {
  buildVisitaRiepilogo,
  formatCovataDisplay,
  formatReginaVisitaDisplay,
  formatSaluteStatoLabel,
  formatScorteDisplay,
  parseMelarioFromNote,
  saluteLevelEmoji,
} from '../utils/arniaFormatters'

function isSameDay(a: number, b: number): boolean {
  const d1 = new Date(a)
  const d2 = new Date(b)
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}

export function extractTrattamentoNome(
  source?: string | Pick<Trattamento, 'tipo' | 'principioAttivo' | 'prodotto'>,
): string {
  if (!source) return '—'
  if (typeof source !== 'string') {
    if (source.tipo) return formatTrattamentoTipoLabel(source.tipo)
    const name = source.principioAttivo ?? source.prodotto
    if (!name) return '—'
    return extractTrattamentoNome(name)
  }
  const lower = source.toLowerCase()
  if (lower.includes('oxalico')) return 'Oxalico'
  if (lower.includes('apivar') || lower.includes('varroa')) return 'Varroa'
  return source.split('(')[0]?.trim() ?? source
}

export function buildVisitaTimeline(
  visite: Visita[],
  foto: Foto[],
  trattamenti: Trattamento[],
  produzione: Produzione[],
): VisitaTimelineEntry[] {
  return visite.map((visita) => {
    const visitFoto = foto.filter(
      (f) => f.visitaId === visita.id || isSameDay(f.data, visita.data),
    )
    const visitTrattamenti = trattamenti.filter((t) => isSameDay(t.data, visita.data))
    const visitProduzione = produzione.filter((p) => isSameDay(p.data, visita.data))
    const trattamentoRecente = visitTrattamenti[0]
    const salute = computeSaluteFromVisita(visita, trattamentoRecente)
    const statusLevel = getSaluteLevel(salute)
    const azioniConsigliate = generateAzioniConsigliate(buildAzioneRuleContextFromVisita(visita))

    const fotoPaths = visitFoto.map((f) => f.path)
    const snapshot = buildVisitaCronologiaSnapshot({
      visita,
      fotoPaths,
      saluteValue: salute,
      interventiExtra: visitTrattamenti.length,
    })

    return {
      id: visita.id,
      data: visita.data,
      dataShort: formatVisitaDateShort(visita.data),
      dataFull: formatFullDate(visita.data),
      oraLabel: formatVisitaTime(visita.data),
      durataLabel: formatVisitaCronologiaDurata(snapshot.detail),
      fotoCount: fotoPaths.length,
      interventiCount: snapshot.interventiCount,
      summary: buildVisitaRiepilogo(visita),
      statusIcon: saluteLevelEmoji(statusLevel),
      statusLevel,
      statoGeneraleLabel: formatSaluteStatoLabel(salute),
      saluteValue: salute,
      reginaLabel: formatReginaVisitaDisplay(visita),
      covataLabel: formatCovataDisplay(visita.covata),
      scorteLabel: formatScorteDisplay(visita.scorte),
      melarioLabel: parseMelarioFromNote(visita.note),
      meteoLabel: resolveVisitMeteo(visita),
      temperaturaLabel: resolveVisitTemperatura(visita),
      operatoreLabel: resolveVisitOperatore(visita),
      azioniConsigliate,
      noteDisplay: extractTimelineUserNote(visita.note),
      fotoPaths,
      trattamenti: visitTrattamenti.map((t) => extractTrattamentoNome(t)),
      produzione: visitProduzione.map((p) => `${p.kg} kg${p.tipo ? ` · ${p.tipo}` : ''}`),
      detail: snapshot.detail,
      snapshot,
    }
  })
}

export function buildProductionChart(produzione: Produzione[]) {
  const year = new Date().getFullYear()
  const yearData = produzione.filter((p) => new Date(p.data).getFullYear() === year)

  const byMonth = new Map<number, number>()
  yearData.forEach((p) => {
    const month = new Date(p.data).getMonth()
    byMonth.set(month, (byMonth.get(month) ?? 0) + p.kg)
  })

  const monthLabels = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic']
  const activeMonths = [...byMonth.keys()].sort((a, b) => a - b)

  if (activeMonths.length === 0) {
    return yearData.slice(0, 6).map((p, i) => ({
      mese: monthLabels[new Date(p.data).getMonth()] ?? `M${i + 1}`,
      kg: p.kg,
    }))
  }

  return activeMonths.map((m) => ({
    mese: monthLabels[m],
    kg: Math.round((byMonth.get(m) ?? 0) * 10) / 10,
  }))
}
