import { motion } from 'framer-motion'
import './ArniaDetailVisitCta.css'

type ArniaDetailVisitCtaProps = {
  hasDraft?: boolean
  onStartNew: () => void
  onResume?: () => void
}

export function ArniaDetailVisitCta({
  hasDraft = false,
  onStartNew,
  onResume,
}: ArniaDetailVisitCtaProps) {
  if (hasDraft && onResume) {
    return (
      <div className="arnia-detail-visit-cta-group">
        <motion.button
          type="button"
          className="arnia-detail-visit-cta arnia-detail-visit-cta--resume"
          onClick={onResume}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
          whileTap={{ scale: 0.985 }}
          aria-label="Riprendi visita in corso"
        >
          <span className="arnia-detail-visit-cta__shine" aria-hidden="true" />
          <span className="arnia-detail-visit-cta__icon" aria-hidden="true">
            ↺
          </span>
          RIPRENDI VISITA
        </motion.button>

        <button
          type="button"
          className="arnia-detail-visit-cta__secondary"
          onClick={onStartNew}
        >
          Inizia nuova visita
        </button>
      </div>
    )
  }

  return (
    <motion.button
      type="button"
      className="arnia-detail-visit-cta"
      onClick={onStartNew}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
      whileTap={{ scale: 0.985 }}
      aria-label="Inizia visita"
    >
      <span className="arnia-detail-visit-cta__shine" aria-hidden="true" />
      <span className="arnia-detail-visit-cta__icon" aria-hidden="true">
        ▶
      </span>
      INIZIA VISITA
    </motion.button>
  )
}
