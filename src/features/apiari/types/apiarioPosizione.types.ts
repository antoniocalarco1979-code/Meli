export type ApiarioPosizioneMode = 'gps' | 'map' | 'manual'

export type ApiarioPosizioneState = {
  mode: ApiarioPosizioneMode
  latitudine?: number
  longitudine?: number
  comune?: string
  provincia?: string
  regione?: string
  quota?: number
  indirizzo?: string
}

export const emptyApiarioPosizione: ApiarioPosizioneState = {
  mode: 'manual',
}

export function posizioneFromApiario(
  apiario: Partial<ApiarioPosizioneState> & {
    latitudine?: number
    longitudine?: number
    localita?: string
  },
): ApiarioPosizioneState {
  const hasCoords = apiario.latitudine != null && apiario.longitudine != null

  let comune = apiario.comune
  let provincia = apiario.provincia
  if (!comune && apiario.localita?.trim()) {
    const match = apiario.localita.trim().match(/^(.+?)\s*\(([^)]+)\)\s*$/)
    if (match) {
      comune = match[1].trim()
      provincia = provincia ?? match[2].trim()
    } else {
      comune = apiario.localita.trim()
    }
  }

  return {
    mode: hasCoords ? 'gps' : 'manual',
    latitudine: apiario.latitudine,
    longitudine: apiario.longitudine,
    comune,
    provincia,
    regione: apiario.regione,
    quota: apiario.quota,
    indirizzo: apiario.indirizzo,
  }
}

export function posizioneToApiarioInput(
  posizione: ApiarioPosizioneState,
): Pick<
  ApiarioPosizioneState,
  'latitudine' | 'longitudine' | 'comune' | 'provincia' | 'regione' | 'quota' | 'indirizzo'
> {
  return {
    latitudine: posizione.latitudine,
    longitudine: posizione.longitudine,
    comune: posizione.comune?.trim() || undefined,
    provincia: posizione.provincia?.trim() || undefined,
    regione: posizione.regione?.trim() || undefined,
    quota: posizione.quota,
    indirizzo: posizione.indirizzo?.trim() || undefined,
  }
}
