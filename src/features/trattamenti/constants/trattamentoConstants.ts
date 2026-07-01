export const TRATTAMENTO_TIPI: { value: string; label: string; emoji: string }[] = [
  { value: 'varroa', label: 'Varroa', emoji: '🐛' },
  { value: 'nosoma', label: 'Nosema', emoji: '💧' },
  { value: 'afb', label: 'AFB / Sanitaria', emoji: '🛡️' },
  { value: 'nutrizione', label: 'Nutrizione', emoji: '🍬' },
  { value: 'disinfestazione', label: 'Disinfestazione', emoji: '🧴' },
  { value: 'altro', label: 'Altro', emoji: '💊' },
]

export const TRATTAMENTO_METODI: { value: string; label: string }[] = [
  { value: 'strip', label: 'Striscia / Strip' },
  { value: 'vaporizzazione', label: 'Vaporizzazione' },
  { value: 'spruzzo', label: 'Spruzzo' },
  { value: 'gel', label: 'Gel' },
  { value: 'polvere', label: 'Polvere' },
  { value: 'sciropo', label: 'Sciroppo' },
  { value: 'foglio', label: 'Foglio / Carta' },
  { value: 'altro', label: 'Altro' },
]

/** Giorni default follow-up se non indicata scadenza. */
export const TRATTAMENTO_FOLLOW_UP_GIORNI = 21
