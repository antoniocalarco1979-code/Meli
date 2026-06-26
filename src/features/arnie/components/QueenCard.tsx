import { motion } from 'framer-motion'
import { Crown, RefreshCw } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import type { QueenSummary } from '../types'
import './QueenCard.css'

type QueenCardProps = {
  queen: QueenSummary
  onReplace?: () => void
}

function capitalize(value?: string) {
  if (!value) return '—'
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function QueenCard({ queen, onReplace }: QueenCardProps) {
  return (
    <motion.section
      className="queen-card meli-glass meli-glass--deep"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Regina"
    >
      <header className="queen-card__header">
        <Crown size={24} strokeWidth={1.65} aria-hidden="true" />
        <h2 className="arnia-section-title">Regina</h2>
      </header>

      {!queen.present ? (
        <p className="queen-card__empty">Nessuna regina registrata</p>
      ) : (
        <dl className="queen-card__grid">
          <div>
            <dt>Anno</dt>
            <dd>{queen.anno ?? '—'}</dd>
          </div>
          <div>
            <dt>Colore</dt>
            <dd>{capitalize(queen.colore)}</dd>
          </div>
          <div>
            <dt>Origine</dt>
            <dd>{capitalize(queen.origine)}</dd>
          </div>
          <div>
            <dt>Stato</dt>
            <dd>{queen.stato}</dd>
          </div>
          <div className="queen-card__full">
            <dt>Età</dt>
            <dd>{queen.eta}</dd>
          </div>
        </dl>
      )}

      <Button
        variant="secondary"
        size="lg"
        fullWidth
        className="queen-card__replace"
        onClick={onReplace}
      >
        <RefreshCw size={20} aria-hidden="true" />
        Sostituzione regina
      </Button>
    </motion.section>
  )
}
