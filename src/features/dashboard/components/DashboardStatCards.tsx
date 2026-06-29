import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { CalendarClock, Hexagon, MapPin } from 'lucide-react'
import './DashboardStatCards.css'

type StatCardProps = {
  label: string
  value: string
  icon: ReactNode
  onClick?: () => void
  accent?: 'honey' | 'green' | 'amber'
}

function StatCard({ label, value, icon, onClick, accent = 'honey' }: StatCardProps) {
  return (
    <motion.article
      className={`dashboard-stat dashboard-stat--${accent} meli-glass${onClick ? ' dashboard-stat--clickable' : ''}`}
      whileHover={onClick ? { y: -4, transition: { duration: 0.25 } } : undefined}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
    >
      <div className="dashboard-stat__icon" aria-hidden="true">
        {icon}
      </div>
      <p className="dashboard-stat__value">{value}</p>
      <p className="dashboard-stat__label">{label}</p>
    </motion.article>
  )
}

type DashboardStatCardsProps = {
  apiariCount: number
  arnieCount: number
  visitePending: number
  loading?: boolean
  onApiariClick?: () => void
  onArnieClick?: () => void
  onVisiteClick?: () => void
}

export function DashboardStatCards({
  apiariCount,
  arnieCount,
  visitePending,
  loading = false,
  onApiariClick,
  onArnieClick,
  onVisiteClick,
}: DashboardStatCardsProps) {
  const dash = loading ? '—' : undefined

  return (
    <div className="dashboard-stat-grid" aria-label="Indicatori principali">
      <StatCard
        label="Apiari"
        value={dash ?? String(apiariCount)}
        icon={<MapPin size={22} strokeWidth={1.75} />}
        onClick={onApiariClick}
      />
      <StatCard
        label="Arnie"
        value={dash ?? String(arnieCount)}
        icon={<Hexagon size={22} strokeWidth={1.75} />}
        onClick={onArnieClick}
        accent="amber"
      />
      <StatCard
        label="Visite da effettuare"
        value={dash ?? String(visitePending)}
        icon={<CalendarClock size={22} strokeWidth={1.75} />}
        onClick={onVisiteClick}
        accent="green"
      />
    </div>
  )
}
