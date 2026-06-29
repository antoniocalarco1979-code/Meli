import { getDb } from '../../../database/activeDatabase'
import { visiteRepository } from '../../../database/repositories/visiteRepository'
import { generateIntelligenceSuggestions } from '../generateIntelligenceSuggestions'
import type { IntelligenceSuggestion } from '../types'
import { buildIntelligenceContext } from './intelligenceContextBuilder'

function compareArniaNumero(a: string, b: string): number {
  const na = Number.parseInt(a, 10)
  const nb = Number.parseInt(b, 10)
  if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb
  return a.localeCompare(b, 'it', { numeric: true })
}

export async function getMeliIntelligenceSuggestions(
  apiarioId: string,
): Promise<IntelligenceSuggestion[]> {
  const arnie = await getDb().arnie.where('apiarioId').equals(apiarioId).toArray()
  arnie.sort((a, b) => compareArniaNumero(a.numero, b.numero))

  const contexts = await Promise.all(
    arnie.map(async (arnia) => {
      const visite = await visiteRepository.getByArniaId(arnia.id)
      return buildIntelligenceContext(arnia, visite[0])
    }),
  )

  return generateIntelligenceSuggestions(contexts)
}
