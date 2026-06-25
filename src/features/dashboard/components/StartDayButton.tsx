import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import './StartDayButton.css'

export function StartDayButton() {
  return (
    <motion.div
      className="start-day"
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.55, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.button
        type="button"
        className="start-day__btn"
        whileHover={{
          scale: 1.02,
          boxShadow: 'var(--meli-shadow-button)',
          transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
        }}
        whileTap={{ scale: 0.975 }}
      >
        <span className="start-day__shine" aria-hidden="true" />
        <span className="start-day__glow" aria-hidden="true" />
        <Play size={28} fill="currentColor" strokeWidth={0} aria-hidden="true" />
        <span className="start-day__text">INIZIA GIORNATA</span>
      </motion.button>
    </motion.div>
  )
}
