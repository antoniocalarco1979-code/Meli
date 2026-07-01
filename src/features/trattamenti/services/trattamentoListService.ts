import { apiariRepository, arnieRepository } from '../../../database/repositories'
import { getAllTrattamenti } from '../../../database/services/trattamentiService'
import type { TrattamentoListItem } from '../types/trattamento.types'
import {
  formatTrattamentoDataLabel,
  formatTrattamentoPrincipio,
  formatTrattamentoTipoLabel,
} from '../utils/trattamentoFormatters'

export async function buildTrattamentoListItems(): Promise<TrattamentoListItem[]> {
  const trattamenti = await getAllTrattamenti()
  const arniaIds = [...new Set(trattamenti.map((t) => t.arniaId))]
  const arnie = await Promise.all(arniaIds.map((id) => arnieRepository.getById(id)))
  const arniaMap = new Map(arnie.filter(Boolean).map((a) => [a!.id, a!]))

  const apiarioIds = [...new Set([...arniaMap.values()].map((a) => a.apiarioId))]
  const apiari = await Promise.all(apiarioIds.map((id) => apiariRepository.getById(id)))
  const apiarioMap = new Map(apiari.filter(Boolean).map((a) => [a!.id, a!]))

  return trattamenti.map((trattamento) => {
    const arnia = arniaMap.get(trattamento.arniaId)
    const apiario = arnia ? apiarioMap.get(arnia.apiarioId) : undefined

    return {
      trattamento,
      arnia,
      apiario,
      tipoLabel: formatTrattamentoTipoLabel(trattamento.tipo),
      dataLabel: formatTrattamentoDataLabel(trattamento.data),
      principioLabel: formatTrattamentoPrincipio(trattamento),
      hasPromemoria: trattamento.promemoriaCalendario?.stato === 'programmato',
    }
  })
}
