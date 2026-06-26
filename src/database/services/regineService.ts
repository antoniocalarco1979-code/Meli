import { arnieRepository, regineRepository } from '../repositories'
import type { ReginaInput, ReginaUpdate } from '../types'

export async function getRegineByArniaId(arniaId: string) {
  return regineRepository.getByArniaId(arniaId)
}

export async function getReginaAttuale(arniaId: string) {
  return regineRepository.getAttualeByArniaId(arniaId)
}

/** Crea una regina e opzionalmente la imposta come attuale sull'arnia. */
export async function createRegina(input: ReginaInput) {
  const regina = await regineRepository.create({
    arniaId: input.arniaId,
    anno: input.anno,
    colore: input.colore,
    razza: input.razza,
    origine: input.origine,
    marcata: input.marcata,
    note: input.note,
  })

  if (input.impostaComeAttuale !== false) {
    await arnieRepository.update(input.arniaId, { reginaAttualeId: regina.id })
  }

  return regina
}

export async function updateRegina(id: string, input: ReginaUpdate) {
  await regineRepository.update(id, input)
}

export async function impostaReginaAttuale(arniaId: string, reginaId: string) {
  await arnieRepository.update(arniaId, { reginaAttualeId: reginaId })
}
