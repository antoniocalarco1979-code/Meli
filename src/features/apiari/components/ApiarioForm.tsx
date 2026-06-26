import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Check, X } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Textarea } from '../../../components/ui/Textarea'
import type { ApiarioInput, ApiarioView } from '../types'
import './ApiarioForm.css'

type ApiarioFormProps = {
  initial?: ApiarioView
  onSubmit: (data: ApiarioInput) => Promise<void>
  onCancel: () => void
  submitLabel?: string
}

const emptyForm: ApiarioInput = {
  nome: '',
  localita: '',
  latitudine: undefined,
  longitudine: undefined,
  note: '',
  foto: undefined,
  numeroArnie: 0,
}

const hasGeolocation =
  typeof navigator !== 'undefined' && 'geolocation' in navigator

export function ApiarioForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = 'Salva',
}: ApiarioFormProps) {
  const photoInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<ApiarioInput>(() =>
    initial
      ? {
          nome: initial.nome,
          localita: initial.localita,
          latitudine: initial.latitudine,
          longitudine: initial.longitudine,
          note: initial.note ?? '',
          foto: initial.foto,
          numeroArnie: initial.numeroArnie,
        }
      : { ...emptyForm },
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [gpsLoading, setGpsLoading] = useState(false)

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

  const handleGps = () => {
    if (!hasGeolocation) return

    setGpsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          latitudine: Number(pos.coords.latitude.toFixed(6)),
          longitudine: Number(pos.coords.longitude.toFixed(6)),
        }))
        setError('')
        setGpsLoading(false)
      },
      () => {
        setError('Impossibile ottenere la posizione. Riprova in apiario.')
        setGpsLoading(false)
      },
    )
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
        nome: form.nome.trim(),
        localita: form.localita.trim(),
        note: form.note?.trim() ?? '',
        numeroArnie: Math.max(0, form.numeroArnie),
      })
    } catch {
      setError('Errore durante il salvataggio. Riprova.')
      throw new Error('save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="apiario-form" onSubmit={handleSubmit}>
      <div className="apiario-form__fields">
        <Input
          label="Nome Apiario *"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          placeholder="Es. Apiario Acquacalda"
          required
        />

        <Input
          label="Località"
          value={form.localita}
          onChange={(e) => setForm({ ...form, localita: e.target.value })}
          placeholder="Es. San Roberto (RC)"
        />

        <Input
          label="Numero iniziale di arnie"
          type="number"
          min={0}
          value={form.numeroArnie || ''}
          onChange={(e) =>
            setForm({ ...form, numeroArnie: parseInt(e.target.value, 10) || 0 })
          }
        />

        <Textarea
          label="Note"
          value={form.note ?? ''}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          placeholder="Osservazioni, accessi, fioriture…"
          rows={3}
        />

        {hasGeolocation && (
          <Button
            type="button"
            variant="secondary"
            size="md"
            className="apiario-form__action-btn"
            onClick={handleGps}
            disabled={gpsLoading}
          >
            📍 Usa posizione attuale
          </Button>
        )}

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
      </div>

      {error && <p className="apiario-form__error">{error}</p>}

      <div className="apiario-form__divider" aria-hidden="true" />

      <div className="apiario-form__actions">
        <Button type="button" variant="ghost" size="md" onClick={onCancel} disabled={saving}>
          Annulla
        </Button>
        <Button type="submit" variant="primary" size="md" disabled={saving}>
          <Check size={18} strokeWidth={2.5} aria-hidden="true" />
          {saving ? 'Salvataggio…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
