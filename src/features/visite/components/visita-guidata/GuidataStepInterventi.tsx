import type { ReginaInput, TrattamentoInput } from '../../../../database/types'
import { ReginaFormFields } from '../../../regine/components/ReginaFormFields'
import {
  formDraftToReginaInput,
  reginaPayloadToFormDraft,
} from '../../../regine/utils/reginaFormatters'
import { TrattamentoFormFields } from '../../../trattamenti/components/TrattamentoFormFields'
import {
  formDraftToTrattamentoInput,
  trattamentoPayloadToFormDraft,
} from '../../../trattamenti/utils/trattamentoFormatters'
import {
  INTERVENTO_CHECKLIST,
  isInterventoChecklistSelected,
  type VisitaInterventiState,
  type VisitaInterventoChecklistId,
} from '../../types/visitaInterventi.types'

type GuidataStepInterventiProps = {
  interventi: VisitaInterventiState
  onToggle: (checklistId: VisitaInterventoChecklistId) => void
  onPatchNote: (id: string, note: string) => void
  onPatchReginaPayload: (id: string, patch: Partial<Omit<ReginaInput, 'arniaId'>>) => void
  onPatchTrattamentoPayload: (id: string, patch: Partial<Omit<TrattamentoInput, 'arniaId' | 'data'>>) => void
}

export function GuidataStepInterventi({
  interventi,
  onToggle,
  onPatchNote,
  onPatchReginaPayload,
  onPatchTrattamentoPayload,
}: GuidataStepInterventiProps) {
  const altroItem = interventi.items.find((item) => item.checklistId === 'altro')
  const cambioReginaItem = interventi.items.find((item) => item.checklistId === 'cambio_regina')
  const trattamentoItem = interventi.items.find((item) => item.checklistId === 'trattamento')
  const nutrizioneItem = interventi.items.find((item) => item.checklistId === 'nutrizione')

  return (
    <div className="ispezione-step visita-guidata-step">
      <div className="ispezione-step__question">
        <span className="ispezione-step__emoji" aria-hidden="true">
          🛠️
        </span>
        <h2 className="ispezione-step__title">Interventi effettuati</h2>
      </div>

      <p className="ispezione-step__lead">
        Seleziona tutti gli interventi eseguiti durante la visita. Puoi proseguire anche senza
        selezionarne nessuno.
      </p>

      <div
        className="visita-guidata-interventi-grid visita-guidata-interventi-grid--checklist"
        role="group"
        aria-label="Checklist interventi effettuati"
      >
        {INTERVENTO_CHECKLIST.map((preset) => {
          const selected = isInterventoChecklistSelected(interventi, preset.id)
          return (
            <button
              key={preset.id}
              type="button"
              className={`visita-guidata-intervento-btn visita-guidata-intervento-btn--check${selected ? ' visita-guidata-intervento-btn--active' : ''}`}
              onClick={() => onToggle(preset.id)}
              aria-pressed={selected}
            >
              <span className="visita-guidata-intervento-btn__icon" aria-hidden="true">
                {preset.icon}
              </span>
              <span className="visita-guidata-intervento-btn__label">{preset.label}</span>
              {selected && (
                <span className="visita-guidata-intervento-btn__check" aria-hidden="true">
                  ✓
                </span>
              )}
            </button>
          )
        })}
      </div>

      {cambioReginaItem ? (
        <div className="visita-guidata-cambio-regina meli-glass meli-glass--deep">
          <h3 className="visita-guidata-cambio-regina__title">Nuova regina</h3>
          <p className="visita-guidata-cambio-regina__lead">
            La regina attuale verrà archiviata come sostituita. Inserisci i dati della nuova regina
            collegata all&apos;arnia.
          </p>
          <ReginaFormFields
            idPrefix={`cambio-${cambioReginaItem.id}`}
            value={reginaPayloadToFormDraft(cambioReginaItem.reginaPayload)}
            onChange={(patch) =>
              onPatchReginaPayload(cambioReginaItem.id, formDraftToReginaInput({
                ...reginaPayloadToFormDraft(cambioReginaItem.reginaPayload),
                ...patch,
              }))
            }
          />
        </div>
      ) : null}

      {trattamentoItem ? (
        <div className="visita-guidata-trattamento meli-glass meli-glass--deep">
          <h3 className="visita-guidata-trattamento__title">Registra trattamento</h3>
          <p className="visita-guidata-trattamento__lead">
            I dati verranno salvati sulla scheda arnia e compariranno in cronologia. Viene preparato
            un promemoria calendario se indichi una scadenza.
          </p>
          <TrattamentoFormFields
            idPrefix={`tratt-${trattamentoItem.id}`}
            hideData
            value={trattamentoPayloadToFormDraft(trattamentoItem.trattamentoPayload)}
            onChange={(patch) =>
              onPatchTrattamentoPayload(trattamentoItem.id, formDraftToTrattamentoInput({
                ...trattamentoPayloadToFormDraft(trattamentoItem.trattamentoPayload),
                ...patch,
              }))
            }
          />
        </div>
      ) : null}

      {nutrizioneItem ? (
        <div className="visita-guidata-trattamento meli-glass meli-glass--deep">
          <h3 className="visita-guidata-trattamento__title">Registra nutrizione</h3>
          <TrattamentoFormFields
            idPrefix={`nutr-${nutrizioneItem.id}`}
            hideData
            value={trattamentoPayloadToFormDraft(
              { ...nutrizioneItem.trattamentoPayload, tipo: nutrizioneItem.trattamentoPayload?.tipo ?? 'nutrizione' },
            )}
            onChange={(patch) =>
              onPatchTrattamentoPayload(nutrizioneItem.id, formDraftToTrattamentoInput({
                ...trattamentoPayloadToFormDraft(nutrizioneItem.trattamentoPayload),
                ...patch,
                tipo: patch.tipo ?? 'nutrizione',
              }))
            }
          />
        </div>
      ) : null}

      {altroItem ? (
        <div className="ispezione-field visita-guidata-interventi-altro">
          <p className="ispezione-field__label">Note altro intervento</p>
          <textarea
            className="ispezione-note__field"
            rows={3}
            placeholder="Descrivi l'intervento…"
            value={altroItem.note}
            onChange={(event) => onPatchNote(altroItem.id, event.target.value)}
          />
        </div>
      ) : null}
    </div>
  )
}
