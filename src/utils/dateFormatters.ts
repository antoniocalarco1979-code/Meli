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

export function formatFullDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('it-IT', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** Es. "15 giugno" — per scheda arnia */
export function formatVisitaDateShort(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
  })
}

export function formatDuration(seconds: number): string {
  const total = Math.max(0, Math.round(seconds))
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const secs = total % 60

  if (hours > 0) return `${hours}h ${minutes}m`
  if (minutes > 0) return `${minutes} min${secs > 0 ? ` ${secs}s` : ''}`
  return `${secs}s`
}

export function formatDateTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString('it-IT')
}

/** Es. "14:30" — per timeline visita */
export function formatVisitaTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
