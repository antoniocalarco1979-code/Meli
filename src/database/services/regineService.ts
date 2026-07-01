import { arnieRepository, regineRepository } from '../repositories'
import type { Regina, ReginaInput, ReginaUpdate } from '../types'
import { now } from '../repositories/utils'

function normalizeReginaInput(input: ReginaInput): Omit<Regina, 'id' | 'createdAt' | 'updatedAt'> {
  const provenienza = input.provenienza?.trim() || input.origine?.trim()
  const colore = input.colore?.trim().toLowerCase()

  return {
    arniaId: input.arniaId,
    numero: input.numero.trim(),
    nome: input.nome?.trim() || undefined,
    anno: input.anno,
    colore: colore || undefined,
    razza: input.razza?.trim() || undefined,
    provenienza,
    allevatore: input.allevatore?.trim() || undefined,
    origineTipo: input.origineTipo,
    origine: provenienza,
    stato: input.stato ?? 'fecondata',
    marcata: input.marcata,
    dataNascita: input.dataNascita,
    dataInserimento: input.dataInserimento,
    dataSostituzione: input.dataSostituzione,
    valDocilita: input.valDocilita,
    valProduttivita: input.valProduttivita,
    valSciamatura: input.valSciamatura,
    valPulizia: input.valPulizia,
    valResistenzaVarroa: input.valResistenzaVarroa,
    note: input.note?.trim() || undefined,
  }
}

export async function getAllRegine() {
  return regineRepository.getAll()
}

export async function getReginaById(id: string) {
  return regineRepository.getById(id)
}

export async function getRegineByArniaId(arniaId: string) {
  return regineRepository.getByArniaId(arniaId)
}

export async function getReginaAttuale(arniaId: string) {
  return regineRepository.getAttualeByArniaId(arniaId)
}

/** Crea una regina e opzionalmente la imposta come attuale sull'arnia. */
export async function createRegina(input: ReginaInput) {
  const timestamp = now()
  const regina = await regineRepository.create({
    ...normalizeReginaInput(input),
    createdAt: timestamp,
    updatedAt: timestamp,
  })

  if (input.impostaComeAttuale !== false) {
    await arnieRepository.update(input.arniaId, { reginaAttualeId: regina.id })
  }

  return regina
}

export async function updateRegina(id: string, input: ReginaUpdate) {
  const changes: Partial<Regina> = { updatedAt: now() }

  if (input.numero !== undefined) changes.numero = input.numero.trim()
  if (input.nome !== undefined) changes.nome = input.nome.trim() || undefined
  if (input.anno !== undefined) changes.anno = input.anno
  if (input.colore !== undefined) changes.colore = input.colore.trim().toLowerCase() || undefined
  if (input.razza !== undefined) changes.razza = input.razza.trim() || undefined
  if (input.provenienza !== undefined) {
    changes.provenienza = input.provenienza.trim() || undefined
    changes.origine = changes.provenienza
  }
  if (input.origine !== undefined && input.provenienza === undefined) {
    changes.origine = input.origine.trim() || undefined
    changes.provenienza = changes.origine
  }
  if (input.allevatore !== undefined) changes.allevatore = input.allevatore.trim() || undefined
  if (input.origineTipo !== undefined) changes.origineTipo = input.origineTipo
  if (input.stato !== undefined) changes.stato = input.stato
  if (input.marcata !== undefined) changes.marcata = input.marcata
  if (input.dataNascita !== undefined) changes.dataNascita = input.dataNascita
  if (input.dataInserimento !== undefined) changes.dataInserimento = input.dataInserimento
  if (input.dataSostituzione !== undefined) changes.dataSostituzione = input.dataSostituzione
  if (input.valDocilita !== undefined) changes.valDocilita = input.valDocilita
  if (input.valProduttivita !== undefined) changes.valProduttivita = input.valProduttivita
  if (input.valSciamatura !== undefined) changes.valSciamatura = input.valSciamatura
  if (input.valPulizia !== undefined) changes.valPulizia = input.valPulizia
  if (input.valResistenzaVarroa !== undefined) changes.valResistenzaVarroa = input.valResistenzaVarroa
  if (input.note !== undefined) changes.note = input.note.trim() || undefined

  await regineRepository.update(id, changes)
}

export async function impostaReginaAttuale(arniaId: string, reginaId: string) {
  await arnieRepository.update(arniaId, { reginaAttualeId: reginaId })
}

/** Sostituisce la regina attuale: archivia la precedente e crea la nuova collegata all'arnia. */
export async function sostituisciRegina(
  arniaId: string,
  nuovaRegina: Omit<ReginaInput, 'arniaId' | 'impostaComeAttuale'>,
  visitaData: number,
) {
  const attuale = await getReginaAttuale(arniaId)
  if (attuale) {
    await updateRegina(attuale.id, {
      stato: 'persa',
      dataSostituzione: visitaData,
    })
  }

  return createRegina({
    arniaId,
    ...nuovaRegina,
    numero: nuovaRegina.numero.trim(),
    dataInserimento: nuovaRegina.dataInserimento ?? visitaData,
    impostaComeAttuale: true,
  })
}
