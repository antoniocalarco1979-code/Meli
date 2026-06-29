import { AnimatePresence, motion } from 'framer-motion'
import { useToastStore } from '../../../stores/toastStore'
import './Toast.css'

const ICONS = {
  success: '✔',
  error: '!',
  info: 'i',
} as const

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts)
  const dismiss = useToastStore((state) => state.dismiss)

  return (
    <div className="ui-toast-stack" aria-live="polite">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            className={`ui-toast-stack__item meli-glass meli-glass--deep ui-toast-stack__item--${toast.variant}`}
            role="status"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => dismiss(toast.id)}
          >
            <span
              className={`ui-toast-stack__icon ui-toast-stack__icon--${toast.variant}`}
              aria-hidden="true"
            >
              {ICONS[toast.variant]}
            </span>
            <p className="ui-toast-stack__message">{toast.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
