import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import type { IntelligenceSuggestion } from '../../../intelligence/types'
import './HomeAssistenteSection.css'

const PLACEHOLDER_SUGGESTION =
  'Inizia il giro dalle arnie con visita più datata. Il meteo di oggi è favorevole per i controlli in campo.'

type HomeAssistenteSectionProps = {
  suggestion?: IntelligenceSuggestion
  loading?: boolean
}

export function HomeAssistenteSection({
  suggestion,
  loading = false,
}: HomeAssistenteSectionProps) {
  const text = suggestion?.descrizione ?? PLACEHOLDER_SUGGESTION
  const title = suggestion?.titolo ?? 'Suggerimento del giorno'

  return (
    <motion.section
      className="home-assistente meli-glass meli-glass--deep"
      aria-label="Assistente MELI"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
    >
      <header className="home-assistente__header">
        <span className="home-assistente__icon" aria-hidden="true">
          <Sparkles size={22} strokeWidth={1.75} />
        </span>
        <div>
          <p className="home-assistente__eyebrow meli-label">Assistente MELI</p>
          <h2 className="home-assistente__title">{title}</h2>
        </div>
      </header>

      {loading ? (
        <p className="home-assistente__loading">Analisi in corso…</p>
      ) : (
        <p className="home-assistente__text">{text}</p>
      )}
    </motion.section>
  )
}
