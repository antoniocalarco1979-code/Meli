import { motion } from 'framer-motion'
import { ChevronDown, MapPin } from 'lucide-react'
import './DashboardHeader.css'

type DashboardHeaderProps = {
  userName: string
  subtitle: string
  selectedApiary: string
  apiaries: string[]
  onApiaryOpen?: () => void
}

export function DashboardHeader({
  userName,
  subtitle,
  selectedApiary,
  onApiaryOpen,
}: DashboardHeaderProps) {
  return (
    <motion.header
      className="dashboard-header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="dashboard-header__text">
        <h1 className="dashboard-header__title">Buongiorno {userName}</h1>
        <p className="dashboard-header__subtitle">{subtitle}</p>
      </div>

      <motion.button
        type="button"
        className="dashboard-header__selector meli-glass"
        whileHover={{ y: -2, boxShadow: 'var(--meli-shadow-lg)' }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        onClick={onApiaryOpen}
      >
        <MapPin size={22} strokeWidth={1.75} aria-hidden="true" />
        <span className="dashboard-header__selector-label">Apiario</span>
        <span className="dashboard-header__select">{selectedApiary}</span>
        <ChevronDown size={20} className="dashboard-header__chevron" aria-hidden="true" />
      </motion.button>
    </motion.header>
  )
}
