export type VassoioVarroaChoice = 'si' | 'no' | 'non_controllato'

export type VassoioResiduiCeraChoice = 'pochi' | 'normali' | 'molti'

export type VassoioAltriInsettiChoice = 'nessuno' | 'formiche' | 'tarme' | 'altro'

export type VassoioUmiditaSporcoChoice = 'no' | 'lieve' | 'evidente'

export type TelainoCovataChoice = 'assente' | 'poca' | 'buona' | 'abbondante'

export type TelainoPollineChoice = 'assente' | 'poco' | 'buono' | 'abbondante'

export type TelainoScorteChoice = 'assenti' | 'poche' | 'buone' | 'abbondanti'

export type TelainoReginaVistaChoice = 'si' | 'no'

export type TelainoCelleRealiChoice = 'assenti' | 'presenti'

export type TelainoApiPresentiChoice = 'poche' | 'normali' | 'molte'

export type TelainoProblemiChoice = 'nessuno' | 'varroa' | 'tarma' | 'muffa' | 'altro'

export type VassoioAntivarroa = {
  varroaPresente: VassoioVarroaChoice | null
  acariStimati: number | null
  residuiCera: VassoioResiduiCeraChoice | null
  altriInsetti: VassoioAltriInsettiChoice | null
  umiditaSporco: VassoioUmiditaSporcoChoice | null
  foto?: string
  note: string
}

export type TelainoInspection = {
  id: string
  numero: number
  covata: TelainoCovataChoice | null
  polline: TelainoPollineChoice | null
  scorteMiele: TelainoScorteChoice | null
  reginaVista: TelainoReginaVistaChoice | null
  celleReali: TelainoCelleRealiChoice | null
  apiPresenti: TelainoApiPresentiChoice | null
  problemi: TelainoProblemiChoice | null
  foto?: string
  note: string
}

export type IspezioneWizardStepId = 'vassoio' | 'telai' | 'salva'

export type IspezioneWizardStepDef = {
  id: IspezioneWizardStepId
  emoji: string
  label: string
  question: string
}

export type IspezioneWizardState = {
  vassoio: VassoioAntivarroa
  telai: TelainoInspection[]
}

export type IspezioneSummary = {
  totaleTelai: number
  telaiConCovata: number
  telaiScorteBuone: number
  reginaVista: boolean
  problemi: string[]
  vassoioVarroaLabel: string
  vassoioAcariStimati: number | null
}

export const ISPEZIONE_WIZARD_TOTAL_STEPS = 3

export const ISPEZIONE_WIZARD_STEPS: IspezioneWizardStepDef[] = [
  {
    id: 'vassoio',
    emoji: '📋',
    label: 'Vassoio',
    question: 'Controllo vassoio antivarroa',
  },
  {
    id: 'telai',
    emoji: '🍯',
    label: 'Telaini',
    question: 'Ispezione telaini',
  },
  {
    id: 'salva',
    emoji: '✅',
    label: 'Riepilogo',
    question: 'Conferma ispezione',
  },
]

export const VASSOIO_VARROA_OPTIONS: { value: VassoioVarroaChoice; label: string }[] = [
  { value: 'si', label: 'Sì' },
  { value: 'no', label: 'No' },
  { value: 'non_controllato', label: 'Non controllato' },
]

export const VASSOIO_RESIDUI_CERA_OPTIONS: { value: VassoioResiduiCeraChoice; label: string }[] = [
  { value: 'pochi', label: 'Pochi' },
  { value: 'normali', label: 'Normali' },
  { value: 'molti', label: 'Molti' },
]

export const VASSOIO_ALTRI_INSETTI_OPTIONS: { value: VassoioAltriInsettiChoice; label: string }[] = [
  { value: 'nessuno', label: 'Nessuno' },
  { value: 'formiche', label: 'Formiche' },
  { value: 'tarme', label: 'Tarme' },
  { value: 'altro', label: 'Altro' },
]

export const VASSOIO_UMIDITA_SPORCO_OPTIONS: { value: VassoioUmiditaSporcoChoice; label: string }[] = [
  { value: 'no', label: 'No' },
  { value: 'lieve', label: 'Lieve' },
  { value: 'evidente', label: 'Evidente' },
]

export const TELAINO_COVATA_OPTIONS: { value: TelainoCovataChoice; label: string }[] = [
  { value: 'assente', label: 'Assente' },
  { value: 'poca', label: 'Poca' },
  { value: 'buona', label: 'Buona' },
  { value: 'abbondante', label: 'Abbondante' },
]

