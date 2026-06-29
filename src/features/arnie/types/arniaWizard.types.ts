import type { ArniaInput } from '../../../database/types/inputs'
import type { ArniaModelloId } from '../../../database/types'
import type { ArniaColoreId } from '../constants/arniaColori'
import { DEFAULT_ARNIA_MODELLO_ID } from '../models/arniaModelli'

export type ArniaWizardStepId = 'tipo' | 'numero' | 'colore' | 'nome' | 'riepilogo'

export type ArniaWizardStepDef = {
  id: ArniaWizardStepId
  label: string
  title: string
}

export type ArniaWizardState = {
  modelloId: ArniaModelloId
  telaiPersonalizzati: string
  numero: string
  coloreId: ArniaColoreId | null
  nome: string
}

export const ARNIA_WIZARD_STEPS: ArniaWizardStepDef[] = [
  { id: 'tipo', label: 'Tipo', title: 'Tipo Arnia' },
  { id: 'numero', label: 'Numero', title: 'Numero Arnia' },
  { id: 'colore', label: 'Colore', title: 'Colore Arnia' },
  { id: 'nome', label: 'Nome', title: 'Nome Arnia' },
  { id: 'riepilogo', label: 'Riepilogo', title: 'Riepilogo' },
]

export const ARNIA_WIZARD_TOTAL_STEPS = ARNIA_WIZARD_STEPS.length

export function emptyArniaWizardState(): ArniaWizardState {
  return {
    modelloId: DEFAULT_ARNIA_MODELLO_ID,
    telaiPersonalizzati: '',
    numero: '',
    coloreId: null,
    nome: '',
  }
}

export function mapArniaWizardToInput(
  apiarioId: string,
  state: ArniaWizardState,
): ArniaInput {
  const telaiPersonalizzati = state.telaiPersonalizzati.trim()
    ? Number.parseInt(state.telaiPersonalizzati, 10)
    : undefined

  return {
    apiarioId,
    numero: state.numero.trim(),
    modelloId: state.modelloId,
    telaiPersonalizzati,
    colore: state.coloreId ?? undefined,
    nome: state.nome.trim() || undefined,
  }
}
