import { apiariRepository, arnieRepository } from '../../../database/repositories'
import { getAllRegine } from '../../../database/services/regineService'
import type { ReginaListItem } from '../types/regina.types'
import {
  formatReginaColoreLabel,
  formatReginaDisplayTitle,
  formatReginaStatoOperativo,
  formatReginaSubtitle,
} from '../utils/reginaFormatters'

export async function buildReginaListItems(): Promise<ReginaListItem[]> {
  const regine = await getAllRegine()
  const arniaIds = [...new Set(regine.map((r) => r.arniaId))]
  const arnie = await Promise.all(arniaIds.map((id) => arnieRepository.getById(id)))
  const arniaMap = new Map(arnie.filter(Boolean).map((a) => [a!.id, a!]))

  const apiarioIds = [...new Set([...arniaMap.values()].map((a) => a.apiarioId))]
  const apiari = await Promise.all(apiarioIds.map((id) => apiariRepository.getById(id)))
  const apiarioMap = new Map(apiari.filter(Boolean).map((a) => [a!.id, a!]))

  return regine.map((regina) => {
    const arnia = arniaMap.get(regina.arniaId)
    const apiario = arnia ? apiarioMap.get(arnia.apiarioId) : undefined
    const isAttuale = arnia?.reginaAttualeId === regina.id

    return {
      regina,
      arnia,
      apiario,
      isAttuale,
      displayTitle: formatReginaDisplayTitle(regina),
      displaySubtitle: formatReginaSubtitle(regina, arnia?.numero),
      coloreLabel: formatReginaColoreLabel(regina.colore),
      statoLabel: formatReginaStatoOperativo(regina.stato),
    }
  })
}
