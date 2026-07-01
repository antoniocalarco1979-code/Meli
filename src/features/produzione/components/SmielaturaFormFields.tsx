import { Input } from '../../../components/ui/Input'
import { Textarea } from '../../../components/ui/Textarea'
import type { ApiarioView } from '../../apiari/types'
import type { Arnia } from '../../../database/types'
import type { SmielaturaFormDraft } from '../types/smielatura.types'
import './SmielaturaFormFields.css'

type SmielaturaFormFieldsProps = {
  value: SmielaturaFormDraft
  onChange: (patch: Partial<SmielaturaFormDraft>) => void
  apiari: ApiarioView[]
  arnie: Arnia[]
  idPrefix?: string
}

export function SmielaturaFormFields({
  value,
  onChange,
  apiari,
  arnie,
  idPrefix = 'smielatura',
}: SmielaturaFormFieldsProps) {
  const toggleArnia = (arniaId: string) => {
    const selected = value.arnieCoinvolteIds.includes(arniaId)
    onChange({
      arnieCoinvolteIds: selected
        ? value.arnieCoinvolteIds.filter((id) => id !== arniaId)
        : [...value.arnieCoinvolteIds, arniaId],
    })
  }

  return (
    <div className="smielatura-form-fields">
      <div className="smielatura-form-fields__field">
        <label className="smielatura-form-fields__label" htmlFor={`${idPrefix}-apiario`}>
          Apiario
        </label>
        <select
          id={`${idPrefix}-apiario`}
          className="smielatura-form-fields__select"
          value={value.apiarioId}
          onChange={(e) =>
            onChange({ apiarioId: e.target.value, arnieCoinvolteIds: [] })
          }
        >
          <option value="">Seleziona apiario…</option>
          {apiari.map((apiario) => (
            <option key={apiario.id} value={apiario.id}>
              {apiario.nome}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Data"
        id={`${idPrefix}-data`}
        type="date"
        value={value.data}
        onChange={(e) => onChange({ data: e.target.value })}
      />

      {value.apiarioId && arnie.length > 0 && (
        <div>
          <span className="smielatura-form-fields__label">Arnie coinvolte (facoltativo)</span>
          <div className="smielatura-form-fields__chips">
            {arnie.map((arnia) => (
              <button
                key={arnia.id}
                type="button"
                className={`smielatura-form-fields__chip${
                  value.arnieCoinvolteIds.includes(arnia.id)
                    ? ' smielatura-form-fields__chip--active'
                    : ''
                }`}
                onClick={() => toggleArnia(arnia.id)}
              >
                Arnia {arnia.numero}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="smielatura-form-fields__grid">
        <Input
          label="Numero melari"
          id={`${idPrefix}-melari`}
          type="number"
          inputMode="numeric"
          min={0}
          value={value.numeroMelari}
          onChange={(e) => onChange({ numeroMelari: e.target.value })}
          placeholder="Es. 4"
        />
        <Input
          label="Kg estratti"
          id={`${idPrefix}-kg`}
          type="number"
          inputMode="decimal"
          min={0}
          step="0.1"
          value={value.kg}
          onChange={(e) => onChange({ kg: e.target.value })}
          placeholder="Es. 18.5"
        />
        <Input
          label="Umidità (facoltativa)"
          id={`${idPrefix}-umidita`}
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          step="0.1"
          value={value.umidita}
          onChange={(e) => onChange({ umidita: e.target.value })}
          placeholder="Es. 17.5"
          hint="Percentuale"
        />
      </div>

      <Textarea
        label="Note"
        id={`${idPrefix}-note`}
        value={value.note}
        onChange={(e) => onChange({ note: e.target.value })}
        rows={3}
        placeholder="Varietà, condizioni, osservazioni…"
      />
    </div>
  )
}
