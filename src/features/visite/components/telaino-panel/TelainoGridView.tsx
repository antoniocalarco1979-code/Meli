import { motion } from 'framer-motion'
import type { TelainoVisitaRecord } from '../../types/telainoPanel.types'
import { isTelainoVisitaComplete, isTelainoVisitaTouched } from '../../types/telainoPanel.types'

export type TelainoGridLayout = 'grid' | 'nido-2d'

type TelainoGridViewProps = {
  telaini: TelainoVisitaRecord[]
  selectedTelainoId: string | null
  onTelainoClick: (telaino: TelainoVisitaRecord) => void
  layout?: TelainoGridLayout
}

export function TelainoGridView({
  telaini,
  selectedTelainoId,
  onTelainoClick,
  layout = 'grid',
}: TelainoGridViewProps) {
  return (
    <div
      className={`telaino-grid${layout === 'nido-2d' ? ' telaino-grid--nido-2d' : ''}`}
      role="list"
      aria-label="Telaini del nido"
    >
      {telaini.map((telaino) => {
        const selected = selectedTelainoId === telaino.id
        const touched = isTelainoVisitaTouched(telaino)
        const complete = isTelainoVisitaComplete(telaino)

        return (
          <motion.button
            key={telaino.id}
            type="button"
            role="listitem"
            className={`telaino-grid__item${selected ? ' telaino-grid__item--selected' : ''}${complete ? ' telaino-grid__item--complete' : touched ? ' telaino-grid__item--touched' : ''}`}
            aria-pressed={selected}
            aria-label={`Telaino ${telaino.numero}${complete ? ', completato' : touched ? ', in compilazione' : ''}`}
            onClick={() => onTelainoClick(telaino)}
            animate={{ y: selected ? -10 : 0, scale: selected ? 1.05 : 1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
          >
            <span className="telaino-grid__frame" aria-hidden="true">
              <span className="telaino-grid__cells" />
              <span className="telaino-grid__cells telaino-grid__cells--offset" />
              <span className="telaino-grid__cells" />
            </span>
            <span className="telaino-grid__number">{telaino.numero}</span>
            {complete && <span className="telaino-grid__badge" aria-hidden="true">✓</span>}
          </motion.button>
        )
      })}
    </div>
  )
}
