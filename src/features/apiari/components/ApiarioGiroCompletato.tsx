import { motion } from 'framer-motion'
import { Button } from '../../../components/ui/Button'
import { formatDuration } from '../../../utils/dateFormatters'
import type { GiroSessionStats } from '../../visite/types/giro.types'
import './ApiarioGiroCompletato.css'

type ApiarioGiroCompletatoProps = {
  stats: GiroSessionStats
  onExportReport: () => void
  onTornaPercorso: () => void
}

function StatRow({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="apiario-giro-completato__stat">
      <span className="apiario-giro-completato__stat-value">{value}</span>
      <span className="apiario-giro-completato__stat-label">{label}</span>
    </div>
  )
}

export function ApiarioGiroCompletato({
  stats,
  onExportReport,
  onTornaPercorso,
}: ApiarioGiroCompletatoProps) {
  const elapsedSeconds =
    stats.durataSecondi ??
    (stats.completedAt ? Math.max(0, Math.round((stats.completedAt - stats.startedAt) / 1000)) : 0)

  return (
    <motion.section
      className="apiario-giro-completato meli-glass meli-glass--deep"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      aria-labelledby="giro-completato-title"
    >
      <p className="apiario-giro-completato__emoji" aria-hidden="true">
        ✔
      </p>
      <h2 id="giro-completato-title" className="apiario-giro-completato__title">
        Giro completato
      </h2>

      <div className="apiario-giro-completato__stats">
        <StatRow value={stats.arnieVisitate} label="arnie visitate" />
        <StatRow value={formatDuration(elapsedSeconds)} label="tempo impiegato" />
        <StatRow value={stats.noteInserite} label="note inserite" />
        <StatRow value={stats.foto} label="foto scattate" />
      </div>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        className="apiario-giro-completato__export"
        onClick={onExportReport}
      >
        Esporta Report
      </Button>

      <button type="button" className="apiario-giro-completato__back" onClick={onTornaPercorso}>
        Torna al percorso
      </button>
    </motion.section>
  )
}
