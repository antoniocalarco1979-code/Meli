import { createFoto } from '../../../database/services/fotoService'
import { updateArnia } from '../../../database/services/arnieService'
import { createVisita } from '../../../database/services/visiteService'
import { analyzeVisitaSalvata } from '../../azioni/generateAzioniConsigliate'
import { formatTrattamentoSummary } from '../../trattamenti/utils/trattamentoFormatters'
import { VASSOIO_VARROA_OPTIONS } from '../types/ispezioneWizard.types'
import {
  ESCLUDI_REGINA_OPTIONS,
  formatVisitaDuration,
  labelSiNo,
  REGINA_VISTA_OPTIONS,
  type VisitaGuidataState,
} from '../types/visitaGuidata.types'
import type { VisitaSaveSummary } from '../types/visitSave.types'
import { applyVisitaInterventiBridge } from './visitaInterventiBridge'
import {
  collectTelainiPhotos,
  deriveCelleRealiPresentiFromTelaini,
  deriveReginaVistaFromTelaini,
  formatTelainiVisitaSection,
} from './telainoPanelNoteFormat'

function labelFrom<T extends string>(
  options: { value: T; label: string }[],
  value: T | null | undefined,
): string {
  if (!value) return '—'
  return options.find((option) => option.value === value)?.label ?? value
}

function buildGuidataNote(state: VisitaGuidataState, interventiSummary: string): string {
  const durationSec = state.startedAt
    ? Math.max(0, Math.floor((Date.now() - state.startedAt) / 1000))
    : 0

  const lines = [
    '--- Visita guidata MELI · Sprint 1A.4 ---',
    `Sessione: ${state.sessionId ?? '—'}`,
    `Durata: ${formatVisitaDuration(durationSec)}`,
  ]

  if (state.meteo) {
    lines.push(`Meteo: ${state.meteo}`)
  }

  lines.push(`Affumicatore utilizzato: ${labelSiNo(state.affumicatore.utilizzato)}`)

  if (state.affumicatore.note.trim()) {
    lines.push(`Note affumicatore: ${state.affumicatore.note.trim()}`)
  }

  lines.push(`Melario presente: ${labelSiNo(state.melario.presente)}`)

  if (state.melario.note.trim()) {
    lines.push(`Note melario: ${state.melario.note.trim()}`)
  }

  lines.push(
    `Escludi regina: ${labelFrom(ESCLUDI_REGINA_OPTIONS, state.escludiRegina.azione)}`,
  )
  if (state.escludiRegina.note.trim()) {
    lines.push(`Note escludi: ${state.escludiRegina.note.trim()}`)
  }

  lines.push(`Regina: ${labelFrom(REGINA_VISTA_OPTIONS, state.nido.reginaVista)}`)

  if (state.nido.varroaPresente) {
    lines.push(`Varroa vassoio: ${labelFrom(VASSOIO_VARROA_OPTIONS, state.nido.varroaPresente)}`)
  }

  if (state.nido.note.trim()) {
    lines.push(`Note nido: ${state.nido.note.trim()}`)
  }

  const telainiSection = formatTelainiVisitaSection(state.nido.telaini)
  if (telainiSection) {
    lines.push(telainiSection)
  }

  if (state.interventi.items.length > 0) {
    lines.push('Interventi effettuati:')
    for (const item of state.interventi.items) {
      if (
        (item.checklistId === 'trattamento' || item.checklistId === 'nutrizione') &&
        item.trattamentoPayload
      ) {
        lines.push(`- ${item.label}: ${formatTrattamentoSummary(item.trattamentoPayload)}`)
      } else {
        lines.push(`- ${item.label}${item.note.trim() ? `: ${item.note.trim()}` : ''}`)
      }
    }
  }

  const celleReali = deriveCelleRealiPresentiFromTelaini(state.nido.telaini)
  if (celleReali != null) {
    lines.push(`Celle reali presenti: ${celleReali ? 'Sì' : 'No'}`)
  }

  if (interventiSummary) {
    lines.push(interventiSummary)
  }

  return lines.join('\n')
}

function collectPhotos(state: VisitaGuidataState): string[] {
  return [
    state.melario.foto,
    state.nido.foto,
    ...collectTelainiPhotos(state.nido.telaini),
  ].filter((path): path is string => Boolean(path))
}

export async function saveVisitaGuidata(
  arniaId: string,
  state: VisitaGuidataState,
): Promise<VisitaSaveSummary> {
  const visitaData = Date.now()
  const note = buildGuidataNote(state, '')
  const photos = collectPhotos(state)
  const reginaFromTelaini = deriveReginaVistaFromTelaini(state.nido.telaini)

  const visita = await createVisita({
    arniaId,
    data: visitaData,
    meteo: state.meteo,
    note,
    reginaVista: reginaFromTelaini ?? state.nido.reginaVista === 'si',
  })

  const interventiResult = await applyVisitaInterventiBridge(
    arniaId,
    state.interventi.items,
    visitaData,
    visita.id,
  )

  analyzeVisitaSalvata(visita)

  await updateArnia(arniaId, { updatedAt: visitaData })

  const reginaNonVista =
    reginaFromTelaini === false ||
    state.nido.reginaVista === 'no' ||
    state.nido.reginaVista === 'non_cercata'
  const hadTrattamento = interventiResult.trattamentiCreati > 0

  if (photos[0]) {
    await updateArnia(arniaId, { fotoCopertina: photos[0] })
  }

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
    hadNote:
      Boolean(state.affumicatore.note.trim()) ||
      Boolean(state.melario.note.trim()) ||
      Boolean(state.escludiRegina.note.trim()) ||
      Boolean(state.nido.note.trim()) ||
      state.interventi.items.some((item) => item.note.trim()),
  }
}
