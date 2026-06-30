export const APIARIO_ESPOSIZIONE_OPTIONS = [
  { value: 'nord', label: 'Nord' },
  { value: 'est', label: 'Est' },
  { value: 'sud', label: 'Sud' },
  { value: 'ovest', label: 'Ovest' },
  { value: 'mista', label: 'Mista' },
] as const

export const APIARIO_ACCESSIBILITA_OPTIONS = [
  { value: 'facile', label: 'Facile' },
  { value: 'media', label: 'Media' },
  { value: 'difficile', label: 'Difficile' },
] as const

const esposizioneLabels = Object.fromEntries(
  APIARIO_ESPOSIZIONE_OPTIONS.map((o) => [o.value, o.label]),
) as Record<string, string>

const accessibilitaLabels = Object.fromEntries(
  APIARIO_ACCESSIBILITA_OPTIONS.map((o) => [o.value, o.label]),
) as Record<string, string>

export function formatEsposizione(value?: string): string {
  if (!value) return '—'
  return esposizioneLabels[value] ?? value
}

export function formatAccessibilita(value?: string): string {
  if (!value) return '—'
  return accessibilitaLabels[value] ?? value
}

export function formatPresenzaAcqua(value?: boolean): string {
  if (value === true) return 'Sì'
  if (value === false) return 'No'
  return '—'
}

export function formatAltitudine(quota?: number): string {
  if (quota == null || Number.isNaN(quota)) return '—'
  return `${quota} m s.l.m.`
}

export function formatGps(lat?: number, lng?: number): string {
  if (lat == null || lng == null) return '—'
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`
}
