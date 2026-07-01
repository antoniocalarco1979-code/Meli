import { apiariRepository, arnieRepository } from '../../../database/repositories'
import { getReginaById } from '../../../database/services/regineService'
import type { ReginaDetailView } from '../types/regina.types'
import {
  formatReginaColoreLabel,
  formatReginaDisplayTitle,
  formatReginaStatoOperativo,
} from '../utils/reginaFormatters'

export async function buildReginaDetailView(reginaId: string): Promise<ReginaDetailView | null> {
  const regina = await getReginaById(reginaId)
  if (!regina) return null

  const arnia = await arnieRepository.getById(regina.arniaId)
  const apiario = arnia ? await apiariRepository.getById(arnia.apiarioId) : undefined

  return {
    regina,
    arnia,
    apiario,
    isAttuale: arnia?.reginaAttualeId === regina.id,
    displayTitle: formatReginaDisplayTitle(regina),
    coloreLabel: formatReginaColoreLabel(regina.colore),
    statoLabel: formatReginaStatoOperativo(regina.stato),
  }
}
