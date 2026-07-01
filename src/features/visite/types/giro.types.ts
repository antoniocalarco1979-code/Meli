import type { GiroApiario } from '../../../database/types'

export type GiroSessionStats = {
  giroId: string
  startedAt: number
  completedAt?: number
  durataSecondi?: number
  totaleArnie: number
  arnieVisitate: number
  ispezioniCompletate: number
  visitedArniaIds: string[]
  trattamenti: number
  foto: number
  noteInserite: number
  regineDaControllare: number
}

export function createGiroSessionStats(
  totaleArnie: number,
  giroId: string,
  startedAt: number,
): GiroSessionStats {
  return {
    giroId,
    startedAt,
    totaleArnie,
    arnieVisitate: 0,
    ispezioniCompletate: 0,
    visitedArniaIds: [],
    trattamenti: 0,
    foto: 0,
    noteInserite: 0,
    regineDaControllare: 0,
  }
}

/** @deprecated use createGiroSessionStats */
export const emptyGiroSessionStats = (): GiroSessionStats =>
  createGiroSessionStats(0, '', Date.now())

export function giroEntityToSessionStats(
  giro: GiroApiario,
  totaleArnie: number,
): GiroSessionStats {
  return {
    giroId: giro.id,
    startedAt: giro.startedAt,
    completedAt: giro.completedAt,
    durataSecondi: giro.durataSecondi,
    totaleArnie,
    arnieVisitate: giro.arnieVisitateIds.length,
    ispezioniCompletate: giro.ispezioniCompletate,
    visitedArniaIds: [...giro.arnieVisitateIds],
    trattamenti: giro.trattamenti ?? 0,
    foto: giro.foto ?? 0,
    noteInserite: giro.noteInserite ?? 0,
    regineDaControllare: giro.regineDaControllare ?? 0,
  }
}

export function accumulateGiroStats(
  current: GiroSessionStats,
  visit: { fotoCount: number; hadTrattamento: boolean; reginaNonVista: boolean; hadNote: boolean },
  arniaId: string,
): GiroSessionStats {
  const alreadyVisited = current.visitedArniaIds.includes(arniaId)
  return {
    ...current,
    arnieVisitate: alreadyVisited ? current.arnieVisitate : current.arnieVisitate + 1,
    ispezioniCompletate: current.ispezioniCompletate + 1,
    visitedArniaIds: alreadyVisited
      ? current.visitedArniaIds
      : [...current.visitedArniaIds, arniaId],
    trattamenti: current.trattamenti + (visit.hadTrattamento ? 1 : 0),
    foto: current.foto + visit.fotoCount,
    noteInserite: current.noteInserite + (visit.hadNote ? 1 : 0),
    regineDaControllare: current.regineDaControllare + (visit.reginaNonVista ? 1 : 0),
  }
}
