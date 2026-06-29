import { getDb } from '../../../database'
import { createFoto } from '../../../database/services/fotoService'
import { updateArnia } from '../../../database/services/arnieService'
import { createVisita } from '../../../database/services/visiteService'
import { analyzeVisitaSalvata } from '../../azioni/generateAzioniConsigliate'
import { computeSaluteScore } from '../../../utils/salute'
import type { IspezioneWizardState } from '../types/ispezioneWizard.types'
import {
  buildSaluteFlagsFromIspezione,
  collectIspezionePhotos,
  mapIspezioneToVisitaInput,
} from './ispezioneMapper'

function compareArniaNumero(a: string, b: string): number {
  const na = Number.parseInt(a, 10)
  const nb = Number.parseInt(b, 10)
  if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb
  return a.localeCompare(b, 'it', { numeric: true })
}

export async function getNextArniaIdInApiario(
  apiarioId: string,
  currentArniaId: string,
): Promise<string | undefined> {
  const arnie = await getDb().arnie.where('apiarioId').equals(apiarioId).toArray()
  arnie.sort((a, b) => compareArniaNumero(a.numero, b.numero))

  const currentIndex = arnie.findIndex((arnia) => arnia.id === currentArniaId)
  if (currentIndex < 0) return undefined

  return arnie[currentIndex + 1]?.id
}

export async function saveIspezioneWizard(
  arniaId: string,
  state: IspezioneWizardState,
): Promise<void> {
  const input = mapIspezioneToVisitaInput(arniaId, state)
  const visita = await createVisita(input)
  analyzeVisitaSalvata(visita)

  const photos = collectIspezionePhotos(state)
  const forzaFamiglia = computeSaluteScore(buildSaluteFlagsFromIspezione(state))

  await updateArnia(arniaId, {
    forzaFamiglia,
    ...(photos[0] ? { fotoCopertina: photos[0] } : {}),
  })

  await Promise.all(
    photos.map((path) =>
      createFoto({
        path,
        visitaId: visita.id,
        arniaId,
      }),
    ),
  )
}
