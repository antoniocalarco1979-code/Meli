import { motion } from 'framer-motion'
import { ChevronDown, MapPin, Play } from 'lucide-react'
import './DashboardWelcome.css'

type DashboardWelcomeProps = {
  userName: string
  selectedApiarioName?: string
  loading?: boolean
  onSelectApiario?: () => void
  onStartGiro: () => void
}

export function DashboardWelcome({
  userName,
  selectedApiarioName,
  loading = false,
  onSelectApiario,
  onStartGiro,
}: DashboardWelcomeProps) {
  return (
    <motion.section
      className="dashboard-welcome meli-glass meli-glass--deep"
      aria-label="Benvenuto"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className="dashboard-welcome__eyebrow meli-label">Benvenuto</p>
      <h1 className="dashboard-welcome__title">Ciao, {userName}</h1>
      <p className="dashboard-welcome__subtitle">
        Ecco il riepilogo del tuo apiario. Tutto sotto controllo, in un colpo d&apos;occhio.
      </p>

      {onSelectApiario && (
        <button
          type="button"
          className="dashboard-welcome__apiario"
          onClick={onSelectApiario}
          disabled={loading}
        >
          <MapPin size={18} strokeWidth={1.75} aria-hidden="true" />
          <span>{selectedApiarioName ?? 'Seleziona apiario'}</span>
          <ChevronDown size={16} aria-hidden="true" />
        </button>
      )}

      <motion.button
        type="button"
        className="dashboard-welcome__cta"
        onClick={onStartGiro}
        disabled={loading}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        <Play size={18} fill="currentColor" strokeWidth={0} aria-hidden="true" />
        <span>Inizia giro apiario</span>
      </motion.button>
    </motion.section>
  )
}
