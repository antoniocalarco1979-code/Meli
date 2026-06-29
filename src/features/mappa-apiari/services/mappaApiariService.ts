import { getDb } from '../../../database/activeDatabase'
import { formatRelativeDate } from '../../../utils/dateFormatters'
import type { ApiarioMapMarker, MappaApiariData } from '../types'

export async function getMappaApiariData(): Promise<MappaApiariData> {
  const [apiari, arnie, visite] = await Promise.all([
    getDb().apiari.orderBy('nome').toArray(),
    getDb().arnie.toArray(),
    getDb().visite.toArray(),
  ])

  const lastVisitaByArnia = new Map<string, number>()
  for (const visita of visite) {
    const current = lastVisitaByArnia.get(visita.arniaId)
    if (current == null || visita.data > current) {
      lastVisitaByArnia.set(visita.arniaId, visita.data)
    }
  }

  const lastVisitaByApiario = new Map<string, number>()
  for (const arnia of arnie) {
    const visitaData = lastVisitaByArnia.get(arnia.id)
    if (visitaData == null) continue

    const current = lastVisitaByApiario.get(arnia.apiarioId)
    if (current == null || visitaData > current) {
      lastVisitaByApiario.set(arnia.apiarioId, visitaData)
    }
  }

  const markers: ApiarioMapMarker[] = []
  let apiariSenzaCoordinate = 0

  for (const apiario of apiari) {
    if (apiario.latitudine == null || apiario.longitudine == null) {
      apiariSenzaCoordinate += 1
      continue
    }

    const ultimaVisitaData = lastVisitaByApiario.get(apiario.id)

    markers.push({
      id: apiario.id,
      nome: apiario.nome,
      latitudine: apiario.latitudine,
      longitudine: apiario.longitudine,
      numeroArnie: apiario.numeroArnie,
      ultimaVisitaLabel: ultimaVisitaData ? formatRelativeDate(ultimaVisitaData) : '—',
      ultimaVisitaData,
    })
  }

  return {
    markers,
    totaleApiari: apiari.length,
    apiariSenzaCoordinate,
  }
}
