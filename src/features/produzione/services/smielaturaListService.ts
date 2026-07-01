import { apiariRepository, arnieRepository } from '../../../database/repositories'
import { getAllSmielature } from '../../../database/services/produzioneService'
import type { SmielaturaListItem } from '../types/smielatura.types'
import {
  formatKgLabel,
  formatMelariLabel,
  formatSmielaturaDataLabel,
  formatUmiditaLabel,
} from '../utils/smielaturaFormatters'

export async function buildSmielaturaListItems(): Promise<SmielaturaListItem[]> {
  const smielature = await getAllSmielature()
  const apiarioIds = [...new Set(smielature.map((row) => row.apiarioId).filter(Boolean))] as string[]
  const apiari = await Promise.all(apiarioIds.map((id) => apiariRepository.getById(id)))
  const apiarioMap = new Map(apiari.filter(Boolean).map((item) => [item!.id, item!]))

  const arniaIdSet = new Set<string>()
  for (const row of smielature) {
    row.arnieCoinvolteIds?.forEach((id) => arniaIdSet.add(id))
  }
  const arnie = await Promise.all([...arniaIdSet].map((id) => arnieRepository.getById(id)))
  const arniaMap = new Map(arnie.filter(Boolean).map((item) => [item!.id, item!]))

  return smielature.map((smielatura) => {
    const apiario = smielatura.apiarioId ? apiarioMap.get(smielatura.apiarioId) : undefined
    const arnieCoinvolte = (smielatura.arnieCoinvolteIds ?? [])
      .map((id) => arniaMap.get(id))
      .filter(Boolean) as NonNullable<(typeof arnie)[number]>[]

    return {
      smielatura,
      apiario,
      arnie: arnieCoinvolte,
      dataLabel: formatSmielaturaDataLabel(smielatura.data),
      kgLabel: formatKgLabel(smielatura.kg),
      melariLabel: formatMelariLabel(smielatura.numeroMelari),
      umiditaLabel: formatUmiditaLabel(smielatura.umidita),
    }
  })
}
