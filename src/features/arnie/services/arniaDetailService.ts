import { getDb } from '../../../database/activeDatabase'
import type { Apiario, Arnia, Foto, Produzione, Regina, Trattamento, Visita } from '../../../database/types'
import { apiariRepository } from '../../../database/repositories'
import { fotoRepository } from '../../../database/repositories/fotoRepository'
import { produzioneRepository } from '../../../database/repositories/produzioneRepository'
import { regineRepository } from '../../../database/repositories/regineRepository'
import { trattamentiRepository } from '../../../database/repositories/trattamentiRepository'
import { visiteRepository } from '../../../database/repositories/visiteRepository'
import type { ArniaDetailData, ArniaListItem } from '../types'
import {
  computeReginaEta,
  computeSalute,
  formatCovataDisplay,
  formatFullDate,
  formatProduzioneKg,
  formatReginaLabel,
  formatReginaStato,
  formatReginaVisitaDisplay,
  formatRelativeDate,
  formatScorteDisplay,
  parseMelarioFromNote,
} from '../utils/arniaFormatters'
import { buildSaluteFlagsFromVisita, buildSaluteScoreRows } from '../../../utils/salute'
import { buildProductionChart, buildVisitaTimeline, extractTrattamentoNome } from './arniaTimelineBuilders'
import { formatVisitaDateShort } from '../../../utils/dateFormatters'

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
        dataShort: ultimaVisita ? formatVisitaDateShort(ultimaVisita.data) : undefined,
        meteo: ultimaVisita?.meteo,
        note: ultimaVisita?.note,
        reginaVista: ultimaVisita?.reginaVista,
        reginaLabel: formatReginaVisitaDisplay(ultimaVisita),
        covataLabel: formatCovataDisplay(ultimaVisita?.covata),
        scorteLabel: formatScorteDisplay(ultimaVisita?.scorte),
        melarioLabel: parseMelarioFromNote(ultimaVisita?.note),
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
    },
  }
}

export async function getAllArnieEnriched(): Promise<ArniaListItem[]> {
  const arnie = await getDb().arnie.orderBy('numero').toArray()
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
  const arnie = await getDb().arnie.where('apiarioId').equals(apiarioId).toArray()
  arnie.sort((a, b) => compareArniaNumero(a.numero, b.numero))

  return Promise.all(arnie.map((arnia) => enrichArniaListItem(arnia, apiario)))
}
