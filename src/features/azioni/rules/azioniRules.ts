import {
  isAcariStimatiAlti,
  isVarroaVassoioPositiva,
} from '../../visite/services/ispezioneNoteFormat'
import type { AzioneRule } from '../types'

function scorteScarseSuMoltiTelai(ctx: { telaiTotali: number; telaiScorteScarseCount: number }): boolean {
  if (ctx.telaiTotali < 2) return false
  return ctx.telaiScorteScarseCount / ctx.telaiTotali >= 0.5
}

/** Registro estendibile — aggiungere nuove regole in coda. */
export const AZIONI_CONSIGLIATE_RULES: AzioneRule[] = [
  {
    id: 'regina-non-vista',
    priorita: 'programmare',
    match: (ctx) => ctx.hasVisita && ctx.reginaLabel === 'Non vista',
    message: 'Ricontrollare entro 7 giorni.',
  },
  {
    id: 'regina-da-sostituire',
    priorita: 'importante',
    match: (ctx) => ctx.hasVisita && ctx.reginaLabel === 'Da sostituire',
    message: 'Sostituire la regina.',
  },
  {
    id: 'covata-scarsa',
    priorita: 'importante',
    match: (ctx) => ctx.hasVisita && ctx.covataLabel === 'Scarsa',
    message: 'Controllare la presenza della regina.',
  },
  {
    id: 'covata-assente',
    priorita: 'urgente',
    match: (ctx) => ctx.hasVisita && ctx.covataLabel === 'Assente',
    message: 'Ispezione urgente.',
  },
  {
    id: 'scorte-scarse',
    priorita: 'importante',
    match: (ctx) => ctx.hasVisita && ctx.scorteLabel === 'Scarse',
    message: 'Valutare nutrizione.',
  },
  {
    id: 'melario-opercolato',
    priorita: 'programmare',
    match: (ctx) => ctx.hasVisita && ctx.melarioLabel === 'Opercolato',
    message: 'Programmare smielatura.',
  },
  {
    id: 'varroa-trattamento',
    priorita: 'importante',
    match: (ctx) =>
      ctx.hasVisita &&
      (isVarroaVassoioPositiva(ctx.vassoioVarroa) || isAcariStimatiAlti(ctx.acariStimati)),
    message: 'Valutare trattamento antivarroa.',
  },
  {
    id: 'celle-reali-sciamatura',
    priorita: 'importante',
    match: (ctx) => ctx.hasVisita && ctx.telaiConCelleReali,
    message: 'Controllare rischio sciamatura.',
  },
  {
    id: 'scorte-scarse-telai',
    priorita: 'importante',
    match: (ctx) => ctx.hasVisita && scorteScarseSuMoltiTelai(ctx),
    message: 'Valutare nutrizione.',
  },
  {
    id: 'regina-covata-assente',
    priorita: 'urgente',
    match: (ctx) =>
      ctx.hasVisita &&
      ctx.telaiTotali > 0 &&
      !ctx.reginaVistaSuTelai &&
      ctx.covataAssenteSuTuttiTelai,
    message: 'Verificare presenza regina.',
  },
]
