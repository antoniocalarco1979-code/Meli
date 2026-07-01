import type { ReginaColoreInternazionale, ReginaStatoOperativo } from '../../../database/types'

export const REGINA_COLORI: {
  value: ReginaColoreInternazionale
  label: string
  emoji: string
}[] = [
  { value: 'bianca', label: 'Bianca', emoji: '⚪' },
  { value: 'gialla', label: 'Gialla', emoji: '🟡' },
  { value: 'rossa', label: 'Rossa', emoji: '🔴' },
  { value: 'verde', label: 'Verde', emoji: '🟢' },
  { value: 'blu', label: 'Blu', emoji: '🔵' },
]

export const REGINA_STATI: {
  value: ReginaStatoOperativo
  label: string
  emoji: string
}[] = [
  { value: 'fecondata', label: 'Fecondata', emoji: '👑' },
  { value: 'vergine', label: 'Vergine', emoji: '🌸' },
  { value: 'in_deposizione', label: 'In deposizione', emoji: '🥚' },
  { value: 'da_sostituire', label: 'Da sostituire', emoji: '🔄' },
  { value: 'persa', label: 'Persa', emoji: '✖️' },
]
