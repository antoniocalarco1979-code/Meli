import { db } from '../../../database'
import type { Apiario, Arnia, Foto, Produzione, Regina, Trattamento, Visita } from '../../../database/types'
import { apiariRepository } from '../../../database/repositories'
import { fotoRepository } from '../../../database/repositories/fotoRepository'
import { produzioneRepository } from '../../../database/repositories/produzioneRepository'
import { regineRepository } from '../../../database/repositories/regineRepository'
import { trattamentiRepository } from '../../../database/repositories/trattamentiRepository'
import { visiteRepository } from '../../../database/repositories/visiteRepository'
import type { ArniaDetailData, ArniaListItem, TimelineItem, VisitaTimelineEntry } from '../types'
import {
  computeReginaEta,
  computeSalute,
  formatFullDate,
  formatProduzioneKg,
  formatReginaLabel,
  formatReginaStato,
  formatRelativeDate,
} from '../utils/arniaFormatters'
import { buildSaluteFlagsFromVisita, buildSaluteScoreRows } from '../utils/saluteScore'

export type ArniaDetailView = {
  arnia: Arnia
  apiario?: Apiario
  coverFoto?: string
  foto: Foto[]
  regina?: Regina
  ultimaVisita?: Visita
  trattamentoRecente?: Trattamento
  produzione: Produzione[]
  detail: ArniaDetailData
}

function isSameDay(a: number, b: number): boolean {
  const d1 = new Date(a)
  const d2 = new Date(b)
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}

function buildTimeline(
  visite: Visita[],
  trattamenti: Trattamento[],
  produzione: Produzione[],
): TimelineItem[] {
  const items: TimelineItem[] = [
    ...visite.map((v) => ({
      id: `visita-${v.id}`,
      data: v.data,
      titolo: 'Visita ispettiva',
      sottotitolo: v.note ?? v.comportamento ?? v.meteo,
    })),
    ...trattamenti.map((t) => ({
      id: `trattamento-${t.id}`,
      data: t.data,
      titolo: `Trattamento ${t.prodotto ?? ''}`.trim(),
      sottotitolo: t.dose,
    })),
    ...produzione.map((p) => ({
      id: `produzione-${p.id}`,
      data: p.data,
      titolo: `Raccolta ${p.kg} kg`,
      sottotitolo: p.tipo,
    })),
  ]

  return items.sort((a, b) => b.data - a.data).slice(0, 12)
}

function buildVisitaTimeline(
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

    return {
      id: visita.id,
      data: visita.data,
      meteo: visita.meteo,
      note: visita.note,
      reginaVista: visita.reginaVista,
      fotoPaths: visitFoto.map((f) => f.path),
      trattamenti: visitTrattamenti.map((t) => t.prodotto ?? 'Trattamento'),
      produzione: visitProduzione.map((p) => `${p.kg} kg${p.tipo ? ` · ${p.tipo}` : ''}`),
    }
  })
}

