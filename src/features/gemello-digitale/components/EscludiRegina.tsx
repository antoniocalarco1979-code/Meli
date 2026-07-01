import type { CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { EscludiReginaGemelloModel } from '../types/gemelloDigitale.types'

type EscludiReginaProps = {
  escludi: EscludiReginaGemelloModel
  visible: boolean
  onRemove: () => void
}

export function EscludiRegina({ escludi, visible, onRemove }: EscludiReginaProps) {
  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          className="gemello-escludi-wrap"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.button
            type="button"
            className="gemello-escludi"
            style={
              escludi.visual.accentColor
                ? ({ '--gemello-escludi-accent': escludi.visual.accentColor } as CSSProperties)
                : undefined
            }
            aria-label={`${escludi.label}. Tocca per rimuovere`}
            onClick={onRemove}
            whileTap={{ scale: 0.98 }}
            layout
          >
            <span className="gemello-escludi__emoji" aria-hidden="true">
              🚫
            </span>
            <span className="gemello-escludi__label">{escludi.label}</span>
            <span className="gemello-escludi__hint">Tocca per rimuovere</span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
