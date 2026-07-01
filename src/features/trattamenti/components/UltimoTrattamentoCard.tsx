import { motion } from 'framer-motion'
import { ChevronRight, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppPath } from '../../../demo/useAppPath'
import type { UltimoTrattamentoSummary } from '../types/trattamento.types'
import './UltimoTrattamentoCard.css'

type UltimoTrattamentoCardProps = {
  trattamento: UltimoTrattamentoSummary
}

export function UltimoTrattamentoCard({ trattamento }: UltimoTrattamentoCardProps) {
  const appPath = useAppPath()

  return (
    <motion.section
      className="ultimo-trattamento meli-glass meli-glass--deep"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Ultimo trattamento"
    >
      <header className="ultimo-trattamento__header">
        <Shield size={20} strokeWidth={1.75} aria-hidden="true" />
        <h2 className="arnia-section-title">Ultimo trattamento</h2>
      </header>

      {!trattamento.present || !trattamento.id ? (
        <p className="ultimo-trattamento__empty">Nessun trattamento registrato</p>
      ) : (
        <>
          <dl className="ultimo-trattamento__grid">
            <div>
              <dt>Tipo</dt>
              <dd>{trattamento.tipoLabel}</dd>
            </div>
            <div>
              <dt>Data</dt>
              <dd>{trattamento.dataLabel}</dd>
            </div>
            {trattamento.principioAttivo && (
              <div className="ultimo-trattamento__full">
                <dt>Principio attivo</dt>
                <dd>{trattamento.principioAttivo}</dd>
              </div>
            )}
          </dl>

          {trattamento.promemoria && (
            <p className="ultimo-trattamento__promemoria">
              📅 Promemoria calendario: {new Date(trattamento.promemoria.dataPromemoria).toLocaleDateString('it-IT')}
            </p>
          )}

          <Link to={appPath(`/trattamenti/${trattamento.id}`)} className="ultimo-trattamento__link">
            Dettaglio trattamento
            <ChevronRight size={18} aria-hidden="true" />
          </Link>
        </>
      )}
    </motion.section>
  )
}
