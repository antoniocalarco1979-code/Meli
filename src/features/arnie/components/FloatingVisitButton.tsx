import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import './FloatingVisitButton.css'

type FloatingVisitButtonProps = {
  onClick: () => void
}

export function FloatingVisitButton({ onClick }: FloatingVisitButtonProps) {
  return (
    <motion.button
      type="button"
      className="floating-visit-btn"
      onClick={onClick}
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.03, boxShadow: 'var(--meli-shadow-button)' }}
      whileTap={{ scale: 0.97 }}
      aria-label="Nuova visita"
    >
      <Plus size={28} strokeWidth={2.75} aria-hidden="true" />
      <span>Nuova visita</span>
    </motion.button>
  )
}
