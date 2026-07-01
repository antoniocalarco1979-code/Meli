import { motion } from 'framer-motion'
import type { NidoGemelloModel } from '../types/gemelloDigitale.types'

type NidoProps = {
  nido: NidoGemelloModel
  selected: boolean
  onClick: () => void
}

export function Nido({ nido, selected, onClick }: NidoProps) {
  return (
    <motion.button
      type="button"
      className={`gemello-nido-body${selected ? ' gemello-nido-body--selected' : ''}`}
      aria-label={`${nido.label}. ${nido.telaini.length} telaini. Entra nel nido`}
      onClick={onClick}
      whileTap={{ scale: 0.985 }}
      animate={{ scale: selected ? 1.01 : 1 }}
      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
    >
      <span className="gemello-nido-body__edge gemello-nido-body__edge--left" aria-hidden="true" />
      <span className="gemello-nido-body__face">
        <span className="gemello-nido-body__emoji" aria-hidden="true">
          🏠
        </span>
        <span className="gemello-nido-body__label">{nido.label}</span>
        <span className="gemello-nido-body__meta">{nido.telaini.length} telaini</span>
        <span className="gemello-nido-body__enter">Entra nel nido →</span>
      </span>
      <span className="gemello-nido-body__edge gemello-nido-body__edge--right" aria-hidden="true" />
    </motion.button>
  )
}
