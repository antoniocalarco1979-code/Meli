import type { ArniaStato, Trattamento, Visita } from '../../../database/types'
import { computeSaluteFromVisita } from './saluteScore'

const SALUTE_BASE: Record<ArniaStato, number> = {
  attiva: 70,
  debole: 45,
  senza_regina: 30,
  morta: 0,
  inattiva: 25,
}

/** Calcola indice salute 0–100 dal modello a punteggio o da fallback stato. */
export function computeSalute(
  stato: ArniaStato,
  ultimaVisita?: Visita,
  forzaFamiglia?: number,
  trattamentoRecente?: Trattamento,
): number {
  if (ultimaVisita) {
    return computeSaluteFromVisita(ultimaVisita, trattamentoRecente)
  }

  if (forzaFamiglia !== undefined) return forzaFamiglia

  return SALUTE_BASE[stato] ?? 50
}

export function formatRelativeDate(timestamp: number): string {
  const diff = Date.now() - timestamp
  const days = Math.floor(diff / 86_400_000)

  if (days <= 0) return 'Oggi'
  if (days === 1) return 'Ieri'
  if (days < 7) return `${days} giorni fa`
  if (days < 30) return `${Math.floor(days / 7)} sett. fa`
  return new Date(timestamp).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatReginaLabel(anno?: number, colore?: string): string {
  if (!anno && !colore) return '—'
  const colorLabel = colore ? colore.charAt(0).toUpperCase() + colore.slice(1) : ''
  return [anno, colorLabel].filter(Boolean).join(' ')
}

export function formatProduzioneKg(kg: number): string {
  return `${Math.round(kg)} Kg`
}

export function formatFullDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('it-IT', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export type SaluteLevel = 'green' | 'yellow' | 'red'

export function getSaluteLevel(value: number): SaluteLevel {
  if (value >= 70) return 'green'
  if (value >= 40) return 'yellow'
  return 'red'
}

export function computeReginaEta(anno?: number): string {
  if (!anno) return '—'
  const years = new Date().getFullYear() - anno
  if (years <= 0) return '< 1 anno'
  if (years === 1) return '1 anno'
  return `${years} anni`
}

export function formatReginaStato(stato: ArniaStato, hasRegina: boolean): string {
  if (!hasRegina || stato === 'senza_regina') return 'Assente'
  if (stato === 'debole') return 'Da monitorare'
  if (stato === 'morta' || stato === 'inattiva') return 'Non operativa'
  return 'Attiva'
}

export { SALUTE_WEIGHTS, buildSaluteScoreRows, computeSaluteBreakdown, computeSaluteScore } from './saluteScore'
export type { SaluteScoreBreakdown, SaluteScoreFlags } from './saluteScore'
