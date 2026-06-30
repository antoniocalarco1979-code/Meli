import { motion } from 'framer-motion'
import './HomeIniziaGiroButton.css'

type HomeIniziaGiroButtonProps = {
  onClick: () => void
  disabled?: boolean
}

export function HomeIniziaGiroButton({ onClick, disabled = false }: HomeIniziaGiroButtonProps) {
  return (
    <motion.button
      type="button"
      className="home-giro-btn"
      onClick={onClick}
      disabled={disabled}
      aria-label="Inizia giro apiario"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: disabled ? 1 : 1.015 }}
      whileTap={{ scale: disabled ? 1 : 0.985 }}
    >
      <span className="home-giro-btn__shine" aria-hidden="true" />
      <span className="home-giro-btn__play" aria-hidden="true">
        ▶
      </span>
      <span className="home-giro-btn__label">INIZIA GIRO</span>
    </motion.button>
  )
}
