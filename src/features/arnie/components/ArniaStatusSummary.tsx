import { useState } from 'react'
import { motion } from 'framer-motion'
import type { UltimaVisitaSummary } from '../types'
import './ArniaStatusSummary.css'

type ArniaStatusSummaryProps = {
  visit: UltimaVisitaSummary
  onCellClick?: (label: string, value: string) => void
}

const STATUS_ROWS: {
  label: string
  valueKey: keyof Pick<
    UltimaVisitaSummary,
    'dataShort' | 'reginaLabel' | 'covataLabel' | 'scorteLabel' | 'melarioLabel'
  >
}[] = [
  { label: 'Ultima visita', valueKey: 'dataShort' },
  { label: 'Regina', valueKey: 'reginaLabel' },
  { label: 'Covata', valueKey: 'covataLabel' },
  { label: 'Scorte', valueKey: 'scorteLabel' },
  { label: 'Melario', valueKey: 'melarioLabel' },
]

function resolveValue(
  visit: UltimaVisitaSummary,
  valueKey: (typeof STATUS_ROWS)[number]['valueKey'],
): string {
  const raw = visit[valueKey]
  if (valueKey === 'dataShort') {
    if (raw) return raw
    if (visit.data) return visit.dataLabel
    return '—'
  }
  return raw && raw !== '—' ? raw : '—'
}

export function ArniaStatusSummary({ visit, onCellClick }: ArniaStatusSummaryProps) {
  const [activeLabel, setActiveLabel] = useState<string | null>(null)

  const handleClick = (label: string, value: string) => {
    setActiveLabel(label)
    onCellClick?.(label, value)
  }

  return (
    <motion.section
      className="arnia-status-summary meli-glass meli-glass--deep"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      aria-label="Indicatori ultima visita"
    >
      <header className="arnia-status-summary__header">
        <h2 className="arnia-status-summary__title">Indicatori campo</h2>
        <p className="arnia-status-summary__hint">Tocca un indicatore per i dettagli</p>
      </header>

      <dl className="arnia-status-summary__grid">
        {STATUS_ROWS.map(({ label, valueKey }) => {
          const value = resolveValue(visit, valueKey)
          const isActive = activeLabel === label

          return (
            <div key={label} className="arnia-status-summary__cell-wrap">
              <dt className="arnia-status-summary__label">{label}</dt>
              <dd className="arnia-status-summary__value">
                <button
                  type="button"
                  className={`arnia-status-summary__cell${isActive ? ' arnia-status-summary__cell--active' : ''}`}
                  aria-pressed={isActive}
                  onClick={() => handleClick(label, value)}
                >
                  {value}
                </button>
              </dd>
            </div>
          )
        })}
      </dl>
    </motion.section>
  )
}
