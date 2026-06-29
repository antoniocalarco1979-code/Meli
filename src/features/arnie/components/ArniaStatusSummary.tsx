import { motion } from 'framer-motion'
import type { UltimaVisitaSummary } from '../types'
import './ArniaStatusSummary.css'

type ArniaStatusSummaryProps = {
  visit: UltimaVisitaSummary
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

export function ArniaStatusSummary({ visit }: ArniaStatusSummaryProps) {
  return (
    <motion.section
      className="arnia-status-summary meli-glass meli-glass--deep"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.04 }}
      aria-label="Indicatori ultima visita"
    >
      <header className="arnia-status-summary__header">
        <h2 className="arnia-status-summary__title">Indicatori campo</h2>
      </header>

      <dl className="arnia-status-summary__grid">
        {STATUS_ROWS.map(({ label, valueKey }) => (
          <div key={label} className="arnia-status-summary__cell">
            <dt className="arnia-status-summary__label">{label}</dt>
            <dd className="arnia-status-summary__value">{resolveValue(visit, valueKey)}</dd>
          </div>
        ))}
      </dl>
    </motion.section>
  )
}
