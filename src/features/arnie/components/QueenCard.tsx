import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppPath } from '../../../demo/useAppPath'
import { formatReginaColoreDisplay } from '../utils/arniaFormatters'
import type { QueenSummary } from '../types'
import './QueenCard.css'

type QueenCardProps = {
  queen: QueenSummary
}

export function QueenCard({ queen }: QueenCardProps) {
  const appPath = useAppPath()

  return (
    <motion.section
      className="queen-card meli-glass meli-glass--deep"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Regina"
    >
      <header className="queen-card__header">
        <h2 className="arnia-section-title">👑 Regina</h2>
      </header>

      {!queen.present || !queen.id ? (
        <p className="queen-card__empty">Nessuna regina registrata</p>
      ) : (
        <>
          <dl className="queen-card__grid">
            <div>
              <dt>Numero</dt>
              <dd>{queen.numero ?? '—'}</dd>
            </div>
            <div>
              <dt>Colore</dt>
              <dd>{formatReginaColoreDisplay(queen.colore) ?? '—'}</dd>
            </div>
            <div>
              <dt>Anno</dt>
              <dd>{queen.anno ?? '—'}</dd>
            </div>
            <div>
              <dt>Razza</dt>
              <dd>{queen.razza ?? '—'}</dd>
            </div>
            <div className="queen-card__full">
              <dt>Stato</dt>
              <dd>{queen.stato}</dd>
            </div>
          </dl>

          <Link to={appPath(`/regine/${queen.id}`)} className="queen-card__link">
            Apri scheda regina
            <ChevronRight size={18} aria-hidden="true" />
          </Link>
        </>
      )}
    </motion.section>
  )
}
