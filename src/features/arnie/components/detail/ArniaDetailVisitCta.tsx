import { motion } from 'framer-motion'
import './ArniaDetailVisitCta.css'

type ArniaDetailVisitCtaProps = {
  onClick: () => void
}

export function ArniaDetailVisitCta({ onClick }: ArniaDetailVisitCtaProps) {
  return (
    <motion.button
      type="button"
      className="arnia-detail-visit-cta"
      onClick={onClick}
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
