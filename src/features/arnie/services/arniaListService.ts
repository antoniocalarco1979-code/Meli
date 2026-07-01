import type { Apiario, Arnia, Produzione, Regina, Trattamento, Visita } from '../../../database/types'
import { getDb } from '../../../database/activeDatabase'
import type { ArniaListItem } from '../types'
import {
  computeSalute,
  formatProduzioneKg,
  formatReginaLabel,
  formatRelativeDate,
} from '../utils/arniaFormatters'

function compareArniaNumero(a: string, b: string): number {
  const na = Number.parseInt(a, 10)
  const nb = Number.parseInt(b, 10)
  if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb
  return a.localeCompare(b, 'it', { numeric: true })
}

function groupByArniaId<T extends { arniaId: string }>(rows: T[]): Map<string, T[]> {
  const map = new Map<string, T[]>()
  for (const row of rows) {
    const list = map.get(row.arniaId)
    if (list) list.push(row)
    else map.set(row.arniaId, [row])
  }
  return map
}

function sortVisiteDesc(visite: Visita[]): Visita[] {
  return [...visite].sort((a, b) => b.data - a.data)
}

function sortTrattamentiDesc(trattamenti: Trattamento[]): Trattamento[] {
  return [...trattamenti].sort((a, b) => b.data - a.data)
}

function sortProduzioneDesc(produzione: Produzione[]): Produzione[] {
  return [...produzione].sort((a, b) => b.data - a.data)
}

function resolveReginaAttuale(
  arnia: Arnia,
  regineById: Map<string, Regina>,
): Regina | undefined {
  if (!arnia.reginaAttualeId) return undefined
  return regineById.get(arnia.reginaAttualeId)
}

function enrichArniaListItemFromCache(
  arnia: Arnia,
  apiario: Apiario | undefined,
  regineById: Map<string, Regina>,
  visiteByArniaId: Map<string, Visita[]>,
  produzioneByArniaId: Map<string, Produzione[]>,
  trattamentiByArniaId: Map<string, Trattamento[]>,
): ArniaListItem {
  const regina = resolveReginaAttuale(arnia, regineById)
  const visite = sortVisiteDesc(visiteByArniaId.get(arnia.id) ?? [])
  const produzione = sortProduzioneDesc(produzioneByArniaId.get(arnia.id) ?? [])
  const trattamenti = sortTrattamentiDesc(trattamentiByArniaId.get(arnia.id) ?? [])
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
    ultimaVisitaData: ultimaVisita?.data ?? null,
    ultimaVisita,
    produzioneAnnoLabel: formatProduzioneKg(produzioneAnno),
  }
}

async function enrichArnieBatch(
  db: ReturnType<typeof getDb>,
  arnie: Arnia[],
  apiariMap: Map<string, Apiario>,
): Promise<ArniaListItem[]> {
  if (arnie.length === 0) return []

  const arniaIds = arnie.map((a) => a.id)
  const [regine, visite, produzione, trattamenti] = await Promise.all([
    db.regine.where('arniaId').anyOf(arniaIds).toArray(),
    db.visite.where('arniaId').anyOf(arniaIds).toArray(),
    db.produzione.where('arniaId').anyOf(arniaIds).toArray(),
    db.trattamenti.where('arniaId').anyOf(arniaIds).toArray(),
  ])

  const regineById = new Map(regine.map((r) => [r.id, r]))
  const visiteByArniaId = groupByArniaId(visite)
  const produzioneByArniaId = groupByArniaId(produzione)
  const trattamentiByArniaId = groupByArniaId(trattamenti)

  return arnie.map((arnia) =>
    enrichArniaListItemFromCache(
      arnia,
      apiariMap.get(arnia.apiarioId),
      regineById,
      visiteByArniaId,
      produzioneByArniaId,
      trattamentiByArniaId,
    ),
  )
}

export async function getAllArnieEnriched(): Promise<ArniaListItem[]> {
  try {
    const db = getDb()
    const arnie = await db.arnie.toArray()
    if (arnie.length === 0) return []

    arnie.sort((a, b) => compareArniaNumero(a.numero, b.numero))
    const apiarioIds = [...new Set(arnie.map((a) => a.apiarioId))]
    const apiari = await db.apiari.where('id').anyOf(apiarioIds).toArray()
    const apiariMap = new Map(apiari.map((a) => [a.id, a]))

    return enrichArnieBatch(db, arnie, apiariMap)
  } catch (err) {
    console.warn('[MELI] getAllArnieEnriched:', err)
    return []
  }
}

export async function getArnieEnrichedByApiarioId(apiarioId: string): Promise<ArniaListItem[]> {
  try {
    const db = getDb()
    const [apiario, arnie] = await Promise.all([
      db.apiari.get(apiarioId),
      db.arnie.where('apiarioId').equals(apiarioId).toArray(),
    ])

    if (arnie.length === 0) return []

    arnie.sort((a, b) => compareArniaNumero(a.numero, b.numero))
    const apiariMap = apiario ? new Map([[apiario.id, apiario]]) : new Map<string, Apiario>()

    return enrichArnieBatch(db, arnie, apiariMap)
  } catch (err) {
    console.warn('[MELI] getArnieEnrichedByApiarioId:', err)
    return []
  }
}
