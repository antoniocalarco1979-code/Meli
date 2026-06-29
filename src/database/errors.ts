import { Dexie } from 'dexie'

const DEXIE_MESSAGES: Record<string, string> = {
  QuotaExceededError:
    'Spazio di archiviazione esaurito. Libera spazio sul dispositivo e riprova.',
  DatabaseClosedError: 'Database non disponibile. Ricarica l\'applicazione.',
  AbortError: 'Operazione annullata. Riprova.',
  VersionError: 'Versione database non compatibile. Ricarica l\'applicazione.',
}

export function parseDexieError(error: unknown): string {
  if (error instanceof Dexie.DexieError) {
    return DEXIE_MESSAGES[error.name] ?? error.message
  }
  if (error instanceof Error && error.message) {
    return error.message
  }
  return 'Si è verificato un errore imprevisto.'
}

export function normalizeError(error: unknown): Error {
  if (error instanceof Error) return error
  return new Error(parseDexieError(error))
}
