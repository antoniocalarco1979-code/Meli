import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Check } from '../../../../theme/icons'
import { Button } from '../../../../components/ui/Button'
import { Input } from '../../../../components/ui/Input'
import { parseDexieError } from '../../../../database/errors'
import type { ArniaInput } from '../../../../database/types/inputs'
import { getArniaColoreById } from '../../constants/arniaColori'
import { useArniaWizard } from '../../hooks/useArniaWizard'
import {
  getModelloLabel,
  getModelloPreset,
  isModelloPersonalizzato,
  resolveArniaModello,
  ARNIA_WIZARD_MODELLO_OPTIONS,
} from '../../models/arniaModelli'
import { mapArniaWizardToInput } from '../../types/arniaWizard.types'
import { VisitChoiceGrid } from '../../../visite/components/visit-engine/VisitChoiceGrid'
import { ArniaColorPalette } from './ArniaColorPalette'
import '../../../visite/components/visit-engine/visit-engine.css'
import './ArniaWizard.css'

type ArniaWizardProps = {
  apiarioId: string
  onSubmit: (data: ArniaInput) => Promise<void>
  onCancel?: () => void
  submitLabel?: string
}

const stepMotion = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const },
}

export function ArniaWizard({
  apiarioId,
  onSubmit,
  onCancel,
  submitLabel = 'SALVA',
}: ArniaWizardProps) {
  const {
    step,
    stepIndex,
    totalSteps,
    state,
    stepError,
    isFirst,
    isLast,
    patchState,
    goNext,
    goPrev,
    validateAll,
  } = useArniaWizard()

  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const preset = getModelloPreset(state.modelloId)
  const resolvedModello = resolveArniaModello(
    state.modelloId,
    state.telaiPersonalizzati.trim()
      ? Number.parseInt(state.telaiPersonalizzati, 10)
      : undefined,
  )
  const colore = getArniaColoreById(state.coloreId ?? undefined)

  const handleSave = async () => {
    const validationError = validateAll
    if (validationError) {
      setSaveError(validationError)
      return
    }

    setSaving(true)
    setSaveError('')
    try {
      await onSubmit(mapArniaWizardToInput(apiarioId, state))
    } catch (err) {
      setSaveError(parseDexieError(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="arnia-wizard">
      <div className="arnia-wizard__progress" aria-label={`Passo ${stepIndex + 1} di ${totalSteps}`}>
        <div className="arnia-wizard__progress-meta">
          <span>
            Passo {stepIndex + 1}/{totalSteps}
          </span>
          <span>{step.label}</span>
        </div>
        <div
          className="arnia-wizard__progress-bar"
          role="progressbar"
          aria-valuenow={((stepIndex + 1) / totalSteps) * 100}
        >
          <div
            className="arnia-wizard__progress-fill"
            style={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step.id} className="arnia-wizard__step" {...stepMotion}>
          <h3 className="arnia-wizard__step-title">{step.title}</h3>

          {step.id === 'tipo' && (
            <>
              <p className="arnia-wizard__lead">Seleziona il modello costruttivo dell&apos;arnia.</p>
              <VisitChoiceGrid
                variant="radio"
                columns={false}
                options={ARNIA_WIZARD_MODELLO_OPTIONS}
                value={state.modelloId}
                onSelect={(modelloId) => patchState({ modelloId })}
              />
              {isModelloPersonalizzato(state.modelloId) ? (
                <Input
                  label="Numero telaini *"
                  value={state.telaiPersonalizzati}
                  onChange={(e) => patchState({ telaiPersonalizzati: e.target.value })}
                  placeholder="Es. 8"
                  inputMode="numeric"
                />
              ) : (
                <div className="arnia-wizard__modello-summary" aria-live="polite">
                  <p className="arnia-wizard__modello-summary-title">Configurazione automatica</p>
                  <ul>
                    <li>{preset.numeroTelai} telaini preparati</li>
                    <li>{preset.hasMelario ? 'Con melario' : 'Senza melario'}</li>
                    <li>{preset.hasVassoioAntivarroa ? 'Vassoio antivarroa' : 'Senza vassoio antivarroa'}</li>
                  </ul>
                </div>
              )}
            </>
          )}

          {step.id === 'numero' && (
            <>
              <p className="arnia-wizard__lead">Assegna il numero identificativo dell&apos;arnia in apiario.</p>
              <Input
                label="Numero arnia *"
                value={state.numero}
                onChange={(e) => patchState({ numero: e.target.value })}
                placeholder="Es. 12"
                inputMode="numeric"
                autoFocus
              />
            </>
          )}

          {step.id === 'colore' && (
            <>
              <p className="arnia-wizard__lead">Scegli un colore per riconoscere l&apos;arnia sul campo.</p>
              <ArniaColorPalette
                value={state.coloreId}
                onChange={(coloreId) => patchState({ coloreId })}
              />
            </>
          )}

          {step.id === 'nome' && (
            <>
              <p className="arnia-wizard__lead">Aggiungi un nome descrittivo (facoltativo).</p>
              <Input
                label="Nome arnia"
                value={state.nome}
                onChange={(e) => patchState({ nome: e.target.value })}
                placeholder="Es. Regina forte"
              />
            </>
          )}

          {step.id === 'riepilogo' && (
            <>
              <p className="arnia-wizard__lead">Controlla i dati prima del salvataggio.</p>
              <dl className="arnia-wizard__summary">
                <div>
                  <dt>Tipo</dt>
                  <dd>{getModelloLabel(state.modelloId)}</dd>
                </div>
                <div>
                  <dt>Numero</dt>
                  <dd>{state.numero.trim() || '—'}</dd>
                </div>
                <div>
                  <dt>Colore</dt>
                  <dd className="arnia-wizard__summary-color">
                    {colore ? (
                      <>
                        <span
                          className="arnia-wizard__summary-swatch"
                          style={{ background: colore.hex }}
                          aria-hidden="true"
                        />
                        {colore.label}
                      </>
                    ) : (
                      '—'
                    )}
                  </dd>
                </div>
                <div>
                  <dt>Nome</dt>
                  <dd>{state.nome.trim() || '—'}</dd>
                </div>
                <div className="arnia-wizard__summary-wide">
                  <dt>Configurazione telai</dt>
                  <dd>
                    {resolvedModello.numeroTelai} telaini ·{' '}
                    {resolvedModello.hasMelario ? 'melario' : 'senza melario'} ·{' '}
                    {resolvedModello.hasVassoioAntivarroa
                      ? 'vassoio antivarroa'
                      : 'senza vassoio'}
                  </dd>
                </div>
              </dl>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {(stepError || saveError) && (
        <p className="arnia-wizard__error">{stepError || saveError}</p>
      )}

      <div className="arnia-wizard__divider" aria-hidden="true" />

      <div className="arnia-wizard__actions">
        {onCancel && (
          <Button type="button" variant="ghost" size="md" onClick={onCancel} disabled={saving}>
            Annulla
          </Button>
        )}
        {!isFirst && (
          <Button type="button" variant="secondary" size="md" onClick={goPrev} disabled={saving}>
            <ArrowLeft size={18} aria-hidden="true" />
            Indietro
          </Button>
        )}
        {!isLast ? (
          <Button type="button" variant="primary" size="md" onClick={goNext} className="arnia-wizard__primary">
            Avanti
          </Button>
        ) : (
          <Button
            type="button"
            variant="primary"
            size="md"
            disabled={saving}
            className="arnia-wizard__primary"
            onClick={() => void handleSave()}
          >
            <Check size={18} strokeWidth={2.5} aria-hidden="true" />
            {saving ? 'Salvataggio…' : submitLabel}
          </Button>
        )}
      </div>
    </div>
  )
}
