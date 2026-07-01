import { arnieRepository } from '../../../database/repositories'
import {
  ARNIA_QR_PREFIX,
  ARNIA_QR_URI_PREFIX,
  buildArniaQrPayload,
  parseArniaQrPayload,
} from './arniaQrService'

/**
 * Risolve l'ID interno arnia da un payload QR scansionato (lookup offline su IndexedDB).
 */
export async function resolveArniaIdFromScan(raw: string): Promise<string | null> {
  const trimmed = raw.trim()
  if (!trimmed) return null

  const byExactQr = await arnieRepository.getByQrCode(trimmed)
  if (byExactQr) return byExactQr.id

  const publicUuid = parseArniaQrPayload(trimmed)
  if (!publicUuid) return null

  const byPublicUuid = await arnieRepository.getByPublicUuid(publicUuid)
  if (byPublicUuid) return byPublicUuid.id

  const canonicalPayload = buildArniaQrPayload(publicUuid)
  const byCanonicalQr = await arnieRepository.getByQrCode(canonicalPayload)
  if (byCanonicalQr) return byCanonicalQr.id

  const legacyPayload = `${ARNIA_QR_PREFIX}${publicUuid}`
  const byLegacyQr = await arnieRepository.getByQrCode(legacyPayload)
  if (byLegacyQr) return byLegacyQr.id

  const byRawUuidQr = await arnieRepository.getByQrCode(publicUuid)
  return byRawUuidQr?.id ?? null
}

export function buildArniaDetailPathFromScan(arniaId: string): string {
  return `/arnie/${arniaId}`
}

export { ARNIA_QR_URI_PREFIX }
