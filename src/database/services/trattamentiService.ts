import { trattamentiRepository } from '../repositories'
import { generateId, now } from '../repositories/utils'
import type { Trattamento, TrattamentoInput, TrattamentoUpdate } from '../types'
import { buildTrattamentoCalendarioPromemoria } from '../../features/trattamenti/services/trattamentoReminderService'

function normalizeTrattamentoInput(input: TrattamentoInput): Omit<Trattamento, 'id' | 'createdAt' | 'updatedAt' | 'promemoriaCalendario'> {
  const principioAttivo = input.principioAttivo?.trim() || input.prodotto?.trim()
  const scadenza = input.scadenza ?? input.dataProgrammata

  return {
    arniaId: input.arniaId,
    visitaId: input.visitaId,
    data: input.data ?? Date.now(),
    tipo: input.tipo?.trim() || undefined,
    principioAttivo,
    prodotto: principioAttivo,
    dose: input.dose?.trim() || undefined,
    metodo: input.metodo?.trim() || undefined,
    note: input.note?.trim() || undefined,
    scadenza,
  }
}

export async function getAllTrattamenti() {
  return trattamentiRepository.getAll()
}

export async function getTrattamentiByArniaId(arniaId: string) {
  return trattamentiRepository.getByArniaId(arniaId)
}

export async function getTrattamentoById(id: string) {
  return trattamentiRepository.getById(id)
}

export async function createTrattamento(input: TrattamentoInput) {
  const timestamp = now()
  const base = normalizeTrattamentoInput(input)
  const draft: Omit<Trattamento, 'id'> = {
    ...base,
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  const id = generateId()
  const withId: Trattamento = { id, ...draft }
  const promemoriaCalendario = buildTrattamentoCalendarioPromemoria(withId, generateId)

  const trattamento: Trattamento = {
    ...withId,
    promemoriaCalendario,
  }

  await trattamentiRepository.create(trattamento)
  return trattamento
}

export async function updateTrattamento(id: string, input: TrattamentoUpdate) {
  const changes: Partial<Trattamento> = { updatedAt: now() }

  if (input.tipo !== undefined) changes.tipo = input.tipo.trim() || undefined
  if (input.principioAttivo !== undefined) {
    changes.principioAttivo = input.principioAttivo.trim() || undefined
    changes.prodotto = changes.principioAttivo
  }
  if (input.prodotto !== undefined && input.principioAttivo === undefined) {
    changes.prodotto = input.prodotto.trim() || undefined
    changes.principioAttivo = changes.prodotto
  }
  if (input.dose !== undefined) changes.dose = input.dose.trim() || undefined
  if (input.metodo !== undefined) changes.metodo = input.metodo.trim() || undefined
  if (input.note !== undefined) changes.note = input.note.trim() || undefined
  if (input.data !== undefined) changes.data = input.data
  if (input.scadenza !== undefined) changes.scadenza = input.scadenza
  if (input.visitaId !== undefined) changes.visitaId = input.visitaId
  if (input.promemoriaCalendario !== undefined) changes.promemoriaCalendario = input.promemoriaCalendario

  await trattamentiRepository.update(id, changes)

  const updated = await trattamentiRepository.getById(id)
  if (updated && (input.scadenza !== undefined || input.tipo !== undefined || input.principioAttivo !== undefined)) {
    const promemoriaCalendario = buildTrattamentoCalendarioPromemoria(updated, generateId)
    if (promemoriaCalendario) {
      await trattamentiRepository.update(id, { promemoriaCalendario, updatedAt: now() })
    }
  }
}

export async function deleteTrattamento(id: string) {
  return trattamentiRepository.delete(id)
}

export async function getTrattamentiInScadenzaEntro(timestamp: number) {
  return trattamentiRepository.getInScadenzaEntro(timestamp)
}

export async function getTrattamentiPromemoriaProgrammati() {
  return trattamentiRepository.getPromemoriaProgrammati()
}
