import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { createArnia } from '../../../database/services/arnieService'
import { Button } from '../../../components/ui/Button'
import { ArniaCard } from '../../arnie/components/ArniaCard'
import { ArniaWizard } from '../../arnie/components/arnia-wizard/ArniaWizard'
import { useArnieByApiarioId } from '../../arnie/hooks/useArnie'
import './ApiarioArnieSection.css'

type ApiarioArnieSectionProps = {
  apiarioId: string
  apiarioNome: string
}

export function ApiarioArnieSection({ apiarioId, apiarioNome }: ApiarioArnieSectionProps) {
  const { arnie, loading } = useArnieByApiarioId(apiarioId)
  const [wizardOpen, setWizardOpen] = useState(false)

  if (wizardOpen) {
    return (
      <div className="apiario-arnie-section__wizard">
        <ArniaWizard
          apiarioId={apiarioId}
          apiarioNome={apiarioNome}
          onSubmit={createArnia}
          onComplete={() => setWizardOpen(false)}
          onCancel={() => setWizardOpen(false)}
        />
      </div>
    )
  }

  return (
    <motion.section
      className="apiario-arnie-section meli-glass meli-glass--deep"
      aria-labelledby="apiario-arnie-title"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="apiario-arnie-section__header">
        <div>
          <h2 id="apiario-arnie-title" className="apiario-arnie-section__title">
            Arnie dell&apos;apiario
          </h2>
          <p className="apiario-arnie-section__sub">
            {loading ? 'Caricamento…' : `${arnie.length} ${arnie.length === 1 ? 'arnia' : 'arnie'}`}
          </p>
        </div>
        <Button variant="primary" size="md" onClick={() => setWizardOpen(true)}>
          <Plus size={18} strokeWidth={2.25} aria-hidden="true" />
          Nuova Arnia
        </Button>
      </div>

      {!loading && arnie.length === 0 ? (
        <div className="apiario-arnie-section__empty">
          <p>Nessuna arnia in questo apiario.</p>
          <Button variant="secondary" size="md" onClick={() => setWizardOpen(true)}>
            <Plus size={18} aria-hidden="true" />
            Aggiungi la prima arnia
          </Button>
        </div>
      ) : (
        <ul className="apiario-arnie-section__grid">
          {arnie.map((item, index) => (
            <li key={item.arnia.id}>
              <ArniaCard item={item} index={index} compact />
            </li>
          ))}
        </ul>
      )}
    </motion.section>
  )
}
