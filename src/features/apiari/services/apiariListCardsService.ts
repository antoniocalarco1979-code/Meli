import type { Apiario, Arnia, Trattamento, Visita } from '../../../database/types'
import { withReadTransaction } from '../../../database/readTransaction'
import type { ApiarioView } from '../types'
import { formatApiarioComune, resolveApiarioStatus, type ApiarioStatus } from '../utils/apiarioStatus'
import { formatRelativeDate } from '../../../utils/dateFormatters'

const VISITA_RECENTE_MS = 10 * 86_400_000
const TRATTAMENTO_SCADENZA_WINDOW_MS = 14 * 86_400_000

export type ApiarioListCardData = {
  apiario: ApiarioView
  arnieCount: number
  ultimaVisitaLabel: string
  status: ApiarioStatus
  comuneLabel: string
}

function toApiarioView(apiario: Apiario): ApiarioView {
  return {
    ...apiario,
    foto: apiario.fotoCopertina,
    note: apiario.descrizione,
  }
}

function groupByApiarioId(arnie: Arnia[]): Map<string, Arnia[]> {
  const map = new Map<string, Arnia[]>()
  for (const arnia of arnie) {
    const list = map.get(arnia.apiarioId)
    if (list) list.push(arnia)
    else map.set(arnia.apiarioId, [arnia])
  }
  return map
}

function groupVisiteByArniaId(visite: Visita[]): Map<string, Visita[]> {
  const map = new Map<string, Visita[]>()
  for (const visita of visite) {
    const list = map.get(visita.arniaId)
    if (list) list.push(visita)
    else map.set(visita.arniaId, [visita])
  }
  return map
}

function computeOperationalMetrics(
  arnie: Arnia[],
  visiteByArniaId: Map<string, Visita[]>,
  trattamenti: Trattamento[],
): { arnieDaControllare: number; trattamentiInScadenza: number; regineDaSostituire: number } {
  if (arnie.length === 0) {
    return { arnieDaControllare: 0, trattamentiInScadenza: 0, regineDaSostituire: 0 }
  }

  const lastVisitaByArnia = new Map<string, Visita>()
  for (const arnia of arnie) {
    const visite = [...(visiteByArniaId.get(arnia.id) ?? [])].sort((a, b) => b.data - a.data)
    if (visite[0]) lastVisitaByArnia.set(arnia.id, visite[0])
  }

  const now = Date.now()
  let arnieDaControllare = 0
  let regineDaSostituire = 0

  for (const arnia of arnie) {
    if (arnia.stato === 'inattiva' || arnia.stato === 'morta') continue

    const lastVisita = lastVisitaByArnia.get(arnia.id)
    const visitaNonRecente = !lastVisita || now - lastVisita.data >= VISITA_RECENTE_MS
    if (visitaNonRecente) arnieDaControllare++

    if (arnia.stato === 'senza_regina' || lastVisita?.reginaVista === false) {
      regineDaSostituire++
    }
  }

  const arniaIds = new Set(arnie.map((a) => a.id))
  const trattamentiInScadenza = trattamenti.filter(
    (t) =>
      arniaIds.has(t.arniaId) &&
      t.scadenza != null &&
      t.scadenza <= now + TRATTAMENTO_SCADENZA_WINDOW_MS,
  ).length

  return { arnieDaControllare, trattamentiInScadenza, regineDaSostituire }
}

function computeUltimaVisitaLabel(arnie: Arnia[], visiteByArniaId: Map<string, Visita[]>): string {
  let latest: Visita | undefined
  for (const arnia of arnie) {
    const visite = visiteByArniaId.get(arnia.id) ?? []
    for (const visita of visite) {
      if (!latest || visita.data > latest.data) latest = visita
    }
  }
  return latest ? formatRelativeDate(latest.data) : '—'
}

/** Carica tutte le card apiario in un'unica transazione read (safe per liveQuery). */
export async function loadApiariListCards(): Promise<ApiarioListCardData[]> {
  try {
    return await withReadTransaction(async (db) => {
      const apiariRows = await db.apiari.orderBy('nome').toArray()
      if (apiariRows.length === 0) return []

      const apiarioViews = apiariRows.map(toApiarioView)
      const apiarioIds = apiarioViews.map((a) => a.id)

      const arnie = await db.arnie.where('apiarioId').anyOf(apiarioIds).toArray()
      const arnieByApiarioId = groupByApiarioId(arnie)
      const arniaIds = arnie.map((a) => a.id)

      const [visite, trattamenti] = await Promise.all([
        arniaIds.length > 0
          ? db.visite.where('arniaId').anyOf(arniaIds).toArray()
          : Promise.resolve([] as Visita[]),
        arniaIds.length > 0
          ? db.trattamenti.where('arniaId').anyOf(arniaIds).toArray()
          : Promise.resolve([] as Trattamento[]),
      ])

      const visiteByArniaId = groupVisiteByArniaId(visite)

      return apiarioViews.map((apiario) => {
        const apiarioArnie = arnieByApiarioId.get(apiario.id) ?? []
        const apiarioArniaIds = new Set(apiarioArnie.map((a) => a.id))
        const apiarioTrattamenti = trattamenti.filter((t) => apiarioArniaIds.has(t.arniaId))
        const operational = computeOperationalMetrics(
          apiarioArnie,
          visiteByArniaId,
          apiarioTrattamenti,
        )

        return {
          apiario,
          arnieCount: apiarioArnie.length,
          ultimaVisitaLabel: computeUltimaVisitaLabel(apiarioArnie, visiteByArniaId),
          status: resolveApiarioStatus(operational),
          comuneLabel: formatApiarioComune(apiario),
        } satisfies ApiarioListCardData
      })
    })
  } catch (err) {
    console.warn('[MELI] loadApiariListCards:', err)
    return []
  }
}

export type HomeApiarioCard = {
  id: string
  nome: string
  arnieCount: number
  ultimaVisitaLabel: string
  status: ApiarioStatus
}

/** Variante compatta per la home — stessa transazione batch. */
export async function loadHomeApiariCards(): Promise<HomeApiarioCard[]> {
  const cards = await loadApiariListCards()
  return cards.map((card) => ({
    id: card.apiario.id,
    nome: card.apiario.nome,
    arnieCount: card.arnieCount,
    ultimaVisitaLabel: card.ultimaVisitaLabel,
    status: card.status,
  }))
}
