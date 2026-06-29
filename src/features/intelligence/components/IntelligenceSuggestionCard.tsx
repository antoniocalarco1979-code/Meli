import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { IntelligenceSuggestion } from '../types'
import { INTELLIGENCE_ICONS, INTELLIGENCE_PRIORITA_LABEL } from './intelligenceUi'
import './IntelligenceSuggestionCard.css'

type IntelligenceSuggestionCardProps = {
  suggestion: IntelligenceSuggestion
  index: number
  onOpenArnia?: (arniaId: string) => void
}

export function IntelligenceSuggestionCard({
  suggestion,
  index,
  onOpenArnia,
}: IntelligenceSuggestionCardProps) {
  const Icon = INTELLIGENCE_ICONS[suggestion.icon]

  return (
    <motion.li
      className={`intelligence-card intelligence-card--${suggestion.priorita}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.04 * index }}
    >
      <div className="intelligence-card__icon-wrap" aria-hidden="true">
        <Icon size={22} strokeWidth={1.75} />
      </div>

      <div className="intelligence-card__body">
        <div className="intelligence-card__top">
          <span className={`intelligence-card__badge intelligence-card__badge--${suggestion.priorita}`}>
            {INTELLIGENCE_PRIORITA_LABEL[suggestion.priorita]}
          </span>
          <span className="intelligence-card__arnia">Arnia {suggestion.arniaNumero}</span>
        </div>

        <h3 className="intelligence-card__title">{suggestion.titolo}</h3>
        <p className="intelligence-card__description">{suggestion.descrizione}</p>

        <button
          type="button"
          className="intelligence-card__action"
          onClick={() => onOpenArnia?.(suggestion.arniaId)}
        >
          Apri Arnia
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </motion.li>
  )
}
