import { motion } from 'framer-motion'
import { Hexagon, Map } from 'lucide-react'
import type { HiveMarker } from '../types'
import './ApiaryMap.css'

type ApiaryMapProps = {
  apiaryName: string
  markers: HiveMarker[]
  onHiveClick?: (numero: string) => void
  onMapClick?: () => void
}

const statusClass = {
  healthy: 'apiary-map__hive--healthy',
  warning: 'apiary-map__hive--warning',
  critical: 'apiary-map__hive--critical',
  inactive: 'apiary-map__hive--inactive',
} as const

export function ApiaryMap({ apiaryName, markers, onHiveClick, onMapClick }: ApiaryMapProps) {
  return (
    <motion.section
      className="apiary-map meli-glass meli-glass--deep"
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{
        y: -4,
        boxShadow: 'var(--meli-shadow-lg)',
        transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
      }}
      aria-label={`Mappa ${apiaryName}`}
      onClick={onMapClick}
      role={onMapClick ? 'button' : undefined}
      tabIndex={onMapClick ? 0 : undefined}
      onKeyDown={
        onMapClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onMapClick()
              }
            }
          : undefined
      }
    >
      <header className="apiary-map__header">
        <Map size={24} strokeWidth={1.65} aria-hidden="true" />
        <h2 className="apiary-map__title">Mappa Apiario</h2>
        <span className="apiary-map__name">{apiaryName}</span>
      </header>

      <div className="apiary-map__frame">
        <div className="apiary-map__terrain">
          {markers.map((marker, index) => (
            <motion.button
              key={marker.id}
              type="button"
              className={`apiary-map__hive ${statusClass[marker.status]}`}
              style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
              title={`Arnia ${marker.label}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.4 + index * 0.035,
                type: 'spring',
                stiffness: 320,
                damping: 22,
              }}
              whileHover={{ scale: 1.2, transition: { duration: 0.2 } }}
              onClick={(e) => {
                e.stopPropagation()
                onHiveClick?.(marker.label)
              }}
            >
              <Hexagon size={18} fill="currentColor" strokeWidth={0} aria-hidden="true" />
              <span className="apiary-map__hive-label">{marker.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <footer className="apiary-map__legend">
        <span><i className="apiary-map__dot apiary-map__dot--healthy" /> OK</span>
        <span><i className="apiary-map__dot apiary-map__dot--warning" /> Attenzione</span>
        <span><i className="apiary-map__dot apiary-map__dot--critical" /> Critico</span>
        <span><i className="apiary-map__dot apiary-map__dot--inactive" /> Inattiva</span>
      </footer>
    </motion.section>
  )
}
