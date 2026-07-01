import type { GiroApiario } from '../types'
import { giriRepository } from '../repositories/giriRepository'
import { now } from '../repositories/utils'

export type GiroIspezioneMeta = {
  fotoCount?: number
  hadTrattamento?: boolean
  reginaNonVista?: boolean
  hadNote?: boolean
}

export async function createGiroApiario(apiarioId: string): Promise<GiroApiario> {
  const active = await giriRepository.getActiveByApiarioId(apiarioId)
  if (active) {
    await giriRepository.updateStato(active.id, 'interrotto', {
      completedAt: now(),
      updatedAt: now(),
    })
  }

  const timestamp = now()
  return giriRepository.create({
    apiarioId,
    startedAt: timestamp,
    stato: 'in_corso',
    arnieVisitateIds: [],
    ispezioniCompletate: 0,
    trattamenti: 0,
    foto: 0,
    noteInserite: 0,
    regineDaControllare: 0,
    createdAt: timestamp,
    updatedAt: timestamp,
  })
}

export async function getActiveGiroByApiarioId(apiarioId: string): Promise<GiroApiario | undefined> {
  return giriRepository.getActiveByApiarioId(apiarioId)
}

export async function getGiroById(id: string): Promise<GiroApiario | undefined> {
  return giriRepository.getById(id)
}

export async function recordGiroIspezione(
  giroId: string,
  arniaId: string,
  meta: GiroIspezioneMeta = {},
): Promise<GiroApiario> {
  const giro = await giriRepository.getById(giroId)
  if (!giro) throw new Error('Giro apiario non trovato')

  const alreadyVisited = giro.arnieVisitateIds.includes(arniaId)
  const arnieVisitateIds = alreadyVisited
    ? giro.arnieVisitateIds
    : [...giro.arnieVisitateIds, arniaId]

  const updated: Partial<GiroApiario> = {
    arnieVisitateIds,
    ispezioniCompletate: giro.ispezioniCompletate + 1,
    trattamenti: (giro.trattamenti ?? 0) + (meta.hadTrattamento ? 1 : 0),
    foto: (giro.foto ?? 0) + (meta.fotoCount ?? 0),
    noteInserite: (giro.noteInserite ?? 0) + (meta.hadNote ? 1 : 0),
    regineDaControllare:
      (giro.regineDaControllare ?? 0) + (meta.reginaNonVista ? 1 : 0),
    updatedAt: now(),
  }

  await giriRepository.update(giroId, updated)
  const result = await giriRepository.getById(giroId)
  if (!result) throw new Error('Giro apiario non trovato')
  return result
}

export async function completeGiroApiario(giroId: string): Promise<GiroApiario> {
  const giro = await giriRepository.getById(giroId)
  if (!giro) throw new Error('Giro apiario non trovato')

  const completedAt = now()
  const durataSecondi = Math.max(0, Math.round((completedAt - giro.startedAt) / 1000))

  await giriRepository.update(giroId, {
    stato: 'completato',
    completedAt,
    durataSecondi,
    updatedAt: completedAt,
  })

  const result = await giriRepository.getById(giroId)
  if (!result) throw new Error('Giro apiario non trovato')
  return result
}

export async function deleteGiriByApiarioId(apiarioId: string): Promise<number> {
  return giriRepository.deleteByApiarioId(apiarioId)
}
