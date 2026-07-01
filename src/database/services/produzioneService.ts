import { apiariRepository, produzioneRepository } from '../repositories'
import type { Produzione, ProduzioneInput, ProduzioneUpdate, SmielaturaInput } from '../types'

const SMIELATURA_TIPO = 'smielatura'

function normalizeProduzioneInput(input: ProduzioneInput): Omit<Produzione, 'id'> {
  const now = Date.now()
  return {
    arniaId: input.arniaId,
    data: input.data ?? input.dataRaccolta ?? now,
    kg: input.kg ?? input.quantita ?? 0,
    tipo: input.tipo ?? 'miele',
    createdAt: now,
    updatedAt: now,
  }
}

function currentYearBounds(): { start: number; end: number } {
  const now = new Date()
  return {
    start: new Date(now.getFullYear(), 0, 1).getTime(),
    end: new Date(now.getFullYear() + 1, 0, 1).getTime(),
  }
}

export async function getProduzioneByArniaId(arniaId: string) {
  return produzioneRepository.getByArniaId(arniaId)
}

export async function getProduzioneById(id: string) {
  return produzioneRepository.getById(id)
}

export async function getAllSmielature() {
  return produzioneRepository.getAllSmielature()
}

export async function getSmielatureByApiarioId(apiarioId: string) {
  return produzioneRepository.getSmielatureByApiarioId(apiarioId)
}

export async function getProduzioneAnnoCorrenteKg(): Promise<number> {
  const { start, end } = currentYearBounds()
  const smielature = await produzioneRepository.getAllSmielature()
  return smielature
    .filter((row) => row.data >= start && row.data < end)
    .reduce((sum, row) => sum + row.kg, 0)
}

export async function syncApiarioProduzioneTotals(apiarioId: string): Promise<void> {
  const smielature = await produzioneRepository.getSmielatureByApiarioId(apiarioId)
  const rows = smielature.filter((row) => row.tipo === SMIELATURA_TIPO)
  const { start, end } = currentYearBounds()

  const kgTotale = rows.reduce((sum, row) => sum + row.kg, 0)
  const kgAnno = rows
    .filter((row) => row.data >= start && row.data < end)
    .reduce((sum, row) => sum + row.kg, 0)

  await apiariRepository.update(apiarioId, {
    kgProduzioneTotale: kgTotale,
    kgProduzioneAnno: kgAnno,
    updatedAt: Date.now(),
  })
}

export async function createProduzione(input: ProduzioneInput) {
  return produzioneRepository.create(normalizeProduzioneInput(input))
}

export async function createSmielatura(input: SmielaturaInput): Promise<Produzione> {
  const now = Date.now()
  const record = await produzioneRepository.create({
    apiarioId: input.apiarioId,
    data: input.data,
    kg: input.kg,
    numeroMelari: input.numeroMelari,
    umidita: input.umidita,
    arnieCoinvolteIds: input.arnieCoinvolteIds?.length ? input.arnieCoinvolteIds : undefined,
    note: input.note?.trim() || undefined,
    tipo: SMIELATURA_TIPO,
    createdAt: now,
    updatedAt: now,
  })

  await syncApiarioProduzioneTotals(input.apiarioId)
  return record
}

export async function updateProduzione(id: string, input: ProduzioneUpdate) {
  return produzioneRepository.update(id, { ...input, updatedAt: Date.now() })
}

export async function deleteProduzione(id: string) {
  const existing = await produzioneRepository.getById(id)
  await produzioneRepository.delete(id)
  if (existing?.apiarioId && existing.tipo === SMIELATURA_TIPO) {
    await syncApiarioProduzioneTotals(existing.apiarioId)
  }
}
