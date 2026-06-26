import { fotoRepository, visiteRepository } from '../repositories'
import type { VisitaInput, VisitaUpdate } from '../types'

export async function getVisiteByArniaId(arniaId: string) {
  return visiteRepository.getByArniaId(arniaId)
}

export async function getVisitaById(id: string) {
  return visiteRepository.getById(id)
}

export async function createVisita(input: VisitaInput) {
  return visiteRepository.create(input)
}

export async function updateVisita(id: string, input: VisitaUpdate) {
  return visiteRepository.update(id, input)
}

export async function deleteVisita(id: string) {
  await fotoRepository.deleteByVisitaId(id)
  await visiteRepository.delete(id)
}
