import { createFoto } from '../../../database/services/fotoService'
import { updateArnia } from '../../../database/services/arnieService'
import {
  createTrattamento,
  getTrattamentiByArniaId,
} from '../../../database/services/trattamentiService'
import { createVisita } from '../../../database/services/visiteService'
import { gpsService, type GeoCoordinates } from '../../../services/device'
import { computeSaluteScore } from '../../../utils/salute'
import type { NuovaVisitaFormState } from '../types/visitForm.types'
import type { VisitWizardState } from '../types/visitWizard.types'
import type { VisitaSaveSummary } from '../types/visitSave.types'
import {
  buildSaluteFlagsFromWizard,
  mapWizardToForm,
} from './visitWizardMapper'

export type SaveVisitWizardPayload = {
  arniaId: string
  wizard: VisitWizardState
  gps?: GeoCoordinates | null
}

type PersistVisitaPayload = {
  arniaId: string
  form: NuovaVisitaFormState
  photos: string[]
  gps?: GeoCoordinates | null
  forzaFamiglia: number
  reginaNonVista: boolean
}

async function persistVisita(payload: PersistVisitaPayload): Promise<VisitaSaveSummary> {
  const { arniaId, form, photos, gps, forzaFamiglia, reginaNonVista } = payload
  const noteParts = [form.note?.trim()].filter(Boolean)
  const hadTrattamento = Boolean(form.trattamento?.trim())

  if (gps) {
    noteParts.push(`GPS: ${gpsService.formatLabel(gps)}`)
  }

  const visita = await createVisita({
    arniaId,
    data: Date.now(),
    meteo: form.meteo,
    temperatura: form.temperatura,
    covata: form.covata,
    scorte: form.scorte,
    forza: form.forza,
    reginaVista: form.reginaVista,
    comportamento: form.comportamento,
    note: noteParts.join('\n') || undefined,
  })

  if (form.trattamento?.trim()) {
    await createTrattamento({
      arniaId,
      data: Date.now(),
      prodotto: form.trattamento.trim(),
    })
  }

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

  return {
    fotoCount: photos.length,
    hadTrattamento,
    reginaNonVista,
    hadNote: noteParts.length > 0,
  }
}

export async function saveVisitWizard(
  payload: SaveVisitWizardPayload,
): Promise<VisitaSaveSummary> {
  const { arniaId, wizard, gps } = payload
  const form = mapWizardToForm(wizard)

  let trattamentoRecenteMs: number | undefined
  if (form.trattamento?.trim()) {
    trattamentoRecenteMs = Date.now()
  } else {
    const existing = (await getTrattamentiByArniaId(arniaId))[0]
    trattamentoRecenteMs = existing?.data
  }

  const forzaFamiglia = computeSaluteScore(
    buildSaluteFlagsFromWizard(wizard, trattamentoRecenteMs),
  )

  return persistVisita({
    arniaId,
    form,
    photos: wizard.photos,
    gps,
    forzaFamiglia,
    reginaNonVista:
      wizard.regina === 'no' || wizard.regina === 'non_controllata',
  })
}
