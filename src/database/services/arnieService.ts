import { deleteArniaWithRelations } from './apiariService'
import { getDb } from '../activeDatabase'
import { apiariRepository, arnieRepository } from '../repositories'
import {
  DEFAULT_ARNIA_MODELLO_ID,
  isModelloPersonalizzato,
  resolveArniaModello,
} from '../../features/arnie/models/arniaModelli'
import { buildArniaQrAssets } from '../../features/arnie/services/arniaQrService'
import { generateId, now } from '../repositories/utils'
import type { Arnia, ArniaInput, ArniaUpdate } from '../types'

const UUID_V4_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function isValidPublicUuid(value?: string): value is string {
  return Boolean(value && UUID_V4_PATTERN.test(value))
}

function normalizeArniaInput(input: ArniaInput): Omit<
  Arnia,
  'id' | 'publicUuid' | 'qrCode' | 'qrImageDataUrl' | 'createdAt' | 'updatedAt'
> {
  const modelloId = input.modelloId ?? DEFAULT_ARNIA_MODELLO_ID

  if (isModelloPersonalizzato(modelloId)) {
    const telai = input.telaiPersonalizzati
    if (telai == null || telai < 1) {
      throw new Error('Indica il numero dei telaini per il modello personalizzato.')
    }
  }

  const modello = resolveArniaModello(modelloId, input.telaiPersonalizzati)

  return {
    apiarioId: input.apiarioId,
    numero: input.numero ?? input.codice ?? '',
    modelloId: modello.modelloId,
    numeroTelai: modello.numeroTelai,
    hasMelario: modello.hasMelario,
    hasVassoioAntivarroa: modello.hasVassoioAntivarroa,
    modelloExtensions: modello.modelloExtensions,
    colore: input.colore,
    nome: input.nome,
    stato: input.stato ?? 'attiva',
    forzaFamiglia: input.forzaFamiglia,
    fotoCopertina: input.fotoCopertina,
    note: input.note,
  }
}

export async function getAllArnie() {
  return arnieRepository.getAll()
}

export async function getArnieByApiarioId(apiarioId: string) {
  return arnieRepository.getByApiarioId(apiarioId)
}

export async function getArniaById(id: string) {
  return arnieRepository.getById(id)
}

export async function getArniaByPublicUuid(publicUuid: string) {
  return arnieRepository.getByPublicUuid(publicUuid)
}

export async function getArniaByQrCode(qrCode: string) {
  return arnieRepository.getByQrCode(qrCode)
}

export async function createArnia(input: ArniaInput): Promise<Arnia> {
  const id = generateId()
  const publicUuid = generateId()
  const { qrCode, qrImageDataUrl } = await buildArniaQrAssets(publicUuid)

  const arnia = await arnieRepository.create(
    {
      ...normalizeArniaInput(input),
      publicUuid,
      qrCode,
      qrImageDataUrl,
    },
    id,
  )

  await syncApiarioArnieCount(input.apiarioId)
  return arnia
}

export async function regenerateArniaQr(arniaId: string): Promise<Arnia> {
  const arnia = await arnieRepository.getById(arniaId)
  if (!arnia) {
    throw new Error('Arnia non trovata.')
  }

  const { qrImageDataUrl } = await buildArniaQrAssets(arnia.publicUuid)
  await arnieRepository.update(arniaId, { qrImageDataUrl })
  return { ...arnia, qrImageDataUrl }
}

/** Garantisce UUID v4 + QR per arnie legacy senza identità permanente. */
export async function ensureArniaQrIdentity(arniaId: string): Promise<Arnia> {
  const arnia = await arnieRepository.getById(arniaId)
  if (!arnia) {
    throw new Error('Arnia non trovata.')
  }

  const hasUuid = isValidPublicUuid(arnia.publicUuid)
  const qrMatchesUuid = hasUuid && arnia.qrCode === arnia.publicUuid
  const hasImage = Boolean(arnia.qrImageDataUrl)

  if (hasUuid && qrMatchesUuid && hasImage) {
    return arnia
  }

  const publicUuid = hasUuid ? arnia.publicUuid : generateId()
  const { qrCode, qrImageDataUrl } = await buildArniaQrAssets(publicUuid)
  const timestamp = now()

  await getDb().arnie.update(arniaId, {
    publicUuid,
    qrCode,
    qrImageDataUrl,
    updatedAt: timestamp,
  })

  return { ...arnia, publicUuid, qrCode, qrImageDataUrl, updatedAt: timestamp }
}

export async function updateArnia(id: string, input: ArniaUpdate) {
  await arnieRepository.update(id, input)
}

export async function deleteArnia(id: string) {
  const arnia = await arnieRepository.getById(id)
  if (!arnia) return
  await deleteArniaWithRelations(id)
  await syncApiarioArnieCount(arnia.apiarioId)
}

/** Aggiorna contatore denormalizzato sull'apiario padre. */
export async function syncApiarioArnieCount(apiarioId: string) {
  const count = await arnieRepository.countByApiarioId(apiarioId)
  await apiariRepository.update(apiarioId, { numeroArnie: count })
}
