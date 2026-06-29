export type VisitWizardStepId =
  | 'arrivo'
  | 'mi_vesto'
  | 'affumicatore'
  | 'attrezzatura'
  | 'apro_arnia'
  | 'estraggo_telaio'
  | 'ispezione_telai'
  | 'scorte'
  | 'forza'
  | 'melario'
  | 'opercolatura'
  | 'azione'
  | 'decisioni'
  | 'salva'

export type VisitAzioneChoice =
  | 'aggiungere_melario'
  | 'togliere_melario'
  | 'nutrire'
  | 'trattare'
  | 'controllare_regina'
  | 'nessuna'
  | 'altro'

export type VisitTelaioTipo = 'covata' | 'miele' | 'polline' | 'regina_vista'

export type VisitTelaioEntry = {
  id: string
  numero: number
  tipo: VisitTelaioTipo
  rating: number | null
  reginaEsito: VisitReginaChoice | null
}

export type VisitReginaChoice = 'si' | 'no' | 'non_controllata'

export type VisitCovataChoice = 'compatta' | 'discontinua' | 'assente'

export type VisitForzaChoice = 'molto_forte' | 'forte' | 'media' | 'debole'

export type VisitScorteChoice = 'abbondanti' | 'normali' | 'scarse'

export type VisitRisorsaChoice = 'presente' | 'scarso' | 'assente'

export type VisitOpercolaturaChoice =
  | 'assente'
  | 'in_costruzione'
  | 'opercolato'
  | 'da_smielare'

export type VisitWizardStepKind = 'proceed' | 'choice' | 'binary' | 'note' | 'save' | 'telai' | 'azione'

export type VisitWizardState = {
  photos: string[]
  telai: VisitTelaioEntry[]
  regina: VisitReginaChoice | null
  covata: VisitCovataChoice | null
  miele: VisitRisorsaChoice | null
  polline: VisitRisorsaChoice | null
  scorte: VisitScorteChoice | null
  forza: VisitForzaChoice | null
  haMelario: boolean | null
  opercolatura: VisitOpercolaturaChoice | null
  azione: VisitAzioneChoice | null
  azioneAltro: string
  trattamento: string
  note: string
}

export type VisitWizardStepDef = {
  id: VisitWizardStepId
  emoji: string
  label: string
  question: string
  kind: VisitWizardStepKind
  hint?: string
}

export const emptyVisitWizardState = (): VisitWizardState => ({
  photos: [],
  telai: [],
  regina: null,
  covata: null,
  miele: null,
  polline: null,
  scorte: null,
  forza: null,
  haMelario: null,
  opercolatura: null,
  azione: null,
  azioneAltro: '',
  trattamento: '',
  note: '',
})

export const VISIT_WIZARD_STEPS: VisitWizardStepDef[] = [
  { id: 'arrivo', emoji: '🚗', label: 'Arrivo', question: 'Arrivo', kind: 'proceed' },
  { id: 'mi_vesto', emoji: '🥼', label: 'Mi vesto', question: 'Mi vesto', kind: 'proceed' },
  {
    id: 'affumicatore',
    emoji: '🔥',
    label: 'Affumicatore',
    question: 'Accendo l\'affumicatore',
    kind: 'proceed',
  },
  {
    id: 'attrezzatura',
    emoji: '🧰',
    label: 'Attrezzatura',
    question: 'Prendo l\'attrezzatura',
    kind: 'proceed',
  },
  { id: 'apro_arnia', emoji: '🐝', label: 'Apro arnia', question: 'Apro l\'Arnia', kind: 'proceed' },
  {
    id: 'estraggo_telaio',
    emoji: '📦',
    label: 'Telaio',
    question: 'Estraggo un telaio',
    kind: 'proceed',
  },
  {
    id: 'ispezione_telai',
    emoji: '📦',
    label: 'Telai',
    question: 'Ispezione telai',
    kind: 'telai',
  },
  {
    id: 'scorte',
    emoji: '🥫',
    label: 'Scorte',
    question: 'Controllo scorte',
    kind: 'choice',
  },
  {
    id: 'forza',
    emoji: '🐝',
    label: 'Forza',
    question: 'Controllo forza famiglia',
    kind: 'choice',
  },
  {
    id: 'melario',
    emoji: '⬆️',
    label: 'Melario',
    question: 'Se c\'è il melario',
    kind: 'binary',
  },
  {
    id: 'opercolatura',
    emoji: '🍯',
    label: 'Opercolatura',
    question: 'Controllo opercolatura',
    kind: 'choice',
  },
  {
    id: 'azione',
    emoji: '⚡',
    label: 'Azione',
    question: 'Azione',
    kind: 'azione',
  },
  {
    id: 'decisioni',
    emoji: '📝',
    label: 'Decisioni',
    question: 'Prendo decisioni',
    kind: 'note',
    hint: 'Note e foto opzionali',
  },
  { id: 'salva', emoji: '➡️', label: 'Salva', question: 'Arnia successiva', kind: 'save' },
]

