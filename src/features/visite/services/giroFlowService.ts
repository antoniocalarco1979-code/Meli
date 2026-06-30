import {
  completeGiroApiario,
  createGiroApiario,
  recordGiroIspezione,
} from '../../../database/services/giriService'
import { getArnieEnrichedByApiarioId } from '../../arnie/services/arniaDetailService'
import { giroEntityToSessionStats, type GiroSessionStats } from '../types/giro.types'
import type { GiroReturnContext } from '../types/visitFlow.types'
import type { VisitaSaveSummary } from '../types/visitSave.types'

export type GiroStartPayload = {
  firstArniaId: string
  giroReturn: GiroReturnContext
}

export type GiroAdvanceResult =
  | {
      kind: 'next'
      nextArniaId: string
      giroReturn: GiroReturnContext
    }
  | {
      kind: 'complete'
      apiarioId: string
      stats: GiroSessionStats
      completedThrough: number
    }

function resolveGiroId(giroReturn: GiroReturnContext): string {
  const giroId = giroReturn.giroStats.giroId || giroReturn.giroId
  if (!giroId) {
    throw new Error('Sessione giro non valida')
  }
  return giroId
}

export async function startGiroSession(
  apiarioId: string,
  apiarioNome: string,
): Promise<GiroStartPayload | null> {
  const arnie = await getArnieEnrichedByApiarioId(apiarioId)
  if (arnie.length === 0) return null

  const giro = await createGiroApiario(apiarioId)
  const arniaIds = arnie.map((item) => item.arnia.id)
  const giroReturn: GiroReturnContext = {
    giroId: giro.id,
    apiarioId,
    apiarioNome,
    arniaIndex: 0,
    giroActive: true,
    giroStats: giroEntityToSessionStats(giro, arniaIds.length),
    arniaIds,
    completedThrough: -1,
  }

  return {
    firstArniaId: arniaIds[0],
    giroReturn,
  }
}

export async function advanceGiroAfterSavedVisit(
  giroReturn: GiroReturnContext,
  arniaId: string,
  summary: VisitaSaveSummary,
): Promise<GiroAdvanceResult> {
  const giroId = resolveGiroId(giroReturn)
  const updatedGiro = await recordGiroIspezione(giroId, arniaId, {
    fotoCount: summary.fotoCount,
    hadTrattamento: summary.hadTrattamento,
    reginaNonVista: summary.reginaNonVista,
  })

  const arniaIds =
    giroReturn.arniaIds ??
    (await getArnieEnrichedByApiarioId(giroReturn.apiarioId)).map((item) => item.arnia.id)

  const completedThrough = Math.max(giroReturn.completedThrough, giroReturn.arniaIndex)
  const nextIndex = giroReturn.arniaIndex + 1
  const stats = giroEntityToSessionStats(updatedGiro, arniaIds.length)

  if (nextIndex >= arniaIds.length) {
    const completed = await completeGiroApiario(giroId)
    return {
      kind: 'complete',
      apiarioId: giroReturn.apiarioId,
      stats: giroEntityToSessionStats(completed, arniaIds.length),
      completedThrough: arniaIds.length - 1,
    }
  }

  return {
    kind: 'next',
    nextArniaId: arniaIds[nextIndex],
    giroReturn: {
      ...giroReturn,
      giroId,
      arniaIndex: nextIndex,
      giroStats: stats,
      arniaIds,
      completedThrough,
    },
  }
}

export function buildGiroReturnForIndex(
  base: GiroReturnContext,
  index: number,
  completedThrough: number,
): GiroReturnContext {
  return {
    ...base,
    arniaIndex: index,
    completedThrough,
  }
}
