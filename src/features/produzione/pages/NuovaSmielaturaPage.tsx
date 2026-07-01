import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Droplets } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import { parseDexieError } from '../../../database/errors'
import { createSmielatura } from '../../../database/services/produzioneService'
import { useAppPath } from '../../../demo/useAppPath'
import { useApiari } from '../../apiari/hooks/useApiari'
import { getArnieByApiarioId } from '../../../database/services/arnieService'
import { SmielaturaFormFields } from '../components/SmielaturaFormFields'
import {
  emptySmielaturaFormDraft,
  formDraftToSmielaturaInput,
} from '../utils/smielaturaFormatters'
import type { SmielaturaFormDraft } from '../types/smielatura.types'
import './NuovaSmielaturaPage.css'

export function NuovaSmielaturaPage() {
  const navigate = useNavigate()
  const appPath = useAppPath()
  const { apiari } = useApiari()
  const [form, setForm] = useState<SmielaturaFormDraft>(() =>
    emptySmielaturaFormDraft(apiari[0]?.id ?? ''),
  )
  const [arnie, setArnie] = useState<Awaited<ReturnType<typeof getArnieByApiarioId>>>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const apiarioId = form.apiarioId

  useEffect(() => {
    if (apiari.length > 0 && !form.apiarioId) {
      setForm((prev) => ({ ...prev, apiarioId: apiari[0].id }))
    }
  }, [apiari, form.apiarioId])

  useEffect(() => {
    if (!apiarioId) {
      setArnie([])
      return
    }
    void getArnieByApiarioId(apiarioId).then(setArnie)
  }, [apiarioId])

  const patchForm = (patch: Partial<SmielaturaFormDraft>) => {
    setForm((prev) => ({ ...prev, ...patch }))
  }

  const canSubmit = useMemo(() => Boolean(formDraftToSmielaturaInput(form)), [form])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')

    const input = formDraftToSmielaturaInput(form)
    if (!input) {
      setError('Compila apiario, data, melari e kg estratti.')
      return
    }

    setSaving(true)
    try {
      await createSmielatura(input)
      navigate(appPath('/produzione'))
    } catch (err) {
      setError(parseDexieError(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="nuova-smielatura-page">
      <Link to={appPath('/produzione')} className="nuova-smielatura-page__back">
        <ArrowLeft size={20} aria-hidden="true" />
        Storico produzione
      </Link>

      <motion.header
        className="nuova-smielatura-page__header"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="nuova-smielatura-page__title">
          <Droplets size={28} strokeWidth={1.75} aria-hidden="true" />
          Nuova Smielatura
        </h1>
        <p className="nuova-smielatura-page__subtitle">
          Registra rapidamente una raccolta dall&apos;apiario
        </p>
      </motion.header>

      <form className="nuova-smielatura-page__form meli-glass meli-glass--deep" onSubmit={handleSubmit}>
        <SmielaturaFormFields
          value={form}
          onChange={patchForm}
          apiari={apiari}
          arnie={arnie}
        />

        {error && <p className="nuova-smielatura-page__error">{error}</p>}

        <div className="nuova-smielatura-page__actions">
          <Button type="submit" disabled={saving || !canSubmit}>
            {saving ? 'Salvataggio…' : 'Conferma smielatura'}
          </Button>
        </div>
      </form>
    </div>
  )
}
