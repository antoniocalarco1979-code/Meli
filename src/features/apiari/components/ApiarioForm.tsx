import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Check, X } from '../../../theme/icons'
import { Button } from '../../../components/ui/Button'
import { parseDexieError } from '../../../database/errors'
import { Input } from '../../../components/ui/Input'
import { Textarea } from '../../../components/ui/Textarea'
import type { ApiarioInput, ApiarioView } from '../types'
import {
  emptyApiarioPosizione,
  posizioneFromApiario,
  posizioneToApiarioInput,
  type ApiarioPosizioneState,
} from '../types/apiarioPosizione.types'
import { ApiarioPosizioneSection } from './ApiarioPosizioneSection'
import './ApiarioForm.css'

type ApiarioFormProps = {
  initial?: ApiarioView
  onSubmit: (data: ApiarioInput) => Promise<void>
  onCancel?: () => void
  submitLabel?: string
  compact?: boolean
  onboarding?: boolean
}

const emptyForm: Omit<ApiarioInput, 'nome'> & { nome: string } = {
  nome: '',
  note: '',
  foto: undefined,
  numeroArnie: 0,
}

export function ApiarioForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = 'Salva',
  compact = false,
  onboarding = false,
}: ApiarioFormProps) {
  const photoInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState(() =>
    initial
      ? {
          nome: initial.nome,
          note: initial.note ?? '',
          foto: initial.foto,
          numeroArnie: initial.numeroArnie,
        }
      : { ...emptyForm },
  )
  const [posizione, setPosizione] = useState<ApiarioPosizioneState>(() =>
    initial ? posizioneFromApiario(initial) : { ...emptyApiarioPosizione },
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setForm((prev) => ({ ...prev, foto: reader.result as string }))
      }
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.nome.trim()) {
      setError('Il nome dell\'apiario è obbligatorio.')
      return
    }

    setSaving(true)
    try {
      await onSubmit({
        ...form,
        ...posizioneToApiarioInput(posizione),
        nome: form.nome.trim(),
        note: form.note?.trim() ?? '',
        numeroArnie: Math.max(0, form.numeroArnie),
      })
    } catch (err) {
      setError(parseDexieError(err))
      throw new Error('save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="apiario-form" onSubmit={handleSubmit}>
      <div className="apiario-form__fields">
        <Input
          label={onboarding ? 'Nome apiario *' : 'Nome Apiario *'}
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          placeholder="Es. Apiario Acquacalda"
          required
        />

        <ApiarioPosizioneSection
          value={posizione}
          onChange={setPosizione}
          onError={setError}
        />

        {!onboarding && (
          <Input
            label={compact ? 'Numero arnie (opzionale)' : 'Numero iniziale di arnie'}
            type="number"
            min={0}
            value={form.numeroArnie || ''}
            onChange={(e) =>
              setForm({ ...form, numeroArnie: parseInt(e.target.value, 10) || 0 })
            }
          />
        )}

        {(onboarding || !compact) && (
          <Textarea
            label="Note"
            value={form.note ?? ''}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            placeholder="Accessi, fioriture, osservazioni…"
            rows={onboarding ? 4 : 3}
          />
        )}

        {!compact && !onboarding && (
          <div className="apiario-form__block">
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="apiario-form__upload-input"
              onChange={handlePhotoUpload}
            />
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="apiario-form__action-btn"
              onClick={() => photoInputRef.current?.click()}
            >
              📷 Scatta foto
            </Button>
            {form.foto && (
              <div className="apiario-form__photo-wrap">
                <img src={form.foto} alt="" className="apiario-form__photo-thumb" />
                <button
                  type="button"
                  className="apiario-form__photo-remove"
                  onClick={() => setForm((prev) => ({ ...prev, foto: undefined }))}
                  aria-label="Rimuovi foto"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {error && <p className="apiario-form__error">{error}</p>}

      <div className="apiario-form__divider" aria-hidden="true" />

      <div className="apiario-form__actions">
        {onCancel && (
          <Button type="button" variant="ghost" size="md" onClick={onCancel} disabled={saving}>
            Annulla
          </Button>
        )}
        <Button type="submit" variant="primary" size="md" disabled={saving} className={onCancel ? undefined : 'apiario-form__submit-full'}>
          <Check size={18} strokeWidth={2.5} aria-hidden="true" />
          {saving ? 'Salvataggio…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
