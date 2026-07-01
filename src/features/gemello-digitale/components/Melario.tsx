import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import type { MelarioGemelloModel } from '../types/gemelloDigitale.types'

export type MelarioClickEvent = {
  melario: MelarioGemelloModel
  lifted: boolean
}

type MelarioProps = {
  melario: MelarioGemelloModel
  lifted: boolean
  selected: boolean
  onClick: (event: MelarioClickEvent) => void
}

export function Melario({ melario, lifted, selected, onClick }: MelarioProps) {
  return (
    <motion.button
      type="button"
      className={`gemello-melario${selected ? ' gemello-melario--selected' : ''}`}
      style={
        melario.visual.accentColor
          ? ({ '--gemello-melario-accent': melario.visual.accentColor } as CSSProperties)
          : undefined
      }
      data-stack-index={melario.stackIndex}
      aria-pressed={lifted}
      aria-label={`${melario.label}. ${lifted ? 'Sollevato' : 'Tocca per sollevare'}`}
      onClick={() => onClick({ melario, lifted: !lifted })}
      animate={{
        y: lifted ? -32 : 0,
        scale: selected ? 1.02 : 1,
        zIndex: lifted ? 4 : melario.stackIndex,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      layout
    >
      <span className="gemello-melario__edge gemello-melario__edge--left" aria-hidden="true" />
      <span className="gemello-melario__face">
        <span className="gemello-melario__emoji" aria-hidden="true">
          🍯
        </span>
        <span className="gemello-melario__label">{melario.label}</span>
        {lifted && <span className="gemello-melario__lift-tag">Sollevato</span>}
      </span>
      <span className="gemello-melario__edge gemello-melario__edge--right" aria-hidden="true" />
    </motion.button>
  )
}
