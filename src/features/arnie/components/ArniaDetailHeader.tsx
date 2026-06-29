import { motion } from 'framer-motion'
import type { Arnia } from '../../../database/types'
import {
  formatReginaColoreDisplay,
  formatSaluteStatoLabel,
  saluteStatoModifier,
} from '../utils/arniaFormatters'
import './ArniaDetailHeader.css'

type ArniaDetailHeaderProps = {
  arnia: Arnia
  reginaColore?: string
  salute: number
}

export function ArniaDetailHeader({ arnia, reginaColore, salute }: ArniaDetailHeaderProps) {
  const coloreLabel = formatReginaColoreDisplay(reginaColore)
  const nome = arnia.nome?.trim()
  const statoLabel = formatSaluteStatoLabel(salute)
  const statoMod = saluteStatoModifier(statoLabel)

  return (
    <motion.header
      className="arnia-detail-header meli-glass meli-glass--deep"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="arnia-detail-header__top">
        <h1 className="arnia-detail-header__title">
          <span className="arnia-detail-header__bee" aria-hidden="true">
            🐝
          </span>
          Arnia {arnia.numero}
        </h1>
        <span
          className={`arnia-detail-header__stato arnia-detail-header__stato--${statoMod}`}
          role="status"
        >
          {statoLabel}
        </span>
      </div>

      <dl className="arnia-detail-header__meta">
        <div className="arnia-detail-header__row">
          <dt>Nome</dt>
          <dd>{nome ?? '—'}</dd>
        </div>
        <div className="arnia-detail-header__row">
          <dt>Numero</dt>
          <dd>{arnia.numero}</dd>
        </div>
        <div className="arnia-detail-header__row">
          <dt>Colore</dt>
          <dd>{coloreLabel ?? '—'}</dd>
        </div>
        <div className="arnia-detail-header__row">
          <dt>Stato</dt>
          <dd>
            <span className={`arnia-detail-header__stato-inline arnia-detail-header__stato--${statoMod}`}>
              {statoLabel}
            </span>
          </dd>
        </div>
      </dl>
    </motion.header>
  )
}
