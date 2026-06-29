import { useState, type FormEvent } from 'react'
import { Check } from '../../../theme/icons'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { parseDexieError } from '../../../database/errors'
import type { ArniaInput } from '../../../database/types/inputs'
import type { ArniaModelloId } from '../../../database/types'
import {
  ARNIA_MODELLO_OPTIONS,
  DEFAULT_ARNIA_MODELLO_ID,
  getModelloPreset,
  isModelloPersonalizzato,
} from '../models/arniaModelli'
import { VisitChoiceGrid } from '../../visite/components/visit-engine/VisitChoiceGrid'
import '../../visite/components/visit-engine/visit-engine.css'
import './ArniaForm.css'

type ArniaFormProps = {
  apiarioId: string
  onSubmit: (data: ArniaInput) => Promise<void>
  onCancel?: () => void
  submitLabel?: string
}

export function ArniaForm({
  apiarioId,
  onSubmit,
  onCancel,
  submitLabel = 'Salva',
}: ArniaFormProps) {
  const [numero, setNumero] = useState('')
  const [nome, setNome] = useState('')
  const [modelloId, setModelloId] = useState<ArniaModelloId>(DEFAULT_ARNIA_MODELLO_ID)
  const [telaiPersonalizzati, setTelaiPersonalizzati] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const preset = getModelloPreset(modelloId)
  const showTelaiPersonalizzati = isModelloPersonalizzato(modelloId)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    const trimmedNumero = numero.trim()
    if (!trimmedNumero) {
      setError('Il numero arnia è obbligatorio.')
      return
    }

    let parsedTelai: number | undefined
    if (showTelaiPersonalizzati) {
      parsedTelai = Number.parseInt(telaiPersonalizzati, 10)
      if (!telaiPersonalizzati.trim() || Number.isNaN(parsedTelai) || parsedTelai < 1) {
        setError('Indica il numero dei telaini (minimo 1).')
        return
      }
    }

    setSaving(true)
    try {
      await onSubmit({
        apiarioId,
        numero: trimmedNumero,
        modelloId,
        telaiPersonalizzati: parsedTelai,
        nome: nome.trim() || undefined,
      })
    } catch (err) {
      setError(parseDexieError(err))
      throw new Error('save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="arnia-form" onSubmit={handleSubmit}>
      <div className="arnia-form__fields">
        <Input
          label="Numero *"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          placeholder="Es. 1"
          inputMode="numeric"
          required
        />
        <Input
          label="Nome (facoltativo)"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Es. Regina forte"
        />

        <div className="arnia-form__modello">
          <p className="arnia-form__modello-label">Modello arnia *</p>
          <VisitChoiceGrid
            variant="radio"
            columns={false}
            options={ARNIA_MODELLO_OPTIONS}
            value={modelloId}
            onSelect={setModelloId}
          />
        </div>

        {showTelaiPersonalizzati ? (
          <Input
            label="Numero telaini *"
            value={telaiPersonalizzati}
            onChange={(e) => setTelaiPersonalizzati(e.target.value)}
            placeholder="Es. 8"
            inputMode="numeric"
            required
          />
        ) : (
          <div className="arnia-form__modello-summary" aria-live="polite">
            <p className="arnia-form__modello-summary-title">Configurazione modello</p>
            <ul className="arnia-form__modello-summary-list">
              <li>{preset.numeroTelai} telaini</li>
              <li>{preset.hasMelario ? 'Con melario' : 'Senza melario'}</li>
              <li>{preset.hasVassoioAntivarroa ? 'Vassoio antivarroa' : 'Senza vassoio antivarroa'}</li>
            </ul>
          </div>
        )}
      </div>

      {error && <p className="arnia-form__error">{error}</p>}

      <div className="arnia-form__divider" aria-hidden="true" />

      <div className="arnia-form__actions">
        {onCancel && (
          <Button type="button" variant="ghost" size="md" onClick={onCancel} disabled={saving}>
            Annulla
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={saving}
          className={onCancel ? undefined : 'arnia-form__submit-full'}
        >
          <Check size={18} strokeWidth={2.5} aria-hidden="true" />
          {saving ? 'Salvataggio…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
