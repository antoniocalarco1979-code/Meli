export type ArniaColoreId =
  | 'miele'
  | 'bianco'
  | 'verde'
  | 'blu'
  | 'rosso'
  | 'giallo'
  | 'viola'
  | 'nero'

export type ArniaColoreOption = {
  id: ArniaColoreId
  label: string
  hex: string
}

export const ARNIA_COLORI: ArniaColoreOption[] = [
  { id: 'miele', label: 'Miele', hex: '#E8960C' },
  { id: 'bianco', label: 'Bianco', hex: '#F5F0E6' },
  { id: 'giallo', label: 'Giallo', hex: '#F4D03F' },
  { id: 'verde', label: 'Verde', hex: '#5A7A52' },
  { id: 'blu', label: 'Blu', hex: '#4A6785' },
  { id: 'viola', label: 'Viola', hex: '#7D6B91' },
  { id: 'rosso', label: 'Rosso', hex: '#C0392B' },
  { id: 'nero', label: 'Nero', hex: '#2C2416' },
]

export function getArniaColoreById(id?: string): ArniaColoreOption | undefined {
  return ARNIA_COLORI.find((colore) => colore.id === id)
}
