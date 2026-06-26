import { motion } from 'framer-motion'
import {
  AlertTriangle,
  CalendarClock,
  Crown,
  Droplets,
  Hexagon,
  MapPin,
} from 'lucide-react'
import type { KpiItem } from '../types'
import { KpiSparkline } from './KpiSparkline'
import './KpiGrid.css'

type KpiGridProps = {
  items: KpiItem[]
  onApiariClick?: () => void
  onArnieClick?: () => void
}

const iconMap = {
  apiari: MapPin,
  hives: Hexagon,
  visit: CalendarClock,
  production: Droplets,
  queen: Crown,
  treatment: AlertTriangle,
} as const

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.14 },
  },
}

const item = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export function KpiGrid({ items, onApiariClick, onArnieClick }: KpiGridProps) {
  return (
    <motion.div className="kpi-grid" variants={container} initial="hidden" animate="show">
      {items.map((kpi, index) => {
        const Icon = iconMap[kpi.icon]
        const onClick =
          kpi.icon === 'apiari' ? onApiariClick : kpi.icon === 'hives' ? onArnieClick : undefined

        return (
          <motion.article
            key={kpi.id}
            className="kpi-grid__card meli-glass"
            variants={item}
            whileHover={{
              y: -5,
              boxShadow: 'var(--meli-shadow-lg)',
              transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
            }}
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
            <div className="kpi-grid__top">
              <div className="kpi-grid__icon" aria-hidden="true">
                <Icon size={26} strokeWidth={1.65} />
              </div>
              <KpiSparkline index={index} />
            </div>
            <div className="kpi-grid__content">
              <p className="meli-label">{kpi.label}</p>
              <p className="kpi-grid__value">{kpi.value}</p>
            </div>
          </motion.article>
        )
      })}
    </motion.div>
  )
}
