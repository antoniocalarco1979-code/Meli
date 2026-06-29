import { motion } from 'framer-motion'
import { ChevronDown, MapPin } from '../../../theme/icons'
import './DashboardHeader.css'

type DashboardHeaderProps = {
  selectedApiary?: string
  onSelectApiario?: () => void
  onApiaryOpen?: () => void
}

export function DashboardHeader({
  selectedApiary,
  onSelectApiario,
  onApiaryOpen,
}: DashboardHeaderProps) {
  const handleClick = onSelectApiario ?? onApiaryOpen
  const label = selectedApiary ?? 'Seleziona apiario'

  return (
    <motion.header
      className="dashboard-header"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.button
        type="button"
        className="dashboard-header__selector"
        whileHover={{ y: -2, boxShadow: 'var(--meli-shadow-lg)' }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        onClick={handleClick}
        disabled={!handleClick}
      >
        <MapPin size={22} strokeWidth={1.75} aria-hidden="true" />
        <span className="dashboard-header__select">{label}</span>
        <ChevronDown size={20} className="dashboard-header__chevron" aria-hidden="true" />
      </motion.button>
    </motion.header>
  )
}
