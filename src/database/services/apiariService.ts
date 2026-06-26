import {
  apiariRepository,
  arnieRepository,
  fotoRepository,
  produzioneRepository,
  regineRepository,
  trattamentiRepository,
  visiteRepository,
} from '../repositories'
import type { Apiario, ApiarioInput, ApiarioUpdate, ApiarioView } from '../types'
import { db } from '../database'

/** Normalizza alias UI legacy verso campi schema definitivo. */
function normalizeApiarioInput(input: ApiarioInput): Omit<Apiario, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    nome: input.nome.trim(),
    localita: input.localita.trim(),
    descrizione: (input.descrizione ?? input.note ?? '').trim() || undefined,
    latitudine: input.latitudine,
    longitudine: input.longitudine,
    quota: input.quota,
    fotoCopertina: input.fotoCopertina ?? input.foto,
    numeroArnie: Math.max(0, input.numeroArnie),
  }
}

/** Aggiunge alias retrocompatibili per la UI esistente. */
function toApiarioView(apiario: Apiario): ApiarioView {
  return {
    ...apiario,
    foto: apiario.fotoCopertina,
    note: apiario.descrizione,
  }
}

export async function getAllApiari(): Promise<ApiarioView[]> {
  const apiari = await apiariRepository.getAll()
  return apiari.map(toApiarioView)
}

export async function getApiarioById(id: string): Promise<ApiarioView | undefined> {
  const apiario = await apiariRepository.getById(id)
  return apiario ? toApiarioView(apiario) : undefined
}

export async function countApiari(): Promise<number> {
  return apiariRepository.count()
}

export async function sumNumeroArnie(): Promise<number> {
  return apiariRepository.sumNumeroArnie()
}

export async function createApiario(input: ApiarioInput): Promise<ApiarioView> {
  const apiario = await apiariRepository.create(normalizeApiarioInput(input))
  return toApiarioView(apiario)
}

export async function updateApiario(id: string, input: ApiarioUpdate): Promise<void> {
  const normalized = normalizeApiarioInput({
    nome: input.nome ?? '',
    localita: input.localita ?? '',
    descrizione: input.descrizione,
    note: input.note,
    latitudine: input.latitudine,
    longitudine: input.longitudine,
    quota: input.quota,
    fotoCopertina: input.fotoCopertina ?? input.foto,
    numeroArnie: input.numeroArnie ?? 0,
  })

  const changes: Partial<Apiario> = {}
  if (input.nome !== undefined) changes.nome = normalized.nome
  if (input.localita !== undefined) changes.localita = normalized.localita
  if (input.descrizione !== undefined || input.note !== undefined) {
    changes.descrizione = normalized.descrizione
  }
  if (input.latitudine !== undefined) changes.latitudine = input.latitudine
  if (input.longitudine !== undefined) changes.longitudine = input.longitudine
  if (input.quota !== undefined) changes.quota = input.quota
  if (input.fotoCopertina !== undefined || input.foto !== undefined) {
    changes.fotoCopertina = normalized.fotoCopertina
  }
  if (input.numeroArnie !== undefined) changes.numeroArnie = normalized.numeroArnie

  if (Object.keys(changes).length > 0) {
    await apiariRepository.update(id, changes)
  }
}

/** Elimina un'arnia e tutte le entità collegate (cascade). */
export async function deleteArniaWithRelations(arniaId: string): Promise<void> {
  const visite = await visiteRepository.getByArniaId(arniaId)

  for (const visita of visite) {
    await fotoRepository.deleteByVisitaId(visita.id)
    await visiteRepository.delete(visita.id)
  }

  await trattamentiRepository.deleteByArniaId(arniaId)
  await produzioneRepository.deleteByArniaId(arniaId)
  await regineRepository.deleteByArniaId(arniaId)
  await fotoRepository.deleteByArniaId(arniaId)
  await arnieRepository.delete(arniaId)
}

/** Elimina un apiario e tutte le arnie collegate (cascade). */
export async function deleteApiario(id: string): Promise<void> {
  await db.transaction(
    'rw',
    [db.apiari, db.arnie, db.visite, db.regine, db.trattamenti, db.produzione, db.foto],
    async () => {
      const arnie = await arnieRepository.getByApiarioId(id)
      for (const arnia of arnie) {
        await deleteArniaWithRelations(arnia.id)
      }
      await fotoRepository.deleteByApiarioId(id)
      await apiariRepository.delete(id)
    },
  )
}
