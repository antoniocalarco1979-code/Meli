export type SaluteLevel = 'green' | 'yellow' | 'red'

export function getSaluteLevel(value: number): SaluteLevel {
  if (value >= 70) return 'green'
  if (value >= 40) return 'yellow'
  return 'red'
}
