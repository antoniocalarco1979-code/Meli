import { motion } from 'framer-motion'
import './NuovaVisitaButton.css'

type NuovaVisitaButtonProps = {
  onClick: () => void
}

export function NuovaVisitaButton({ onClick }: NuovaVisitaButtonProps) {
  return (
    <motion.button
      type="button"
      className="nuova-visita-btn"
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.01, boxShadow: 'var(--meli-shadow-button)' }}
      whileTap={{ scale: 0.98 }}
      aria-label="Nuova visita"
    >
      ➕ NUOVA VISITA
    </motion.button>
  )
}
