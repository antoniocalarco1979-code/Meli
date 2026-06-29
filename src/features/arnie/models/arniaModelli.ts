import type { Arnia, ArniaModelloId } from '../../../database/types'

export type ArniaModelloPreset = {
  id: ArniaModelloId
  label: string
  numeroTelai: number | null
  hasMelario: boolean
  hasVassoioAntivarroa: boolean
}

export type ResolvedArniaModello = {
  modelloId: ArniaModelloId
  numeroTelai: number
  hasMelario: boolean
  hasVassoioAntivarroa: boolean
  modelloExtensions?: Record<string, unknown>
}

export const ARNIA_MODELLO_OPTIONS: { value: ArniaModelloId; label: string }[] = [
  { value: 'dadant_blatt_10', label: 'Dadant Blatt 10' },
  { value: 'dadant_blatt_12', label: 'Dadant Blatt 12' },
  { value: 'langstroth', label: 'Langstroth' },
  { value: 'warre', label: 'Warré' },
  { value: 'top_bar', label: 'Top Bar' },
  { value: 'orizzontale', label: 'Orizzontale' },
  { value: 'personalizzata', label: 'Personalizzata' },
]

/** Preset per modello — valori di default per telaini, melario e vassoio. */
export const ARNIA_MODELLI_PRESET: Record<ArniaModelloId, ArniaModelloPreset> = {
  dadant_blatt_10: {
    id: 'dadant_blatt_10',
    label: 'Dadant Blatt 10',
    numeroTelai: 10,
    hasMelario: true,
    hasVassoioAntivarroa: true,
  },
  dadant_blatt_12: {
    id: 'dadant_blatt_12',
    label: 'Dadant Blatt 12',
    numeroTelai: 12,
    hasMelario: true,
    hasVassoioAntivarroa: true,
  },
  langstroth: {
    id: 'langstroth',
    label: 'Langstroth',
    numeroTelai: 10,
    hasMelario: true,
    hasVassoioAntivarroa: true,
  },
  warre: {
    id: 'warre',
    label: 'Warré',
    numeroTelai: 4,
    hasMelario: false,
    hasVassoioAntivarroa: true,
  },
  top_bar: {
    id: 'top_bar',
    label: 'Top Bar',
    numeroTelai: 15,
    hasMelario: false,
    hasVassoioAntivarroa: false,
  },
  orizzontale: {
    id: 'orizzontale',
    label: 'Orizzontale',
    numeroTelai: 20,
    hasMelario: true,
    hasVassoioAntivarroa: true,
  },
  personalizzata: {
    id: 'personalizzata',
    label: 'Personalizzata',
    numeroTelai: null,
    hasMelario: true,
    hasVassoioAntivarroa: true,
  },
}

export const DEFAULT_ARNIA_MODELLO_ID: ArniaModelloId = 'dadant_blatt_10'

export function getModelloPreset(modelloId: ArniaModelloId): ArniaModelloPreset {
  return ARNIA_MODELLI_PRESET[modelloId]
}

export function getModelloLabel(modelloId: ArniaModelloId): string {
  return getModelloPreset(modelloId).label
}

export function isModelloPersonalizzato(modelloId: ArniaModelloId): boolean {
  return modelloId === 'personalizzata'
}

export function resolveArniaModello(
  modelloId: ArniaModelloId,
  telaiPersonalizzati?: number,
): ResolvedArniaModello {
  const preset = getModelloPreset(modelloId)

  if (isModelloPersonalizzato(modelloId)) {
    const numeroTelai = telaiPersonalizzati ?? 0
    return {
      modelloId,
      numeroTelai,
      hasMelario: preset.hasMelario,
      hasVassoioAntivarroa: preset.hasVassoioAntivarroa,
      modelloExtensions: { telaiPersonalizzati: numeroTelai },
    }
  }

  return {
    modelloId,
    numeroTelai: preset.numeroTelai ?? 0,
    hasMelario: preset.hasMelario,
    hasVassoioAntivarroa: preset.hasVassoioAntivarroa,
  }
}

export function getArniaModelloSummary(arnia: Pick<Arnia, 'modelloId' | 'numeroTelai' | 'hasMelario' | 'hasVassoioAntivarroa'>): string {
  const label = getModelloLabel(arnia.modelloId)
  const parts = [`${label} · ${arnia.numeroTelai} telaini`]
  if (arnia.hasMelario) parts.push('melario')
  if (arnia.hasVassoioAntivarroa) parts.push('vassoio antivarroa')
  return parts.join(' · ')
}