function buildProductionChart(produzione: Produzione[]) {
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

function extractTrattamentoNome(prodotto?: string): string {
  if (!prodotto) return '—'
  const lower = prodotto.toLowerCase()
  if (lower.includes('oxalico')) return 'Oxalico'
  if (lower.includes('apivar') || lower.includes('varroa')) return 'Varroa'
  return prodotto.split('(')[0]?.trim() ?? prodotto
}

async function enrichArniaListItem(
  arnia: Arnia,
  apiario?: Apiario,
): Promise<ArniaListItem> {
  const [regina, visite, produzione, trattamenti] = await Promise.all([
    regineRepository.getAttualeByArniaId(arnia.id),
    visiteRepository.getByArniaId(arnia.id),
    produzioneRepository.getByArniaId(arnia.id),
    trattamentiRepository.getByArniaId(arnia.id),
  ])
  const ultimaVisita = visite[0]
  const trattamentoRecente = trattamenti[0]
  const year = new Date().getFullYear()
  const produzioneAnno = produzione
    .filter((p) => new Date(p.data).getFullYear() === year)
    .reduce((s, p) => s + p.kg, 0)

  return {
    arnia,
    apiario,
    coverFoto: arnia.fotoCopertina,
    salute: computeSalute(arnia.stato, ultimaVisita, arnia.forzaFamiglia, trattamentoRecente),
    reginaLabel: formatReginaLabel(regina?.anno, regina?.colore),
    ultimaVisitaLabel: ultimaVisita ? formatRelativeDate(ultimaVisita.data) : '—',
    produzioneAnnoLabel: formatProduzioneKg(produzioneAnno),
  }
}

export async function buildArniaDetailView(arnia: Arnia): Promise<ArniaDetailView> {
  const [apiario, foto, regina, visite, trattamenti, produzione] = await Promise.all([
    apiariRepository.getById(arnia.apiarioId),
    fotoRepository.getByArniaId(arnia.id),
    regineRepository.getAttualeByArniaId(arnia.id),
    visiteRepository.getByArniaId(arnia.id),
    trattamentiRepository.getByArniaId(arnia.id),
    produzioneRepository.getByArniaId(arnia.id),
  ])

  const ultimaVisita = visite[0]
  const trattamentoRecente = trattamenti[0]
  const year = new Date().getFullYear()
  const produzioneAnno = produzione
    .filter((p) => new Date(p.data).getFullYear() === year)
    .reduce((s, p) => s + p.kg, 0)
  const ultimaSmielatura = produzione[0]
  const salute = computeSalute(arnia.stato, ultimaVisita, arnia.forzaFamiglia, trattamentoRecente)
  const lastUpdate = ultimaVisita?.data ?? arnia.updatedAt
  const scoreRows = ultimaVisita
    ? buildSaluteScoreRows(buildSaluteFlagsFromVisita(ultimaVisita, trattamentoRecente))
    : undefined

  return {
    arnia,
    apiario,
    coverFoto: arnia.fotoCopertina ?? foto[0]?.path,
    foto,
    regina,
    ultimaVisita,
    trattamentoRecente,
    produzione,
    detail: {
      salute,
      health: {
        value: salute,
        lastUpdate,
        lastUpdateLabel: formatRelativeDate(lastUpdate),
        scoreRows,
      },
      queen: {
        present: Boolean(regina),
        anno: regina?.anno,
        colore: regina?.colore,
        origine: regina?.origine,
        stato: formatReginaStato(arnia.stato, Boolean(regina)),
        eta: computeReginaEta(regina?.anno),
      },
      production: {
        annoTotale: produzioneAnno,
        annoTotaleLabel: formatProduzioneKg(produzioneAnno),
        ultimaSmielatura: ultimaSmielatura?.data,
        ultimaSmielaturaLabel: ultimaSmielatura
          ? formatRelativeDate(ultimaSmielatura.data)
          : '—',
        chartData: buildProductionChart(produzione),
      },
      ultimaVisita: {
        data: ultimaVisita?.data,
        dataLabel: ultimaVisita ? formatRelativeDate(ultimaVisita.data) : '—',
        dataFull: ultimaVisita ? formatFullDate(ultimaVisita.data) : undefined,
        meteo: ultimaVisita?.meteo,
        note: ultimaVisita?.note,
        reginaVista: ultimaVisita?.reginaVista,
      },
      trattamenti: trattamenti.map((t) => ({
        id: t.id,
        data: t.data,
        dataLabel: formatRelativeDate(t.data),
        prodotto: extractTrattamentoNome(t.prodotto),
        dose: t.dose,
        scadenzaLabel: t.scadenza ? formatRelativeDate(t.scadenza) : undefined,
      })),
      visitTimeline: buildVisitaTimeline(visite, foto, trattamenti, produzione),
      reginaLabel: formatReginaLabel(regina?.anno, regina?.colore),
      produzioneTotale: formatProduzioneKg(produzione.reduce((s, p) => s + p.kg, 0)),
      ultimaVisitaLabel: ultimaVisita ? formatRelativeDate(ultimaVisita.data) : '—',
      trattamentoLabel: extractTrattamentoNome(trattamentoRecente?.prodotto),
      timeline: buildTimeline(visite, trattamenti, produzione),
    },
  }
}

export async function getAllArnieEnriched(): Promise<ArniaListItem[]> {
  const arnie = await db.arnie.orderBy('numero').toArray()
  const apiari = await apiariRepository.getAll()
  const apiariMap = new Map(apiari.map((a) => [a.id, a]))

  return Promise.all(
    arnie.map((arnia) => enrichArniaListItem(arnia, apiariMap.get(arnia.apiarioId))),
  )
}

function compareArniaNumero(a: string, b: string): number {
  const na = Number.parseInt(a, 10)
  const nb = Number.parseInt(b, 10)
  if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb
  return a.localeCompare(b, 'it', { numeric: true })
}

export async function getArnieEnrichedByApiarioId(apiarioId: string): Promise<ArniaListItem[]> {
  const apiario = await apiariRepository.getById(apiarioId)
  const arnie = await db.arnie.where('apiarioId').equals(apiarioId).toArray()
  arnie.sort((a, b) => compareArniaNumero(a.numero, b.numero))

  return Promise.all(arnie.map((arnia) => enrichArniaListItem(arnia, apiario)))
}

export async function getDashboardLiveMetrics() {
  const [arnie, visite] = await Promise.all([db.arnie.toArray(), db.visite.toArray()])

  const ultimaVisita = visite.sort((a, b) => b.data - a.data)[0]
  const saluteValues = arnie.map((a) => computeSalute(a.stato, undefined, a.forzaFamiglia))
  const saluteMedia =
    saluteValues.length > 0
      ? Math.round(saluteValues.reduce((s, v) => s + v, 0) / saluteValues.length)
      : 0

  return {
    ultimaVisitaLabel: ultimaVisita ? formatRelativeDate(ultimaVisita.data) : '—',
    indiceSalute: saluteMedia,
  }
}

export { formatFullDate }
