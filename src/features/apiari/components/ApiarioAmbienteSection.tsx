import { Input } from '../../../components/ui/Input'
import {
  APIARIO_ACCESSIBILITA_OPTIONS,
  APIARIO_ESPOSIZIONE_OPTIONS,
} from '../utils/apiarioFieldFormatters'
import './ApiarioAmbienteSection.css'

export type ApiarioAmbienteState = {
  esposizione: string
  accessibilita: string
  presenzaAcqua: boolean | undefined
  fiorituraPrevalente: string
}

export const emptyApiarioAmbiente = (): ApiarioAmbienteState => ({
  esposizione: '',
  accessibilita: '',
  presenzaAcqua: undefined,
  fiorituraPrevalente: '',
})

type ApiarioAmbienteSectionProps = {
  value: ApiarioAmbienteState
  onChange: (value: ApiarioAmbienteState) => void
}

export function ApiarioAmbienteSection({ value, onChange }: ApiarioAmbienteSectionProps) {
  return (
    <fieldset className="apiario-ambiente">
      <legend className="apiario-ambiente__legend">Ambiente e accesso</legend>

      <label className="apiario-ambiente__field">
        <span>Esposizione</span>
        <select
          value={value.esposizione}
          onChange={(e) => onChange({ ...value, esposizione: e.target.value })}
        >
          <option value="">Seleziona…</option>
          {APIARIO_ESPOSIZIONE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <label className="apiario-ambiente__field">
        <span>Accessibilità</span>
        <select
          value={value.accessibilita}
          onChange={(e) => onChange({ ...value, accessibilita: e.target.value })}
        >
          <option value="">Seleziona…</option>
          {APIARIO_ACCESSIBILITA_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <div className="apiario-ambiente__field">
        <span>Presenza acqua</span>
        <div className="apiario-ambiente__choices" role="radiogroup" aria-label="Presenza acqua">
          {[
            { value: 'yes', label: 'Sì', checked: value.presenzaAcqua === true },
            { value: 'no', label: 'No', checked: value.presenzaAcqua === false },
            { value: 'unknown', label: 'Non indicato', checked: value.presenzaAcqua === undefined },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`apiario-ambiente__choice${opt.checked ? ' apiario-ambiente__choice--active' : ''}`}
              onClick={() =>
                onChange({
                  ...value,
                  presenzaAcqua:
                    opt.value === 'yes' ? true : opt.value === 'no' ? false : undefined,
                })
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Fioritura prevalente"
        value={value.fiorituraPrevalente}
        onChange={(e) => onChange({ ...value, fiorituraPrevalente: e.target.value })}
        placeholder="Es. Castagno, acacia, millefiori…"
      />
    </fieldset>
  )
}

export function ambienteFromApiario(initial: {
  esposizione?: string
  accessibilita?: string
  presenzaAcqua?: boolean
  fiorituraPrevalente?: string
}): ApiarioAmbienteState {
  return {
    esposizione: initial.esposizione ?? '',
    accessibilita: initial.accessibilita ?? '',
    presenzaAcqua: initial.presenzaAcqua,
    fiorituraPrevalente: initial.fiorituraPrevalente ?? '',
  }
}

export function ambienteToApiarioInput(state: ApiarioAmbienteState) {
  return {
    esposizione: state.esposizione || undefined,
    accessibilita: state.accessibilita || undefined,
    presenzaAcqua: state.presenzaAcqua,
    fiorituraPrevalente: state.fiorituraPrevalente.trim() || undefined,
  }
}
