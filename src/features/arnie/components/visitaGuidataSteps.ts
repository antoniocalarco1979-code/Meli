export type VisitaGuidataStep =
  | 'posizione'
  | 'regina'
  | 'covata'
  | 'scorte'
  | 'foto'
  | 'concluso'

export type VisitaChecklistState = {
  reginaVerificata: boolean | null
  covataControllata: boolean
  scorteControllate: boolean
  telaioFotografato: boolean
}

export const emptyVisitaChecklist: VisitaChecklistState = {
  reginaVerificata: null,
  covataControllata: false,
  scorteControllate: false,
  telaioFotografato: false,
}

export const VISITA_GUIDATA_STEPS: { id: VisitaGuidataStep; label: string }[] = [
  { id: 'posizione', label: 'Posizione' },
  { id: 'regina', label: 'Regina' },
  { id: 'covata', label: 'Covata' },
  { id: 'scorte', label: 'Scorte' },
  { id: 'foto', label: 'Foto telaio' },
  { id: 'concluso', label: 'Conclusione' },
]
