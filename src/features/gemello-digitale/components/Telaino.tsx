import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import type { TelainoGemelloModel } from '../types/gemelloDigitale.types'

export type TelainoClickEvent = {
  telaino: TelainoGemelloModel
}

type TelainoProps = {
  telaino: TelainoGemelloModel
  selected: boolean
  onClick: (event: TelainoClickEvent) => void
}

export function Telaino({ telaino, selected, onClick }: TelainoProps) {
  const accent = telaino.visual.accentColor

  return (
    <motion.button
      type="button"
      className={`gemello-telaino${selected ? ' gemello-telaino--selected' : ''}`}
      style={accent ? ({ '--gemello-telaino-accent': accent } as CSSProperties) : undefined}
      aria-pressed={selected}
      aria-label={`Telaino ${telaino.numero}${selected ? ', selezionato' : ''}`}
      onClick={() => onClick({ telaino })}
      animate={{
        y: selected ? -16 : 0,
        scale: selected ? 1.06 : 1,
      }}
      whileTap={{ scale: selected ? 1.04 : 0.97 }}
      transition={{ type: 'spring', stiffness: 440, damping: 26 }}
      layout
    >
      <span className="gemello-telaino__frame" aria-hidden="true">
        <span className="gemello-telaino__cells" />
        <span className="gemello-telaino__cells gemello-telaino__cells--offset" />
        <span className="gemello-telaino__cells" />
      </span>
      <span className="gemello-telaino__number">{telaino.numero}</span>
      {selected && (
        <motion.span
          className="gemello-telaino__selected-ring"
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.button>
  )
}
