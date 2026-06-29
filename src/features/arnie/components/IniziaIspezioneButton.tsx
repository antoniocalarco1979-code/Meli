import { motion } from 'framer-motion'
import './IniziaIspezioneButton.css'

type IniziaIspezioneButtonProps = {
  onClick: () => void
}

export function IniziaIspezioneButton({ onClick }: IniziaIspezioneButtonProps) {
  return (
    <motion.button
      type="button"
      className="inizia-ispezione-btn"
      onClick={onClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.12 }}
      whileTap={{ scale: 0.98 }}
      aria-label="Inizia ispezione"
    >
      <span className="inizia-ispezione-btn__icon" aria-hidden="true">
        ▶
      </span>
      INIZIA ISPEZIONE
    </motion.button>
  )
}
