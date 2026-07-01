import { Input } from '../../../components/ui/Input'
import { Textarea } from '../../../components/ui/Textarea'
import { TRATTAMENTO_METODI, TRATTAMENTO_TIPI } from '../constants/trattamentoConstants'
import type { TrattamentoFormDraft } from '../types/trattamento.types'
import './TrattamentoFormFields.css'

type TrattamentoFormFieldsProps = {
  value: TrattamentoFormDraft
  onChange: (patch: Partial<TrattamentoFormDraft>) => void
  idPrefix?: string
  /** In visita la data è quella della visita — campo nascosto o read-only. */
  hideData?: boolean
}

export function TrattamentoFormFields({
  value,
  onChange,
  idPrefix = 'trattamento',
  hideData = false,
}: TrattamentoFormFieldsProps) {
  return (
    <div className="trattamento-form-fields">
      <div>
        <span className="trattamento-form-fields__label">Tipo trattamento</span>
        <div className="trattamento-form-fields__chips">
          {TRATTAMENTO_TIPI.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`trattamento-form-fields__chip${value.tipo === item.value ? ' trattamento-form-fields__chip--active' : ''}`}
              onClick={() => onChange({ tipo: item.value })}
            >
              {item.emoji} {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="trattamento-form-fields__grid">
        <Input
          label="Principio attivo"
          id={`${idPrefix}-principio`}
          value={value.principioAttivo}
          onChange={(e) => onChange({ principioAttivo: e.target.value })}
          placeholder="Es. Apivar, acido ossalico…"
        />
        <Input
          label="Dose"
          id={`${idPrefix}-dose`}
          value={value.dose}
          onChange={(e) => onChange({ dose: e.target.value })}
          placeholder="Es. 2 strisce, 30 ml…"
        />
        {!hideData && (
          <Input
            label="Data"
            id={`${idPrefix}-data`}
            type="date"
            value={value.data}
            onChange={(e) => onChange({ data: e.target.value })}
          />
        )}
        <Input
          label="Promemoria / scadenza"
          id={`${idPrefix}-scadenza`}
          type="date"
          value={value.scadenza}
          onChange={(e) => onChange({ scadenza: e.target.value })}
          hint="Follow-up o rimozione — genera promemoria calendario"
        />
      </div>

      <div>
        <span className="trattamento-form-fields__label">Metodo</span>
        <div className="trattamento-form-fields__chips trattamento-form-fields__chips--compact">
          {TRATTAMENTO_METODI.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`trattamento-form-fields__chip${value.metodo === item.value ? ' trattamento-form-fields__chip--active' : ''}`}
              onClick={() => onChange({ metodo: item.value })}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <Textarea
        label="Note"
        id={`${idPrefix}-note`}
        value={value.note}
        onChange={(e) => onChange({ note: e.target.value })}
        rows={3}
        placeholder="Condizioni, posizione strip, osservazioni…"
      />
    </div>
  )
}
