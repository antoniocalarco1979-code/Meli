import { createFoto } from '../../../database/services/fotoService'
import { updateArnia } from '../../../database/services/arnieService'
import { trattamentiRepository } from '../../../database/repositories/trattamentiRepository'
import { createTrattamento } from '../../../database/services/trattamentiService'
import { createVisita } from '../../../database/services/visiteService'
import type { Trattamento } from '../../../database/types'
import type { GeoCoordinates } from '../../../services/device'
import type { VisitaChecklistState } from '../components/visitaGuidataSteps'
import type { NuovaVisitaFormState } from '../types'
import {
  buildSaluteFlagsFromChecklist,
  buildSaluteFlagsFromVisita,
  computeSaluteScore,
} from '../utils/saluteScore'

export type SaveVisitaPayload = {
  arniaId: string
  form: NuovaVisitaFormState
  checklist?: VisitaChecklistState
  photos: string[]
  gps?: GeoCoordinates | null
}

export type VisitaSaveSummary = {
  fotoCount: number
  hadTrattamento: boolean
  reginaNonVista: boolean
}

export async function saveNuovaVisita(payload: SaveVisitaPayload) {
  const { arniaId, form, checklist, photos, gps } = payload
  const noteParts = [form.note?.trim()].filter(Boolean)
  const hadTrattamento = Boolean(form.trattamento?.trim())

  if (gps) {
    noteParts.push(`GPS: ${gps.latitudine}, ${gps.longitudine}`)
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

  let trattamentoRecente: Trattamento | undefined
  if (form.trattamento?.trim()) {
    trattamentoRecente = await createTrattamento({
      arniaId,
      data: Date.now(),
      prodotto: form.trattamento.trim(),
    })
  } else {
    trattamentoRecente = (await trattamentiRepository.getByArniaId(arniaId))[0]
  }

  const saluteFlags = checklist
    ? buildSaluteFlagsFromChecklist(
        checklist,
        Boolean(trattamentoRecente) &&
          Date.now() - trattamentoRecente.data < 90 * 86_400_000,
      )
    : buildSaluteFlagsFromVisita(visita, trattamentoRecente)

  const forzaFamiglia = computeSaluteScore(saluteFlags)

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
    visita,
    fotoCount: photos.length,
    hadTrattamento,
    reginaNonVista: form.reginaVista === false,
  }
}
