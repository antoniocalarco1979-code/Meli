import { apiariRepository, arnieRepository } from '../../../database/repositories'
import { getTrattamentoById } from '../../../database/services/trattamentiService'
import type { Trattamento, TrattamentoCalendarioPromemoria } from '../../../database/types'
import type { TrattamentoDetailView, UltimoTrattamentoSummary } from '../types/trattamento.types'
import {
  formatRelativeDate,
} from '../../../utils/dateFormatters'
import {
  formatTrattamentoDataLabel,
  formatTrattamentoMetodoLabel,
  formatTrattamentoPrincipio,
  formatTrattamentoTipoLabel,
} from '../utils/trattamentoFormatters'

export function buildUltimoTrattamentoSummary(
  trattamento?: Trattamento,
): UltimoTrattamentoSummary {
  if (!trattamento) {
    return { present: false, tipoLabel: '—', dataLabel: '—' }
  }

  return {
    present: true,
    id: trattamento.id,
    tipoLabel: formatTrattamentoTipoLabel(trattamento.tipo),
    dataLabel: formatRelativeDate(trattamento.data),
    dataFull: formatTrattamentoDataLabel(trattamento.data),
    principioAttivo: formatTrattamentoPrincipio(trattamento),
    promemoria: trattamento.promemoriaCalendario,
  }
}

export async function buildTrattamentoDetailView(
  trattamentoId: string,
): Promise<TrattamentoDetailView | null> {
  const trattamento = await getTrattamentoById(trattamentoId)
  if (!trattamento) return null

  const arnia = await arnieRepository.getById(trattamento.arniaId)
  const apiario = arnia ? await apiariRepository.getById(arnia.apiarioId) : undefined

  return {
    trattamento,
    arnia,
    apiario,
    tipoLabel: formatTrattamentoTipoLabel(trattamento.tipo),
    dataLabel: formatTrattamentoDataLabel(trattamento.data),
    metodoLabel: formatTrattamentoMetodoLabel(trattamento.metodo),
    promemoria: trattamento.promemoriaCalendario,
  }
}

export function formatPromemoriaLabel(promemoria?: TrattamentoCalendarioPromemoria): string | undefined {
  if (!promemoria) return undefined
  return `${promemoria.titolo} — ${new Date(promemoria.dataPromemoria).toLocaleDateString('it-IT')}`
}
