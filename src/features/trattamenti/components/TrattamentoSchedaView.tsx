import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Save } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { updateTrattamento } from '../../../database/services/trattamentiService'
import { useAppPath } from '../../../demo/useAppPath'
import { useToast } from '../../../hooks/useToast'
import type { TrattamentoDetailView, TrattamentoFormDraft } from '../types/trattamento.types'
import {
  dateInputToTimestamp,
  formDraftToTrattamentoInput,
  trattamentoToFormDraft,
} from '../utils/trattamentoFormatters'
import { formatPromemoriaLabel } from '../services/trattamentoDetailService'
import { TrattamentoFormFields } from './TrattamentoFormFields'
import './TrattamentoSchedaView.css'

type TrattamentoSchedaViewProps = {
  data: TrattamentoDetailView
  onSaved: () => void
}

export function TrattamentoSchedaView({ data, onSaved }: TrattamentoSchedaViewProps) {
  const toast = useToast()
  const appPath = useAppPath()
  const initialDraft = useMemo(() => trattamentoToFormDraft(data.trattamento), [data.trattamento])
  const [draft, setDraft] = useState<TrattamentoFormDraft>(initialDraft)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setDraft(initialDraft)
  }, [initialDraft])

  const isDirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(initialDraft),
    [draft, initialDraft],
  )

  const handleSave = async () => {
    if (!draft.tipo.trim()) {
      toast.error('Seleziona il tipo trattamento')
      return
    }

    setSaving(true)
    try {
      const input = formDraftToTrattamentoInput(draft)
      await updateTrattamento(data.trattamento.id, {
        tipo: input.tipo,
        principioAttivo: input.principioAttivo,
        data: dateInputToTimestamp(draft.data) ?? data.trattamento.data,
        dose: input.dose,
        metodo: input.metodo,
        note: input.note,
        scadenza: input.scadenza,
      })
      toast.success('Trattamento salvato')
      onSaved()
    } catch {
      toast.error('Errore durante il salvataggio')
    } finally {
      setSaving(false)
    }
  }

  const promemoriaLabel = formatPromemoriaLabel(data.promemoria)

  return (
    <div className="trattamento-scheda">
      <motion.header
        className="trattamento-scheda__hero meli-glass meli-glass--deep"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <p className="trattamento-scheda__eyebrow">Scheda Trattamento</p>
          <h1 className="trattamento-scheda__title">{data.tipoLabel}</h1>
          <p className="trattamento-scheda__meta">
            {data.dataLabel}
            {data.arnia && (
              <>
                {' · '}
                <Link to={appPath(`/arnie/${data.arnia.id}`)} className="trattamento-scheda__arnia-link">
                  Arnia {data.arnia.numero}
                </Link>
              </>
            )}
          </p>
        </div>
      </motion.header>

      {promemoriaLabel && (
        <p className="trattamento-scheda__promemoria meli-glass meli-glass--deep">
          📅 {promemoriaLabel}
        </p>
      )}

      <section className="trattamento-scheda__form meli-glass meli-glass--deep">
        <TrattamentoFormFields
          value={draft}
          onChange={(patch) => setDraft((prev) => ({ ...prev, ...patch }))}
        />
      </section>

      <div className="trattamento-scheda__actions">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!isDirty || saving}
          onClick={() => void handleSave()}
        >
          <Save size={20} aria-hidden="true" />
          {saving ? 'Salvataggio…' : 'Salva trattamento'}
        </Button>
      </div>
    </div>
  )
}
