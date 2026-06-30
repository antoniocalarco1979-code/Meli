import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, CalendarClock, Droplets, TrendingUp } from 'lucide-react'
import type { ApiarioStatistiche } from '../services/apiarioDetailService'
import './ApiarioStatisticheSection.css'

type ApiarioStatisticheSectionProps = {
  statistiche: ApiarioStatistiche
}

function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: ReactNode
  label: string
  value: string
  hint?: string
}) {
  return (
    <article className="apiario-stats__card meli-glass meli-glass--deep">
      <span className="apiario-stats__icon" aria-hidden="true">
        {icon}
      </span>
      <p className="apiario-stats__value">{value}</p>
      <p className="apiario-stats__label">{label}</p>
      {hint && <p className="apiario-stats__hint">{hint}</p>}
    </article>
  )
}

export function ApiarioStatisticheSection({ statistiche }: ApiarioStatisticheSectionProps) {
  return (
    <motion.section
      className="apiario-stats"
      aria-labelledby="apiario-stats-title"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <header className="apiario-stats__header">
        <h2 id="apiario-stats-title" className="apiario-stats__title">
          Statistiche
        </h2>
        <p className="apiario-stats__subtitle">
          Panoramica attività e produzione dell&apos;apiario.
        </p>
      </header>

      <div className="apiario-stats__grid">
        <StatCard
          icon={<BarChart3 size={24} strokeWidth={1.75} />}
          label="Numero visite"
          value={String(statistiche.numeroVisite)}
        />
        <StatCard
          icon={<CalendarClock size={24} strokeWidth={1.75} />}
          label="Ultima visita"
          value={statistiche.ultimaVisitaLabel}
        />
        <StatCard
          icon={<TrendingUp size={24} strokeWidth={1.75} />}
          label="Media visite per arnia"
          value={String(statistiche.mediaVisite)}
          hint="Totale visite ÷ numero arnie"
        />
        <StatCard
          icon={<Droplets size={24} strokeWidth={1.75} />}
          label="Produzione totale"
          value={statistiche.produzioneTotaleLabel}
          hint="Placeholder — modulo produzione in arrivo"
        />
      </div>
    </motion.section>
  )
}
