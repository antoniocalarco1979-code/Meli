import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Camera, Minus, Plus, X } from 'lucide-react'
import { cameraService } from '../../../../services/device'
import type { TelainoVisitaRecord } from '../../types/telainoPanel.types'
import {
  TELAINO_CELLE_REALI_OPTIONS,
  TELAINO_COVATA_OPTIONS,
  TELAINO_QUANTITA_OPTIONS,
  TELAINO_REGINA_OPTIONS,
  TELAINO_UOVA_OPTIONS,
  TELAINO_VARROA_OPTIONS,
  isTelainoVisitaComplete,
} from '../../types/telainoPanel.types'
import { TelainoLevelControl } from './TelainoLevelControl'

export type TelainoPanelProps = {
  open: boolean
  telaino: TelainoVisitaRecord | null
  onClose: () => void
  onSave: (record: TelainoVisitaRecord) => void
  /** Se true chiude il drawer dopo il salvataggio (default: false — gestito dal parent). */
  closeOnSave?: boolean
}

function cloneTelaino(record: TelainoVisitaRecord): TelainoVisitaRecord {
  return { ...record }
}

export function TelainoPanel({ open, telaino, onClose, onSave, closeOnSave = false }: TelainoPanelProps) {
  const [draft, setDraft] = useState<TelainoVisitaRecord | null>(null)

  useEffect(() => {
    if (open && telaino) {
      setDraft(cloneTelaino(telaino))
    }
  }, [open, telaino?.id, telaino])

  const working = draft ?? telaino
  const saved = telaino ? isTelainoVisitaComplete(telaino) : false

  const patch = (partial: Partial<TelainoVisitaRecord>) => {
    setDraft((prev) => {
      const base = prev ?? (telaino ? cloneTelaino(telaino) : null)
      return base ? { ...base, ...partial } : prev
    })
  }

  const handleCapturePhoto = async () => {
    const photo = await cameraService.capturePhoto({ preferRear: true })
    if (photo) patch({ foto: photo.path })
  }

  const handleSave = () => {
    if (!working) return
    const now = Date.now()
    onSave({ ...working, savedAt: now, updatedAt: now })
    if (closeOnSave) onClose()
  }

  const adjustNumber = (
    field: 'celleRealiNumero' | 'varroaNumero',
    delta: number,
  ) => {
    const current = working?.[field] ?? 0
    patch({ [field]: Math.max(0, current + delta) })
  }

  return (
    <AnimatePresence>
      {open && working && (
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
            className="telaino-panel telaino-panel--drawer meli-glass meli-glass--deep"
            role="dialog"
            aria-modal="true"
            aria-label={`Telaino ${working.numero}`}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
          >
            <header className="telaino-panel__header">
              <div>
                <p className="telaino-panel__kicker">Telaino</p>
                <h2 className="telaino-panel__title">#{working.numero}</h2>
              </div>
              <button type="button" className="telaino-panel__close" onClick={onClose} aria-label="Chiudi">
                <X size={22} />
              </button>
            </header>

            <div className="telaino-panel__body">
              <div className="telaino-panel__field">
                <p className="telaino-panel__label">Regina</p>
                <div className="telaino-panel__quick-row telaino-panel__quick-row--2" role="group">
                  {TELAINO_REGINA_OPTIONS.map((option) => {
                    const selected = working.regina === option.value
                    return (
                      <button
                        key={option.value}
                        type="button"
                        className={`telaino-panel__quick-btn telaino-panel__quick-btn--wide${selected ? ' telaino-panel__quick-btn--active' : ''}`}
                        aria-pressed={selected}
                        onClick={() => patch({ regina: option.value })}
                      >
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <TelainoLevelControl
                label="Uova"
                value={working.uova}
                options={TELAINO_UOVA_OPTIONS}
                onChange={(value) => patch({ uova: value })}
              />

              <TelainoLevelControl
                label="Covata aperta"
                value={working.covataAperta}
                options={TELAINO_COVATA_OPTIONS}
                onChange={(value) => patch({ covataAperta: value })}
              />

              <TelainoLevelControl
                label="Covata opercolata"
                value={working.covataOpercolata}
                options={TELAINO_COVATA_OPTIONS}
                onChange={(value) => patch({ covataOpercolata: value })}
              />

              <TelainoLevelControl
                label="Miele"
                value={working.miele}
                options={TELAINO_QUANTITA_OPTIONS}
                onChange={(value) => patch({ miele: value })}
              />

              <TelainoLevelControl
                label="Polline"
                value={working.polline}
                options={TELAINO_QUANTITA_OPTIONS}
                onChange={(value) => patch({ polline: value })}
              />

              <div className="telaino-panel__field">
                <p className="telaino-panel__label">Celle reali</p>
                <div className="telaino-panel__quick-row telaino-panel__quick-row--3" role="group">
                  {TELAINO_CELLE_REALI_OPTIONS.map((option) => {
                    const selected = working.celleReali === option.value
                    return (
                      <button
                        key={option.value}
                        type="button"
                        className={`telaino-panel__quick-btn telaino-panel__quick-btn--wide${selected ? ' telaino-panel__quick-btn--active' : ''}`}
                        aria-pressed={selected}
                        onClick={() =>
                          patch({
                            celleReali: option.value,
                            celleRealiNumero: option.value === 'numero' ? working.celleRealiNumero ?? 1 : null,
                          })
                        }
                      >
                        {option.label}
                      </button>
                    )
                  })}
                </div>
                {working.celleReali === 'numero' && (
                  <div className="telaino-panel__number-stepper" role="group" aria-label="Numero celle reali">
                    <button
                      type="button"
                      className="telaino-panel__stepper-btn"
                      aria-label="Diminuisci"
                      onClick={() => adjustNumber('celleRealiNumero', -1)}
                    >
                      <Minus size={22} />
                    </button>
                    <input
                      type="number"
                      className="telaino-panel__number-input"
                      min={0}
                      inputMode="numeric"
                      value={working.celleRealiNumero ?? 0}
                      aria-label="Numero celle reali"
                      onChange={(event) =>
                        patch({ celleRealiNumero: Math.max(0, Number(event.target.value) || 0) })
                      }
                    />
                    <button
                      type="button"
                      className="telaino-panel__stepper-btn"
                      aria-label="Aumenta"
                      onClick={() => adjustNumber('celleRealiNumero', 1)}
                    >
                      <Plus size={22} />
                    </button>
                  </div>
                )}
              </div>

              <div className="telaino-panel__field">
                <p className="telaino-panel__label">Varroa osservata</p>
                <div className="telaino-panel__quick-row telaino-panel__quick-row--2" role="group">
                  {TELAINO_VARROA_OPTIONS.map((option) => {
                    const selected = working.varroa === option.value
                    return (
                      <button
                        key={option.value}
                        type="button"
                        className={`telaino-panel__quick-btn telaino-panel__quick-btn--wide${selected ? ' telaino-panel__quick-btn--active' : ''}`}
                        aria-pressed={selected}
                        onClick={() =>
                          patch({
                            varroa: option.value,
                            varroaNumero: option.value === 'numero' ? working.varroaNumero ?? 1 : null,
                          })
                        }
                      >
                        {option.label}
                      </button>
                    )
                  })}
                </div>
                {working.varroa === 'numero' && (
                  <div className="telaino-panel__number-stepper" role="group" aria-label="Numero acari osservati">
                    <button
                      type="button"
                      className="telaino-panel__stepper-btn"
                      aria-label="Diminuisci"
                      onClick={() => adjustNumber('varroaNumero', -1)}
                    >
                      <Minus size={22} />
                    </button>
                    <input
                      type="number"
                      className="telaino-panel__number-input"
                      min={0}
                      inputMode="numeric"
                      value={working.varroaNumero ?? 0}
                      aria-label="Numero acari osservati"
                      onChange={(event) =>
                        patch({ varroaNumero: Math.max(0, Number(event.target.value) || 0) })
                      }
                    />
                    <button
                      type="button"
                      className="telaino-panel__stepper-btn"
                      aria-label="Aumenta"
                      onClick={() => adjustNumber('varroaNumero', 1)}
                    >
                      <Plus size={22} />
                    </button>
                  </div>
                )}
              </div>

              <div className="telaino-panel__field">
                <p className="telaino-panel__label">Foto</p>
                <button type="button" className="telaino-panel__photo-btn" onClick={handleCapturePhoto}>
                  <Camera size={26} strokeWidth={1.5} aria-hidden="true" />
                  Aggiungi foto
                </button>
                {working.foto && (
                  <img src={working.foto} alt={`Telaino ${working.numero}`} className="telaino-panel__photo-preview" />
                )}
              </div>

              <div className="telaino-panel__field">
                <p className="telaino-panel__label">Note</p>
                <textarea
                  className="telaino-panel__note"
                  rows={3}
                  placeholder="Osservazioni sul telaino…"
                  value={working.note}
                  onChange={(event) => patch({ note: event.target.value })}
                />
              </div>
            </div>

            <footer className="telaino-panel__footer">
              {saved && (
                <span className="telaino-panel__status telaino-panel__status--ok">
                  Telaino già salvato in visita
                </span>
              )}
              <button type="button" className="telaino-panel__save" onClick={handleSave}>
                SALVA TELAINO
              </button>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
