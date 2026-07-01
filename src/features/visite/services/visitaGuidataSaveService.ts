import { createFoto } from '../../../database/services/fotoService'
import { updateArnia } from '../../../database/services/arnieService'
import { createVisita } from '../../../database/services/visiteService'
import { analyzeVisitaSalvata } from '../../azioni/generateAzioniConsigliate'
import { VASSOIO_VARROA_OPTIONS } from '../types/ispezioneWizard.types'
import type { VisitaGuidataState } from '../types/visitaGuidata.types'
import { OPERCOLATURA_OPTIONS } from '../types/visitWizard.types'
import type { VisitaSaveSummary } from '../types/visitSave.types'

function labelFrom<T extends string>(
  options: { value: T; label: string }[],
  value: T | null | undefined,
): string {
  if (!value) return '—'
  return options.find((option) => option.value === value)?.label ?? value
}

function buildGuidataNote(state: VisitaGuidataState, hasMelario: boolean): string {
  const lines = [
    '--- Visita guidata MELI ---',
    `Varroa: ${labelFrom(VASSOIO_VARROA_OPTIONS, state.vassoio.varroaPresente)}`,
  ]

  if (state.vassoio.note.trim()) {
    lines.push(`Note vassoio: ${state.vassoio.note.trim()}`)
  }

  if (hasMelario) {
    lines.push(
      '- Melario: Sì',
      `Opercolatura: ${labelFrom(OPERCOLATURA_OPTIONS, state.melario.opercolatura)}`,
    )
    if (state.melario.note.trim()) {
      lines.push(`Note melario: ${state.melario.note.trim()}`)
    }
  } else {
    lines.push('- Melario: No')
  }

  if (state.nido.note.trim()) {
    lines.push(`Note nido: ${state.nido.note.trim()}`)
  }

  return lines.join('\n')
}

function collectPhotos(state: VisitaGuidataState): string[] {
  return [state.vassoio.foto, state.melario.foto, state.nido.foto].filter(
    (path): path is string => Boolean(path),
  )
}

export async function saveVisitaGuidata(
  arniaId: string,
  state: VisitaGuidataState,
  hasMelario: boolean,
): Promise<VisitaSaveSummary> {
  const note = buildGuidataNote(state, hasMelario)
  const photos = collectPhotos(state)
  const varroaSi = state.vassoio.varroaPresente === 'si'

  const visita = await createVisita({
    arniaId,
    data: Date.now(),
    note,
    reginaVista: !varroaSi,
  })

  analyzeVisitaSalvata(visita)

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
    hadTrattamento: false,
    reginaNonVista: varroaSi,
    hadNote:
      Boolean(state.vassoio.note.trim()) ||
      Boolean(state.melario.note.trim()) ||
      Boolean(state.nido.note.trim()),
  }
}
