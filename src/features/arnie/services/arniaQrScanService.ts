import { arnieRepository } from '../../../database/repositories'
import { ARNIA_QR_PREFIX, parseArniaQrPayload } from './arniaQrService'

/**
 * Risolve l'ID interno arnia da un payload QR scansionato (lookup offline su IndexedDB).
 */
export async function resolveArniaIdFromScan(raw: string): Promise<string | null> {
  const publicUuid = parseArniaQrPayload(raw)
  if (!publicUuid) return null

  const byPublicUuid = await arnieRepository.getByPublicUuid(publicUuid)
  if (byPublicUuid) return byPublicUuid.id

  const byQrCode = await arnieRepository.getByQrCode(publicUuid)
  if (byQrCode) return byQrCode.id

  const legacyPayload = `${ARNIA_QR_PREFIX}${publicUuid}`
  const byLegacyQr = await arnieRepository.getByQrCode(legacyPayload)
  return byLegacyQr?.id ?? null
}

export function buildArniaDetailPathFromScan(arniaId: string): string {
  return `/arnie/${arniaId}`
}
