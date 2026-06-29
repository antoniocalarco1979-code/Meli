import { getDb } from '../../../database/activeDatabase'
import { visiteRepository } from '../../../database/repositories/visiteRepository'
import {
  analyzeVisitaSalvata,
  buildAzioneRuleContextFromVisita,
  generateAzioniConsigliate,
} from '../generateAzioniConsigliate'
import type { AzioneConsigliataConArnia, AzionePriorita } from '../types'

const PRIORITA_ORDER: Record<AzionePriorita, number> = {
  urgente: 0,
  importante: 1,
  programmare: 2,
}

function compareArniaNumero(a: string, b: string): number {
  const na = Number.parseInt(a, 10)
  const nb = Number.parseInt(b, 10)
  if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb
  return a.localeCompare(b, 'it', { numeric: true })
}

export async function getApiarioAzioniConsigliate(
  apiarioId: string,
): Promise<AzioneConsigliataConArnia[]> {
  const arnie = await getDb().arnie.where('apiarioId').equals(apiarioId).toArray()
  arnie.sort((a, b) => compareArniaNumero(a.numero, b.numero))

  const nested = await Promise.all(
    arnie.map(async (arnia) => {
      const visite = await visiteRepository.getByArniaId(arnia.id)
      const ultimaVisita = visite[0]
      const azioni = ultimaVisita
        ? generateAzioniConsigliate(buildAzioneRuleContextFromVisita(ultimaVisita))
        : []

      return azioni.map((azione) => ({
        ...azione,
        arniaId: arnia.id,
        arniaNumero: arnia.numero,
      }))
    }),
  )

  return nested
    .flat()
    .sort(
      (a, b) =>
        PRIORITA_ORDER[a.priorita] - PRIORITA_ORDER[b.priorita] ||
        compareArniaNumero(a.arniaNumero, b.arniaNumero),
    )
}

export { analyzeVisitaSalvata }
