import { produzioneRepository } from '../repositories'
import type { Produzione, ProduzioneInput, ProduzioneUpdate } from '../types'

function normalizeProduzioneInput(input: ProduzioneInput): Omit<Produzione, 'id'> {
  return {
    arniaId: input.arniaId,
    data: input.data ?? input.dataRaccolta ?? Date.now(),
    kg: input.kg ?? input.quantita ?? 0,
    tipo: input.tipo,
  }
}

export async function getProduzioneByArniaId(arniaId: string) {
  return produzioneRepository.getByArniaId(arniaId)
}

export async function getProduzioneById(id: string) {
  return produzioneRepository.getById(id)
}

export async function createProduzione(input: ProduzioneInput) {
  return produzioneRepository.create(normalizeProduzioneInput(input))
}

export async function updateProduzione(id: string, input: ProduzioneUpdate) {
  return produzioneRepository.update(id, input)
}

export async function deleteProduzione(id: string) {
  return produzioneRepository.delete(id)
}
