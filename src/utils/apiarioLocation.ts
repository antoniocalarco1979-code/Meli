import type { Apiario } from '../database/types'

export function formatApiarioLocation(
  apiario: Pick<Apiario, 'localita' | 'comune' | 'provincia' | 'regione'>,
): string {
  if (apiario.comune?.trim()) {
    const comune = apiario.comune.trim()
    const provincia = apiario.provincia?.trim()
    return provincia ? `${comune} (${provincia})` : comune
  }

  return apiario.localita?.trim() || '—'
}

export function buildApiarioLocalitaLabel(input: {
  comune?: string
  provincia?: string
  regione?: string
  localita?: string
}): string {
  if (input.localita?.trim()) return input.localita.trim()

  const comune = input.comune?.trim()
  const provincia = input.provincia?.trim()
  if (comune) {
    return provincia ? `${comune} (${provincia})` : comune
  }

  return input.regione?.trim() ?? ''
}
