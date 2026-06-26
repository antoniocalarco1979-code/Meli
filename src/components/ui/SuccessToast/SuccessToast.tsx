import { AnimatePresence, motion } from 'framer-motion'
import './SuccessToast.css'

type SuccessToastProps = {
  message: string
  visible: boolean
}

export function SuccessToast({ message, visible }: SuccessToastProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="ui-success-toast"
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, scale: 0.9, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: -10 }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="ui-success-toast__card meli-glass meli-glass--deep">
            <p className="ui-success-toast__message">{message}</p>
            <span className="ui-success-toast__icon" aria-hidden="true">
              ✔
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
