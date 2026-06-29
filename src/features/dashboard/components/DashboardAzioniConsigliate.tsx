import { motion } from 'framer-motion'
import { ClipboardList } from 'lucide-react'
import { AzioniConsigliateList } from '../../azioni'
import type { AzioneConsigliataConArnia } from '../../azioni'
import './DashboardAzioniConsigliate.css'

type DashboardAzioniConsigliateProps = {
  azioni: AzioneConsigliataConArnia[]
  loading?: boolean
  onArniaClick?: (arniaId: string) => void
}

export function DashboardAzioniConsigliate({
  azioni,
  loading = false,
  onArniaClick,
}: DashboardAzioniConsigliateProps) {
  return (
    <motion.section
      className="dashboard-azioni meli-glass meli-glass--deep"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Azioni consigliate"
    >
      <header className="dashboard-azioni__header">
        <ClipboardList size={24} strokeWidth={1.65} aria-hidden="true" />
        <h2 className="dashboard-azioni__title">Azioni consigliate</h2>
        {!loading && <span className="dashboard-azioni__badge">{azioni.length}</span>}
      </header>

      {loading ? (
        <p className="dashboard-azioni__loading">Caricamento azioni…</p>
      ) : (
        <AzioniConsigliateList azioni={azioni} showArnia onArniaClick={onArniaClick} />
      )}
    </motion.section>
  )
}
