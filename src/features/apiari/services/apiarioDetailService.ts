import { getDb } from '../../../database/activeDatabase'
import type { ApiarioView } from '../../../database/types'
import { formatRelativeDate } from '../../../utils/dateFormatters'

export type ApiarioStatistiche = {
  numeroVisite: number
  ultimaVisitaLabel: string
  mediaVisite: number
  produzioneTotaleLabel: string
}

export type ApiarioDetailView = {
  apiario: ApiarioView
  arnieCount: number
  famiglieCount: number
  statistiche: ApiarioStatistiche
}

export async function buildApiarioDetailView(
  apiarioId: string,
): Promise<ApiarioDetailView | undefined> {
  try {
    const db = getDb()
    const apiarioRow = await db.apiari.get(apiarioId)
    if (!apiarioRow) return undefined

    const apiario = {
      ...apiarioRow,
      foto: apiarioRow.fotoCopertina,
      note: apiarioRow.descrizione,
    } satisfies ApiarioView

    const arnie = await db.arnie.where('apiarioId').equals(apiarioId).toArray()
    const arniaIds = arnie.map((a) => a.id)

    const [visite, produzione] = await Promise.all([
      arniaIds.length
        ? db.visite.where('arniaId').anyOf(arniaIds).toArray()
        : Promise.resolve([]),
      arniaIds.length
        ? db.produzione.where('arniaId').anyOf(arniaIds).toArray()
        : Promise.resolve([]),
    ])

    const famiglieCount = arnie.filter(
      (a) => a.stato !== 'morta' && a.stato !== 'inattiva',
    ).length

    const sortedVisite = [...visite].sort((a, b) => b.data - a.data)
    const ultimaVisita = sortedVisite[0]
    const numeroVisite = visite.length
    const mediaVisite =
      arnie.length > 0 ? Math.round((numeroVisite / arnie.length) * 10) / 10 : 0

    const produzioneTotale = produzione.reduce((sum, row) => sum + row.kg, 0)
    const produzioneTotaleLabel =
      produzioneTotale > 0 ? `${produzioneTotale.toFixed(1)} kg` : 'Prossimamente'

    return {
      apiario,
      arnieCount: arnie.length,
      famiglieCount,
      statistiche: {
        numeroVisite,
        ultimaVisitaLabel: ultimaVisita ? formatRelativeDate(ultimaVisita.data) : '—',
        mediaVisite,
        produzioneTotaleLabel,
      },
    }
  } catch (err) {
    console.warn('[MELI] buildApiarioDetailView:', err)
    return undefined
  }
}
