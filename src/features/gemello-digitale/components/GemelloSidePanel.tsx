import type { CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type {
  MelarioGemelloModel,
  TelainoGemelloModel,
} from '../types/gemelloDigitale.types'
import { TELAINO_GEMELLO_PANEL_FIELDS } from '../types/gemelloDigitale.types'

type GemelloSidePanelProps = {
  open: boolean
  target: 'telaino' | 'melario' | null
  telaino: TelainoGemelloModel | null
  melario: MelarioGemelloModel | null
  onClose: () => void
}

function SimulatedField({
  emoji,
  label,
  value,
}: {
  emoji: string
  label: string
  value: string
}) {
  return (
    <div className="gemello-side-panel__field">
      <p className="gemello-side-panel__field-label">
        <span aria-hidden="true">{emoji}</span> {label}
      </p>
      <div className="gemello-side-panel__value">{value}</div>
    </div>
  )
}

export function GemelloSidePanel({
  open,
  target,
  telaino,
  melario,
  onClose,
}: GemelloSidePanelProps) {
  const title =
    target === 'telaino' && telaino
      ? `Telaino ${telaino.numero}`
      : melario?.label ?? 'Dettaglio'

  return (
    <AnimatePresence>
      {open && target && (
        <>
          <motion.button
            type="button"
            className="gemello-side-panel__backdrop"
            aria-label="Chiudi pannello"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.aside
            className="gemello-side-panel meli-glass meli-glass--deep"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
          >
            <header className="gemello-side-panel__header">
              <div>
                <p className="gemello-side-panel__kicker">
                  {target === 'telaino' ? 'Telaino' : 'Melario'}
                </p>
                <h2 className="gemello-side-panel__title">{title}</h2>
              </div>
              <button
                type="button"
                className="gemello-side-panel__close"
                onClick={onClose}
                aria-label="Chiudi"
              >
                <X size={22} />
              </button>
            </header>

            <div className="gemello-side-panel__body">
              {target === 'telaino' && telaino ? (
                <>
                  <p className="gemello-side-panel__intro">
                    Dati simulati · struttura pronta per cronologia, colori dinamici, foto e
                    timeline.
                  </p>

                  {TELAINO_GEMELLO_PANEL_FIELDS.map((field) => {
                    if (field.snapshotKey === 'photos') {
                      return (
                        <SimulatedField
                          key={field.key}
                          emoji={field.emoji}
                          label={field.label}
                          value={
                            telaino.photos.length > 0
                              ? `${telaino.photos.length} foto`
                              : 'Nessuna foto (slot pronto)'
                          }
                        />
                      )
                    }

                    return (
                      <SimulatedField
                        key={field.key}
                        emoji={field.emoji}
                        label={field.label}
                        value={telaino.current[field.snapshotKey]}
                      />
                    )
                  })}

                  {telaino.history.length > 0 && (
                    <div className="gemello-side-panel__history">
                      <p className="gemello-side-panel__field-label">Cronologia simulata</p>
                      <ul className="gemello-side-panel__history-list">
                        {telaino.history.map((entry) => (
                          <li key={entry.id}>
                            <span className="gemello-side-panel__history-label">{entry.label}</span>
                            <time className="gemello-side-panel__history-time">
                              {new Date(entry.at).toLocaleDateString('it-IT')}
                            </time>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {telaino.timeline.length > 0 && (
                    <div className="gemello-side-panel__timeline">
                      <p className="gemello-side-panel__field-label">Timeline (simulata)</p>
                      <ul className="gemello-side-panel__timeline-list">
                        {telaino.timeline.map((event) => (
                          <li key={event.id}>{event.label}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : melario ? (
                <>
                  <p className="gemello-side-panel__intro">
                    <strong>{melario.label}</strong> sollevato nella vista arnia. In futuro: contenuto
                    melario, peso stimato e raccolta.
                  </p>
                  <div
                    className="gemello-side-panel__corpo-preview"
                    style={
                      melario.visual.accentColor
                        ? ({ borderColor: melario.visual.accentColor } as CSSProperties)
                        : undefined
                    }
                  >
                    <span className="gemello-side-panel__corpo-icon">🍯</span>
                  </div>
                </>
              ) : null}
            </div>

            <footer className="gemello-side-panel__footer">
              <span className="gemello-side-panel__future-tag">v1 · dati simulati</span>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