export function getActiveWizardSteps(state: VisitWizardState): VisitWizardStepDef[] {
  return VISIT_WIZARD_STEPS.filter((step) => {
    if (step.id === 'opercolatura') return state.haMelario === true
    return true
  })
}

export type VisitChoiceOption<T extends string> = {
  value: T
  label: string
  icon?: string
}

export const REGINA_OPTIONS: VisitChoiceOption<VisitReginaChoice>[] = [
  { value: 'si', label: 'SI', icon: '🟢' },
  { value: 'no', label: 'NO', icon: '🔴' },
  { value: 'non_controllata', label: 'NON CONTROLLATA', icon: '🟡' },
]

export const COVATA_OPTIONS: VisitChoiceOption<VisitCovataChoice>[] = [
  { value: 'compatta', label: 'Compatta' },
  { value: 'discontinua', label: 'Discontinua' },
  { value: 'assente', label: 'Assente' },
]

export const FORZA_OPTIONS: VisitChoiceOption<VisitForzaChoice>[] = [
  { value: 'molto_forte', label: 'Molto forte' },
  { value: 'forte', label: 'Forte' },
  { value: 'media', label: 'Media' },
  { value: 'debole', label: 'Debole' },
]

export const SCORTE_OPTIONS: VisitChoiceOption<VisitScorteChoice>[] = [
  { value: 'abbondanti', label: 'Ottime' },
  { value: 'normali', label: 'Buone' },
  { value: 'scarse', label: 'Scarse' },
]

export const RISORSA_OPTIONS: VisitChoiceOption<VisitRisorsaChoice>[] = [
  { value: 'presente', label: 'Presente' },
  { value: 'scarso', label: 'Scarso' },
  { value: 'assente', label: 'Assente' },
]

export const OPERCOLATURA_OPTIONS: VisitChoiceOption<VisitOpercolaturaChoice>[] = [
  { value: 'assente', label: 'Assente' },
  { value: 'in_costruzione', label: 'In costruzione' },
  { value: 'opercolato', label: 'Opercolato' },
  { value: 'da_smielare', label: 'Da smielare' },
]

export const MELARIO_OPTIONS: VisitChoiceOption<'yes' | 'no'>[] = [
  { value: 'yes', label: 'Sì, c\'è melario' },
  { value: 'no', label: 'No melario' },
]

export const TELAIO_TIPO_OPTIONS: VisitChoiceOption<VisitTelaioTipo>[] = [
  { value: 'covata', label: 'Covata' },
  { value: 'miele', label: 'Miele' },
  { value: 'polline', label: 'Polline' },
  { value: 'regina_vista', label: 'Regina vista' },
]

export const AZIONE_OPTIONS: VisitChoiceOption<VisitAzioneChoice>[] = [
  { value: 'aggiungere_melario', label: 'Aggiungere melario' },
  { value: 'togliere_melario', label: 'Togliere melario' },
  { value: 'nutrire', label: 'Nutrire' },
  { value: 'trattare', label: 'Trattare' },
  { value: 'controllare_regina', label: 'Controllare regina' },
  { value: 'nessuna', label: 'Nessuna azione' },
  { value: 'altro', label: '+ Altro…' },
]
