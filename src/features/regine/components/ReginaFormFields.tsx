import { Input } from '../../../components/ui/Input'
import { Textarea } from '../../../components/ui/Textarea'
import { REGINA_COLORI, REGINA_STATI } from '../constants/reginaConstants'
import type { ReginaFormDraft } from '../types/regina.types'
import './ReginaFormFields.css'

type ReginaFormFieldsProps = {
  value: ReginaFormDraft
  onChange: (patch: Partial<ReginaFormDraft>) => void
  idPrefix?: string
}

export function ReginaFormFields({ value, onChange, idPrefix = 'regina' }: ReginaFormFieldsProps) {
  return (
    <div className="regina-form-fields">
      <div className="regina-form-fields__grid">
        <Input
          label="Numero"
          id={`${idPrefix}-numero`}
          value={value.numero}
          onChange={(e) => onChange({ numero: e.target.value })}
          required
        />
        <Input
          label="Anno"
          id={`${idPrefix}-anno`}
          inputMode="numeric"
          value={value.anno}
          onChange={(e) => onChange({ anno: e.target.value })}
        />
        <Input
          label="Razza"
          id={`${idPrefix}-razza`}
          value={value.razza}
          onChange={(e) => onChange({ razza: e.target.value })}
        />
        <Input
          label="Data inserimento"
          id={`${idPrefix}-data`}
          type="date"
          value={value.dataInserimento}
          onChange={(e) => onChange({ dataInserimento: e.target.value })}
        />
      </div>

      <div>
        <span className="regina-form-fields__label">Colore</span>
        <div className="regina-form-fields__chips">
          {REGINA_COLORI.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`regina-form-fields__chip${value.colore === item.value ? ' regina-form-fields__chip--active' : ''}`}
              onClick={() => onChange({ colore: item.value })}
            >
              {item.emoji} {item.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="regina-form-fields__label">Stato</span>
        <div className="regina-form-fields__chips">
          {REGINA_STATI.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`regina-form-fields__chip${value.stato === item.value ? ' regina-form-fields__chip--active' : ''}`}
              onClick={() => onChange({ stato: item.value })}
            >
              {item.emoji} {item.label}
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
        placeholder="Osservazioni sulla regina…"
      />
    </div>
  )
}
