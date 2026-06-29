import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import {
  TELAINO_API_OPTIONS,
  TELAINO_CELLE_REALI_OPTIONS,
  TELAINO_COVATA_OPTIONS,
  TELAINO_POLLINE_OPTIONS,
  TELAINO_PROBLEMI_OPTIONS,
  TELAINO_REGINA_OPTIONS,
  TELAINO_SCORTE_OPTIONS,
} from '../../types/ispezioneWizard.types'
import { VisitChoiceGrid } from '../visit-engine/VisitChoiceGrid'
import type { TelainoDesignData } from './types'

type TelainoPanelProps = {
  open: boolean
  telaino: TelainoDesignData | null
  onClose: () => void
  onChange: (patch: Partial<TelainoDesignData>) => void
  onSave: () => void
}

function PanelField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="telaino-panel__field">
      <p className="telaino-panel__label">{label}</p>
      {children}
    </div>
  )
}

export function TelainoPanel({ open, telaino, onClose, onChange, onSave }: TelainoPanelProps) {
  return (
    <AnimatePresence>
      {open && telaino && (
        <>
          <motion.button
            type="button"
            className="telaino-panel__backdrop"
            aria-label="Chiudi pannello telaino"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.aside
            className="telaino-panel"
            role="dialog"
            aria-modal="true"
            aria-label={`Compilazione telaino ${telaino.numero}`}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          >
            <header className="telaino-panel__header">
              <div>
                <p className="telaino-panel__kicker">Telaino</p>
                <h2 className="telaino-panel__title">#{telaino.numero}</h2>
              </div>
              <button type="button" className="telaino-panel__close" onClick={onClose} aria-label="Chiudi">
                <X size={22} />
              </button>
            </header>

            <div className="telaino-panel__body">
              <PanelField label="Covata">
                <VisitChoiceGrid
                  variant="radio"
                  columns={false}
                  options={TELAINO_COVATA_OPTIONS}
                  value={telaino.covata}
                  onSelect={(value) => onChange({ covata: value })}
                />
              </PanelField>

              <PanelField label="Polline">
                <VisitChoiceGrid
                  variant="radio"
                  columns={false}
                  options={TELAINO_POLLINE_OPTIONS}
                  value={telaino.polline}
                  onSelect={(value) => onChange({ polline: value })}
                />
              </PanelField>

              <PanelField label="Scorte miele">
                <VisitChoiceGrid
                  variant="radio"
                  columns={false}
                  options={TELAINO_SCORTE_OPTIONS}
                  value={telaino.scorteMiele}
                  onSelect={(value) => onChange({ scorteMiele: value })}
                />
              </PanelField>

              <PanelField label="Regina vista">
                <VisitChoiceGrid
                  variant="status"
                  columns={false}
                  options={TELAINO_REGINA_OPTIONS.map((o) => ({
                    ...o,
                    icon: o.value === 'si' ? '🟢' : '🔴',
                  }))}
                  value={telaino.reginaVista}
                  onSelect={(value) => onChange({ reginaVista: value })}
                />
              </PanelField>

              <PanelField label="Celle reali">
                <VisitChoiceGrid
                  variant="radio"
                  columns={false}
                  options={TELAINO_CELLE_REALI_OPTIONS}
                  value={telaino.celleReali}
                  onSelect={(value) => onChange({ celleReali: value })}
                />
              </PanelField>

              <PanelField label="Api presenti">
                <VisitChoiceGrid
                  variant="radio"
                  columns={false}
                  options={TELAINO_API_OPTIONS}
                  value={telaino.apiPresenti}
                  onSelect={(value) => onChange({ apiPresenti: value })}
                />
              </PanelField>

              <PanelField label="Problemi">
                <VisitChoiceGrid
                  variant="radio"
                  columns={false}
                  options={TELAINO_PROBLEMI_OPTIONS}
                  value={telaino.problemi}
                  onSelect={(value) => onChange({ problemi: value })}
                />
              </PanelField>

              <PanelField label="Note">
                <textarea
                  className="telaino-panel__note"
                  rows={3}
                  placeholder="Note sul telaino…"
                  value={telaino.note}
                  onChange={(e) => onChange({ note: e.target.value })}
                />
              </PanelField>
            </div>

            <footer className="telaino-panel__footer">
              <button type="button" className="telaino-panel__save" onClick={onSave}>
                Salva telaino
              </button>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
