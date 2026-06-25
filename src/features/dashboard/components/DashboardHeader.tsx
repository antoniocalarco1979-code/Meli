import { motion } from 'framer-motion'
import { ChevronDown, MapPin } from 'lucide-react'
import './DashboardHeader.css'

type DashboardHeaderProps = {
  userName: string
  subtitle: string
  selectedApiary: string
  apiaries: string[]
}

export function DashboardHeader({
  userName,
  subtitle,
  selectedApiary,
  apiaries,
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

      <motion.div
        className="dashboard-header__selector meli-glass"
        whileHover={{ y: -2, boxShadow: 'var(--meli-shadow-lg)' }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        <MapPin size={22} strokeWidth={1.75} aria-hidden="true" />
        <label className="dashboard-header__selector-label" htmlFor="apiary-select">
          Apiario
        </label>
        <select
          id="apiary-select"
          className="dashboard-header__select"
          defaultValue={selectedApiary}
        >
          {apiaries.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <ChevronDown size={20} className="dashboard-header__chevron" aria-hidden="true" />
      </motion.div>
    </motion.header>
  )
}
