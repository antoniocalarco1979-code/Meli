import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { EmptyState } from '../../../components/ui/EmptyState/EmptyState'
import type { IntelligenceSuggestion } from '../types'
import { IntelligenceSuggestionCard } from './IntelligenceSuggestionCard'
import './MeliIntelligencePanel.css'

type MeliIntelligencePanelProps = {
  suggestions: IntelligenceSuggestion[]
  loading?: boolean
  onOpenArnia?: (arniaId: string) => void
}

export function MeliIntelligencePanel({
  suggestions,
  loading = false,
  onOpenArnia,
}: MeliIntelligencePanelProps) {
  return (
    <motion.section
      className="meli-intelligence meli-glass meli-glass--deep"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
      aria-label="MELI Intelligence"
    >
      <header className="meli-intelligence__header">
        <div className="meli-intelligence__brand">
          <span className="meli-intelligence__icon-wrap" aria-hidden="true">
            <Sparkles size={22} strokeWidth={1.75} />
          </span>
          <div>
            <p className="meli-intelligence__eyebrow">Motore suggerimenti</p>
            <h2 className="meli-intelligence__title">MELI Intelligence</h2>
          </div>
        </div>
        {!loading && suggestions.length > 0 && (
          <span className="meli-intelligence__badge">{suggestions.length}</span>
        )}
      </header>

      {loading ? (
        <p className="meli-intelligence__loading">Analisi dati in corso…</p>
      ) : suggestions.length === 0 ? (
        <EmptyState
          title="Nessun suggerimento al momento"
          description="Le arnie dell'apiario selezionato non richiedono interventi urgenti."
          icon={<Sparkles size={40} strokeWidth={1.5} />}
        />
      ) : (
        <ul className="meli-intelligence__list">
          {suggestions.map((suggestion, index) => (
            <IntelligenceSuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              index={index}
              onOpenArnia={onOpenArnia}
            />
          ))}
        </ul>
      )}
    </motion.section>
  )
}
