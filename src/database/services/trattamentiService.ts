import { trattamentiRepository } from '../repositories'
import type { Trattamento, TrattamentoInput, TrattamentoUpdate } from '../types'

function normalizeTrattamentoInput(input: TrattamentoInput): Omit<Trattamento, 'id'> {
  return {
    arniaId: input.arniaId,
    data: input.data ?? input.dataProgrammata ?? Date.now(),
    prodotto: input.prodotto ?? input.tipo,
    dose: input.dose,
    scadenza: input.scadenza ?? input.dataProgrammata,
  }
}

export async function getTrattamentiByArniaId(arniaId: string) {
  return trattamentiRepository.getByArniaId(arniaId)
}

export async function getTrattamentoById(id: string) {
  return trattamentiRepository.getById(id)
}

export async function createTrattamento(input: TrattamentoInput) {
  return trattamentiRepository.create(normalizeTrattamentoInput(input))
}

export async function updateTrattamento(id: string, input: TrattamentoUpdate) {
  return trattamentiRepository.update(id, input)
}

export async function deleteTrattamento(id: string) {
  return trattamentiRepository.delete(id)
}

export async function getTrattamentiInScadenzaEntro(timestamp: number) {
  return trattamentiRepository.getInScadenzaEntro(timestamp)
}
