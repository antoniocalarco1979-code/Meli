import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Clock, CloudSun, X } from 'lucide-react'
import type { VisitaTimelineEntry } from '../../types'

type CronologiaVisitaDetailPanelProps = {
  visit: VisitaTimelineEntry | null
  arniaNumero: string
  open: boolean
  onClose: () => void
}

function DetailSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="cronologia-detail__section">
      <h3 className="cronologia-detail__section-title">{title}</h3>
      {children}
    </section>
  )
}

export function CronologiaVisitaDetailPanel({
  visit,
  arniaNumero,
  open,
  onClose,
}: CronologiaVisitaDetailPanelProps) {
  if (!visit) return null

  const { detail } = visit
  const noteText =
    detail.noteNido ||
    visit.noteDisplay ||
    (detail.isGuidata ? undefined : visit.summary)

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            className="cronologia-detail__backdrop"
            aria-label="Chiudi dettaglio visita"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.aside
            className="cronologia-detail meli-glass meli-glass--deep"
            role="dialog"
            aria-modal="true"
            aria-label={`Dettaglio visita ${visit.dataFull}`}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
          >
            <header className="cronologia-detail__header">
              <div>
                <p className="cronologia-detail__kicker">Visita · Arnia {arniaNumero}</p>
                <h2 className="cronologia-detail__title">{visit.dataFull}</h2>
                <p className="cronologia-detail__subtitle">{visit.oraLabel}</p>
              </div>
              <button type="button" className="cronologia-detail__close" onClick={onClose} aria-label="Chiudi">
                <X size={22} />
              </button>
            </header>

            <div className="cronologia-detail__body">
              <div className="cronologia-detail__chips">
                <span className="cronologia-detail__chip">
                  <Clock size={16} aria-hidden="true" />
                  {visit.durataLabel}
                </span>
                <span className="cronologia-detail__chip">
                  <CloudSun size={16} aria-hidden="true" />
                  {visit.meteoLabel}
                </span>
                <span className={`cronologia-detail__chip cronologia-detail__chip--${visit.statusLevel}`}>
                  {visit.statusIcon} {visit.statoGeneraleLabel}
                </span>
              </div>

              <DetailSection title="Riepilogo">
                <dl className="cronologia-detail__dl">
                  <div className="cronologia-detail__row">
                    <dt>Arnia</dt>
                    <dd>{arniaNumero}</dd>
                  </div>
                  <div className="cronologia-detail__row">
                    <dt>Data e ora</dt>
                    <dd>
                      {visit.dataFull} · {visit.oraLabel}
                    </dd>
                  </div>
                  <div className="cronologia-detail__row">
                    <dt>Durata</dt>
                    <dd>{visit.durataLabel}</dd>
                  </div>
                  <div className="cronologia-detail__row">
                    <dt>Meteo</dt>
                    <dd>{visit.meteoLabel}</dd>
                  </div>
                  {detail.riepilogoLines.map((row) => (
                    <div key={row.label} className="cronologia-detail__row">
                      <dt>{row.label}</dt>
                      <dd>{row.value}</dd>
                    </div>
                  ))}
                  {!detail.isGuidata && (
                    <>
                      <div className="cronologia-detail__row">
                        <dt>Regina</dt>
                        <dd>{visit.reginaLabel}</dd>
                      </div>
                      <div className="cronologia-detail__row">
                        <dt>Covata</dt>
                        <dd>{visit.covataLabel}</dd>
                      </div>
                      <div className="cronologia-detail__row">
                        <dt>Scorte</dt>
                        <dd>{visit.scorteLabel}</dd>
                      </div>
                    </>
                  )}
                </dl>
              </DetailSection>

              {detail.telaini.length > 0 && (
                <DetailSection title={`Telaini (${detail.telaini.length})`}>
                  <div className="cronologia-detail__telaini">
                    {detail.telaini.map((telaino) => (
                      <article key={telaino.numero} className="cronologia-detail__telaino-card">
                        <h4 className="cronologia-detail__telaino-title">Telaino {telaino.numero}</h4>
                        <dl className="cronologia-detail__telaino-dl">
                          {telaino.regina && (
                            <div>
                              <dt>Regina</dt>
                              <dd>{telaino.regina}</dd>
                            </div>
                          )}
                          {telaino.uova && (
                            <div>
                              <dt>Uova</dt>
                              <dd>{telaino.uova}</dd>
                            </div>
                          )}
                          {telaino.covataAperta && (
                            <div>
                              <dt>Covata aperta</dt>
                              <dd>{telaino.covataAperta}</dd>
                            </div>
                          )}
                          {telaino.covataOpercolata && (
                            <div>
                              <dt>Covata opercolata</dt>
                              <dd>{telaino.covataOpercolata}</dd>
                            </div>
                          )}
                          {telaino.miele && (
                            <div>
                              <dt>Miele</dt>
                              <dd>{telaino.miele}</dd>
                            </div>
                          )}
                          {telaino.polline && (
                            <div>
                              <dt>Polline</dt>
                              <dd>{telaino.polline}</dd>
                            </div>
                          )}
                          {telaino.celleReali && (
                            <div>
                              <dt>Celle reali</dt>
                              <dd>{telaino.celleReali}</dd>
                            </div>
                          )}
                          {telaino.varroa && (
                            <div>
                              <dt>Varroa</dt>
                              <dd>{telaino.varroa}</dd>
                            </div>
                          )}
                          {telaino.note && (
                            <div className="cronologia-detail__telaino-note">
                              <dt>Note</dt>
                              <dd>{telaino.note}</dd>
                            </div>
                          )}
                        </dl>
                      </article>
                    ))}
                  </div>
                </DetailSection>
              )}

              {detail.interventi.length > 0 && (
                <DetailSection title="Interventi">
                  <ul className="cronologia-detail__interventi">
                    {detail.interventi.map((item, index) => (
                      <li key={`${item.label}-${index}`}>
                        <strong>{item.label}</strong>
                        {item.note ? <span> — {item.note}</span> : null}
                      </li>
                    ))}
                  </ul>
                </DetailSection>
              )}

              {visit.trattamenti.length > 0 && detail.interventi.length === 0 && (
                <DetailSection title="Trattamenti collegati">
                  <ul className="cronologia-detail__interventi">
                    {visit.trattamenti.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </DetailSection>
              )}

              {noteText && (
                <DetailSection title="Note">
                  <p className="cronologia-detail__note">{noteText}</p>
                </DetailSection>
              )}

              {visit.fotoPaths.length > 0 && (
                <DetailSection title={`Foto (${visit.fotoPaths.length})`}>
                  <div className="cronologia-detail__photos">
                    {visit.fotoPaths.map((path, index) => (
                      <figure key={`${visit.id}-photo-${index}`} className="cronologia-detail__photo">
                        <img src={path} alt="" loading="lazy" />
                      </figure>
                    ))}
                  </div>
                </DetailSection>
              )}

              <p className="cronologia-detail__readonly" aria-live="polite">
                Visita in sola lettura · confronto tra visite in arrivo
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
