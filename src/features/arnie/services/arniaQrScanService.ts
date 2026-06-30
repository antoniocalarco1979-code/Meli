import { arnieRepository } from '../../../database/repositories'
import { parseArniaQrPayload } from './arniaQrService'

/**
 * Risolve l'ID arnia da un payload QR scansionato.
 * Preparato per la futura funzione "Scansiona QR" → scheda arnia.
 */
export async function resolveArniaIdFromScan(raw: string): Promise<string | null> {
  const publicUuid = parseArniaQrPayload(raw)
  if (!publicUuid) return null

  const byPublicUuid = await arnieRepository.getByPublicUuid(publicUuid)
  if (byPublicUuid) return byPublicUuid.id

  const byId = await arnieRepository.getById(publicUuid)
  return byId?.id ?? null
}

/** Route target futura per apertura scheda da scan. */
export function buildArniaDetailPathFromScan(arniaId: string): string {
  return `/arnie/${arniaId}`
}
