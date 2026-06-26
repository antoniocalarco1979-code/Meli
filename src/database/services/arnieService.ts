import { deleteArniaWithRelations } from './apiariService'
import { apiariRepository, arnieRepository } from '../repositories'
import type { Arnia, ArniaInput, ArniaUpdate } from '../types'

function normalizeArniaInput(input: ArniaInput): Omit<Arnia, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    apiarioId: input.apiarioId,
    numero: input.numero ?? input.codice ?? '',
    nome: input.nome,
    qrCode: input.qrCode,
    stato: input.stato ?? 'attiva',
    forzaFamiglia: input.forzaFamiglia,
    fotoCopertina: input.fotoCopertina,
    note: input.note,
  }
}

export async function getAllArnie() {
  return arnieRepository.getAll()
}

export async function getArnieByApiarioId(apiarioId: string) {
  return arnieRepository.getByApiarioId(apiarioId)
}

export async function getArniaById(id: string) {
  return arnieRepository.getById(id)
}

export async function createArnia(input: ArniaInput) {
  const arnia = await arnieRepository.create(normalizeArniaInput(input))
  await syncApiarioArnieCount(input.apiarioId)
  return arnia
}

export async function updateArnia(id: string, input: ArniaUpdate) {
  await arnieRepository.update(id, input)
}

export async function deleteArnia(id: string) {
  const arnia = await arnieRepository.getById(id)
  if (!arnia) return
  await deleteArniaWithRelations(id)
  await syncApiarioArnieCount(arnia.apiarioId)
}

/** Aggiorna contatore denormalizzato sull'apiario padre. */
export async function syncApiarioArnieCount(apiarioId: string) {
  const count = await arnieRepository.countByApiarioId(apiarioId)
  await apiariRepository.update(apiarioId, { numeroArnie: count })
}