export const TELAINO_POLLINE_OPTIONS: { value: TelainoPollineChoice; label: string }[] = [
  { value: 'assente', label: 'Assente' },
  { value: 'poco', label: 'Poco' },
  { value: 'buono', label: 'Buono' },
  { value: 'abbondante', label: 'Abbondante' },
]

export const TELAINO_SCORTE_OPTIONS: { value: TelainoScorteChoice; label: string }[] = [
  { value: 'assenti', label: 'Assenti' },
  { value: 'poche', label: 'Poche' },
  { value: 'buone', label: 'Buone' },
  { value: 'abbondanti', label: 'Abbondanti' },
]

export const TELAINO_REGINA_OPTIONS: { value: TelainoReginaVistaChoice; label: string }[] = [
  { value: 'si', label: 'Sì' },
  { value: 'no', label: 'No' },
]

export const TELAINO_CELLE_REALI_OPTIONS: { value: TelainoCelleRealiChoice; label: string }[] = [
  { value: 'assenti', label: 'Assenti' },
  { value: 'presenti', label: 'Presenti' },
]

export const TELAINO_API_OPTIONS: { value: TelainoApiPresentiChoice; label: string }[] = [
  { value: 'poche', label: 'Poche' },
  { value: 'normali', label: 'Normali' },
  { value: 'molte', label: 'Molte' },
]

export const TELAINO_PROBLEMI_OPTIONS: { value: TelainoProblemiChoice; label: string }[] = [
  { value: 'nessuno', label: 'Nessuno' },
  { value: 'varroa', label: 'Varroa' },
  { value: 'tarma', label: 'Tarma' },
  { value: 'muffa', label: 'Muffa' },
  { value: 'altro', label: 'Altro' },
]

export const ACARI_STIMATI_ALTI_SOGLIA = 10

function emptyVassoio(): VassoioAntivarroa {
  return {
    varroaPresente: null,
    acariStimati: null,
    residuiCera: null,
    altriInsetti: null,
    umiditaSporco: null,
    note: '',
  }
}

export function createTelainoInspection(numero: number): TelainoInspection {
  return {
    id: crypto.randomUUID(),
    numero,
    covata: null,
    polline: null,
    scorteMiele: null,
    reginaVista: null,
    celleReali: null,
    apiPresenti: null,
    problemi: null,
    note: '',
  }
}

export function emptyIspezioneWizardState(): IspezioneWizardState {
  return {
    vassoio: emptyVassoio(),
    telai: [createTelainoInspection(1)],
  }
}

export function isVassoioComplete(vassoio: VassoioAntivarroa): boolean {
  return vassoio.varroaPresente !== null
}

export function isTelainoComplete(telaino: TelainoInspection): boolean {
  return (
    telaino.covata !== null &&
    telaino.polline !== null &&
    telaino.scorteMiele !== null &&
    telaino.reginaVista !== null &&
    telaino.celleReali !== null &&
    telaino.apiPresenti !== null &&
    telaino.problemi !== null
  )
}

export function isIspezioneReadyToSave(state: IspezioneWizardState): boolean {
  return isVassoioComplete(state.vassoio) && state.telai.some(isTelainoComplete)
}

export function computeIspezioneSummary(state: IspezioneWizardState): IspezioneSummary {
  const completeTelai = state.telai.filter(isTelainoComplete)
  const telaiConCovata = completeTelai.filter(
    (t) => t.covata === 'poca' || t.covata === 'buona' || t.covata === 'abbondante',
  ).length
  const telaiScorteBuone = completeTelai.filter(
    (t) => t.scorteMiele === 'buone' || t.scorteMiele === 'abbondanti',
  ).length
  const reginaVista = completeTelai.some((t) => t.reginaVista === 'si')
  const problemi = [
    ...new Set(
      completeTelai
        .map((t) => t.problemi)
        .filter((p): p is Exclude<TelainoProblemiChoice, 'nessuno'> => p !== null && p !== 'nessuno'),
    ),
  ]

  const varroaLabel =
    VASSOIO_VARROA_OPTIONS.find((o) => o.value === state.vassoio.varroaPresente)?.label ?? '—'

  return {
    totaleTelai: completeTelai.length,
    telaiConCovata,
    telaiScorteBuone,
    reginaVista,
    problemi,
    vassoioVarroaLabel: varroaLabel,
    vassoioAcariStimati: state.vassoio.acariStimati,
  }
}
