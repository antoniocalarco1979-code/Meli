import { createProduzione } from '../../../database/services/produzioneService'
import { sostituisciRegina } from '../../../database/services/regineService'
import { createTrattamento } from '../../../database/services/trattamentiService'
import type { TrattamentoInput } from '../../../database/types'
import type {
  VisitaInterventiApplyResult,
  VisitaInterventoDraft,
} from '../types/visitaInterventi.types'

function buildTrattamentoFromIntervento(
  arniaId: string,
  visitaData: number,
  visitaId: string | undefined,
  payload: Partial<Omit<TrattamentoInput, 'arniaId'>> | undefined,
  intervento: VisitaInterventoDraft,
  defaultTipo: string,
): TrattamentoInput {
  const noteParts = [payload?.note?.trim(), intervento.note.trim()].filter(Boolean)
  noteParts.push(`Registrato in visita del ${new Date(visitaData).toLocaleDateString('it-IT')}`)

  return {
    arniaId,
    visitaId,
    data: visitaData,
    tipo: payload?.tipo ?? defaultTipo,
    principioAttivo:
      payload?.principioAttivo?.trim() ||
      payload?.prodotto?.trim() ||
      intervento.note.trim() ||
      intervento.label,
    dose: payload?.dose,
    metodo: payload?.metodo,
    scadenza: payload?.scadenza ?? payload?.dataProgrammata,
    note: noteParts.join(' · ') || undefined,
  }
}

/**
 * Applica gli interventi registrati in visita ai moduli Regine, Trattamenti e Produzione.
 */
export async function applyVisitaInterventiBridge(
  arniaId: string,
  interventi: VisitaInterventoDraft[],
  visitaData: number,
  visitaId?: string,
): Promise<VisitaInterventiApplyResult> {
  const result: VisitaInterventiApplyResult = {
    trattamentiCreati: 0,
    regineCreate: 0,
    produzioniCreate: 0,
    altriRegistrati: 0,
  }

  for (const intervento of interventi) {
    switch (intervento.checklistId) {
      case 'trattamento':
        await createTrattamento(
          buildTrattamentoFromIntervento(
            arniaId,
            visitaData,
            visitaId,
            intervento.trattamentoPayload,
            intervento,
            'varroa',
          ),
        )
        result.trattamentiCreati += 1
        break

      case 'nutrizione':
        await createTrattamento(
          buildTrattamentoFromIntervento(
            arniaId,
            visitaData,
            visitaId,
            { ...intervento.trattamentoPayload, tipo: intervento.trattamentoPayload?.tipo ?? 'nutrizione' },
            intervento,
            'nutrizione',
          ),
        )
        result.trattamentiCreati += 1
        break

      case 'cambio_regina': {
        const payload = intervento.reginaPayload
        const numero =
          payload?.numero?.trim() ||
          (payload?.anno ? String(payload.anno) : `R-${new Date(visitaData).getFullYear()}`)

        const noteParts = [payload?.note?.trim(), intervento.note.trim()].filter(Boolean)
        noteParts.push(`Cambio regina in visita del ${new Date(visitaData).toLocaleDateString('it-IT')}`)

        await sostituisciRegina(
          arniaId,
          {
            numero,
            anno: payload?.anno,
            colore: payload?.colore,
            razza: payload?.razza,
            stato: payload?.stato ?? 'fecondata',
            dataInserimento: payload?.dataInserimento ?? visitaData,
            note: noteParts.join(' · '),
          },
          visitaData,
        )
        result.regineCreate += 1
        break
      }

      case 'aggiunto_melario': {
        const kg = intervento.produzionePayload?.kg ?? 0
        await createProduzione({
          arniaId,
          data: visitaData,
          kg: kg > 0 ? kg : 0,
          tipo: intervento.note.trim() || 'Melario aggiunto',
        })
        result.produzioniCreate += 1
        break
      }

      case 'tolto_melario':
      case 'foglio_cereo':
      case 'altro':
        result.altriRegistrati += 1
        break
    }
  }

  return result
}
