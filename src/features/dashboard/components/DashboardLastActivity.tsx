import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import type { TodayActivity } from '../types'
import './DashboardLastActivity.css'

type DashboardLastActivityProps = {
  ultimaVisitaLabel: string
  activities: TodayActivity[]
  loading?: boolean
  onActivityClick?: (activity: TodayActivity) => void
}

export function DashboardLastActivity({
  ultimaVisitaLabel,
  activities,
  loading = false,
  onActivityClick,
}: DashboardLastActivityProps) {
  return (
    <motion.section
      className="dashboard-activity meli-glass meli-glass--deep"
      aria-label="Ultima attività"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <header className="dashboard-activity__header">
        <span className="dashboard-activity__icon-wrap" aria-hidden="true">
          <Clock size={20} strokeWidth={1.75} />
        </span>
        <div>
          <h2 className="dashboard-activity__title">Ultima attività</h2>
          <p className="dashboard-activity__meta">
            Ultima visita registrata:{' '}
            <strong>{loading ? '—' : ultimaVisitaLabel}</strong>
          </p>
        </div>
      </header>

      <ul className="dashboard-activity__list">
        {activities.map((activity, index) => (
          <li key={activity.id}>
            <button
              type="button"
              className="dashboard-activity__item"
              onClick={() => onActivityClick?.(activity)}
            >
              <span className="dashboard-activity__time">{activity.time}</span>
              <span className="dashboard-activity__text">{activity.title}</span>
              {index === 0 && <span className="dashboard-activity__pill">Recente</span>}
            </button>
          </li>
        ))}
      </ul>
    </motion.section>
  )
}
