import type { ArniaStato, Trattamento, Visita } from '../../../database/types'
import { computeSaluteFromVisita } from '../../../utils/salute'

export { formatFullDate, formatRelativeDate } from '../../../utils/dateFormatters'
export { getSaluteLevel } from '../../../utils/salute'
export type { SaluteLevel } from '../../../utils/salute'

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

export function formatReginaLabel(anno?: number, colore?: string): string {
  if (!anno && !colore) return '—'
  const colorLabel = colore ? colore.charAt(0).toUpperCase() + colore.slice(1) : ''
  return [anno, colorLabel].filter(Boolean).join(' ')
}

const REGINA_COLORE_EMOJI: Record<string, string> = {
  bianca: '⚪',
  gialla: '🟡',
  rossa: '🔴',
  verde: '🟢',
  blu: '🔵',
}

export function formatReginaColoreDisplay(colore?: string): string | undefined {
  if (!colore?.trim()) return undefined
  const key = colore.trim().toLowerCase()
  const emoji = REGINA_COLORE_EMOJI[key]
  const label = colore.charAt(0).toUpperCase() + colore.slice(1).toLowerCase()
  return emoji ? `${emoji} ${label}` : label
}

export function saluteLevelEmoji(level: 'green' | 'yellow' | 'red'): string {
  return { green: '🟢', yellow: '🟡', red: '🔴' }[level]
}

export type SaluteStatoLabel = 'Ottima' | 'Buona' | 'Attenzione' | 'Critica'

export function formatSaluteStatoLabel(value: number): SaluteStatoLabel {
  if (value >= 85) return 'Ottima'
  if (value >= 70) return 'Buona'
  if (value >= 40) return 'Attenzione'
  return 'Critica'
}

export function saluteStatoModifier(label: SaluteStatoLabel): string {
  return label.toLowerCase()
}

export function buildVisitaRiepilogo(visita: Pick<Visita, 'reginaVista' | 'comportamento' | 'covata' | 'scorte'>): string {
  const parts: string[] = []
  const regina = formatReginaVisitaDisplay(visita)
  if (regina !== '—') parts.push(`Regina ${regina.toLowerCase()}`)
  const covata = formatCovataDisplay(visita.covata)
  if (covata !== '—') parts.push(`Covata ${covata.toLowerCase()}`)
  const scorte = formatScorteDisplay(visita.scorte)
  if (scorte !== '—') parts.push(`Scorte ${scorte.toLowerCase()}`)
  return parts.length > 0 ? parts.join(' · ') : 'Visita registrata'
}

export function formatProduzioneKg(kg: number): string {
  return `${Math.round(kg)} Kg`
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

export function formatReginaVisitaDisplay(
  visita?: Pick<Visita, 'reginaVista' | 'comportamento'>,
): string {
  if (!visita) return '—'
  if (visita.comportamento?.toLowerCase().includes('sostituire')) return 'Da sostituire'
  if (visita.reginaVista) return 'Vista'
  if (visita.comportamento?.toLowerCase().includes('non controllata')) return 'Non controllata'
  return 'Non vista'
}

export function formatCovataDisplay(covata?: string): string {
  if (!covata) return '—'
  const lower = covata.toLowerCase()
  if (lower.includes('ottima')) return 'Ottima'
  if (lower.includes('buona') || lower.includes('compatta')) return 'Buona'
  if (lower.includes('scarsa') || lower.includes('discontinua')) return 'Scarsa'
  if (lower.includes('assente')) return 'Assente'
  return covata.replace(/^Covata\s/i, '')
}

export function formatScorteDisplay(scorte?: string): string {
  if (!scorte) return '—'
  const lower = scorte.toLowerCase()
  if (lower.includes('ottime') || lower.includes('abbondant')) return 'Ottime'
  if (lower.includes('buone') || lower.includes('normal')) return 'Normali'
  if (lower.includes('scarse')) return 'Scarse'
  return scorte.replace(/^Scorte\s/i, '')
}

export function parseMelarioFromNote(note?: string): string {
  if (!note) return '—'
  const match = note.match(/- Melario:\s*(.+)/i)
  if (!match) return '—'
  const val = match[1].trim()
  if (val === 'Assente' || val === 'Presente' || val === 'Opercolato' || val === 'Da smielare') {
    return val
  }
  if (val === 'Sì' || val.toLowerCase() === 'si') return 'Presente'
  if (val === 'No') return 'Assente'
  return val
}
