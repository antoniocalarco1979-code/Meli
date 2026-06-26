import { fotoRepository } from '../repositories'
import type { Foto, FotoInput, FotoUpdate } from '../types'
import { now } from '../repositories/utils'

function normalizeFotoInput(input: FotoInput): Omit<Foto, 'id'> {
  return {
    path: input.path ?? input.dataUrl ?? '',
    visitaId: input.visitaId,
    arniaId: input.arniaId,
    apiarioId: input.apiarioId,
    thumbnail: input.thumbnail,
    data: input.data ?? now(),
  }
}

export async function getFotoByVisitaId(visitaId: string) {
  return fotoRepository.getByVisitaId(visitaId)
}

export async function getFotoByApiarioId(apiarioId: string) {
  return fotoRepository.getByApiarioId(apiarioId)
}

export async function getFotoByArniaId(arniaId: string) {
  return fotoRepository.getByArniaId(arniaId)
}

export async function createFoto(input: FotoInput) {
  return fotoRepository.create(normalizeFotoInput(input))
}

export async function updateFoto(id: string, input: FotoUpdate) {
  return fotoRepository.update(id, input)
}

export async function deleteFoto(id: string) {
  return fotoRepository.delete(id)
}
