import { motion } from 'framer-motion'
import type { HealthSummary } from '../types'
import { getSaluteLevel } from '../../../utils/salute'
import './HealthCard.css'

type HealthCardProps = {
  health: HealthSummary
}

const RING = 2 * Math.PI * 54

export function HealthCard({ health }: HealthCardProps) {
  const level = getSaluteLevel(health.value)
  const offset = RING - (health.value / 100) * RING

  return (
    <motion.section
      className="health-card meli-glass meli-glass--deep"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Stato salute"
    >
      <h2 className="arnia-section-title">🐝 Stato</h2>

      <div className="health-card__ring-wrap">
        <svg className="health-card__ring" viewBox="0 0 120 120" aria-hidden="true">
          <circle className="health-card__ring-bg" cx="60" cy="60" r="54" />
          <motion.circle
            className={`health-card__ring-fill health-card__ring-fill--${level}`}
            cx="60"
            cy="60"
            r="54"
            strokeDasharray={RING}
            initial={{ strokeDashoffset: RING }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <div className="health-card__value-wrap">
          <span className={`health-card__value health-card__value--${level}`}>
            {health.value}
          </span>
          <span className="health-card__unit">/ 100</span>
        </div>
      </div>

      {health.scoreRows && health.scoreRows.length > 0 && (
        <table className="health-card__table">
          <caption className="health-card__table-caption">Parametri salute</caption>
          <tbody>
            {health.scoreRows.map((row) => (
              <tr
                key={row.label}
                className={row.active ? 'health-card__row--active' : 'health-card__row--inactive'}
              >
                <th scope="row">{row.label}</th>
                <td>{row.active ? `+${row.weight}` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p className="health-card__update">
        Ultimo aggiornamento: <strong>{health.lastUpdateLabel}</strong>
      </p>
    </motion.section>
  )
}
