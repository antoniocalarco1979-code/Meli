import type { Arnia } from '../../../database/types'
import {
  createTelainoInspection,
  emptyIspezioneWizardState,
  type IspezioneWizardState,
} from '../../visite/types/ispezioneWizard.types'

export function createTelaiForArnia(numeroTelai: number) {
  const count = Math.max(1, numeroTelai)
  return Array.from({ length: count }, (_, index) => createTelainoInspection(index + 1))
}

export function createIspezioneStateForArnia(
  arnia: Pick<Arnia, 'numeroTelai'>,
): IspezioneWizardState {
  return {
    ...emptyIspezioneWizardState(),
    telai: createTelaiForArnia(arnia.numeroTelai),
  }
}
