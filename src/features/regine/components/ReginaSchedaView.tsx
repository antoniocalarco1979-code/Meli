import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Save } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { updateRegina } from '../../../database/services/regineService'
import type { ReginaStatoOperativo } from '../../../database/types'
import { useAppPath } from '../../../demo/useAppPath'
import { useToast } from '../../../hooks/useToast'
import type { ReginaDetailView, ReginaFormDraft } from '../types/regina.types'
import {
  dateInputToTimestamp,
  formDraftToReginaInput,
  parseReginaAnno,
  reginaToFormDraft,
} from '../utils/reginaFormatters'
import { ReginaFormFields } from './ReginaFormFields'
import './ReginaSchedaView.css'

type ReginaSchedaViewProps = {
  data: ReginaDetailView
  onSaved: () => void
}

export function ReginaSchedaView({ data, onSaved }: ReginaSchedaViewProps) {
  const toast = useToast()
  const appPath = useAppPath()
  const initialDraft = useMemo(() => reginaToFormDraft(data.regina), [data.regina])
  const [draft, setDraft] = useState<ReginaFormDraft>(initialDraft)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setDraft(initialDraft)
  }, [initialDraft])

  const isDirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(initialDraft),
    [draft, initialDraft],
  )

  const handleSave = async () => {
    if (!draft.numero.trim()) {
      toast.error('Il numero regina è obbligatorio')
      return
    }

    setSaving(true)
    try {
      const input = formDraftToReginaInput(draft)
      await updateRegina(data.regina.id, {
        numero: input.numero,
        colore: input.colore,
        anno: parseReginaAnno(draft.anno),
        razza: input.razza,
        stato: (input.stato as ReginaStatoOperativo) || 'fecondata',
        dataInserimento: dateInputToTimestamp(draft.dataInserimento),
        note: input.note,
      })
      toast.success('Regina salvata')
      onSaved()
    } catch {
      toast.error('Errore durante il salvataggio')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="regina-scheda">
      <motion.header
        className="regina-scheda__hero meli-glass meli-glass--deep"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <div>
          <p className="regina-scheda__eyebrow">Scheda Regina</p>
          <h1 className="regina-scheda__title">{data.displayTitle}</h1>
          <p className="regina-scheda__meta">
            {data.apiario?.nome && <span>{data.apiario.nome}</span>}
            {data.arnia && (
              <Link to={appPath(`/arnie/${data.arnia.id}`)} className="regina-scheda__arnia-link">
                Arnia {data.arnia.numero}
              </Link>
            )}
            {data.isAttuale && <span className="regina-scheda__attuale">Regina attuale</span>}
          </p>
        </div>
        <div className="regina-scheda__badges">
          {data.coloreLabel && <span className="regina-scheda__badge">{data.coloreLabel}</span>}
          <span className="regina-scheda__badge">{data.statoLabel}</span>
        </div>
      </motion.header>

      <section className="regina-scheda__form meli-glass meli-glass--deep">
        <ReginaFormFields
          value={draft}
          onChange={(patch) => setDraft((prev) => ({ ...prev, ...patch }))}
        />
      </section>

      <div className="regina-scheda__actions">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!isDirty || saving}
          onClick={() => void handleSave()}
        >
          <Save size={20} aria-hidden="true" />
          {saving ? 'Salvataggio…' : 'Salva regina'}
        </Button>
      </div>
    </div>
  )
}
