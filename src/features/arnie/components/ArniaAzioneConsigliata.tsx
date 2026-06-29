import { motion } from 'framer-motion'
import { useMemo } from 'react'
import {
  AzioniConsigliateList,
  buildAzioneRuleContextFromSummary,
  generateAzioniConsigliate,
} from '../../azioni'
import type { UltimaVisitaSummary } from '../types'
import './ArniaAzioneConsigliata.css'

type ArniaAzioneConsigliataProps = {
  visit: UltimaVisitaSummary
}

export function ArniaAzioneConsigliata({ visit }: ArniaAzioneConsigliataProps) {
  const azioni = useMemo(
    () => generateAzioniConsigliate(buildAzioneRuleContextFromSummary(visit)),
    [visit],
  )

  return (
    <motion.section
      className="arnia-azione meli-glass meli-glass--deep"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.08 }}
      aria-label="Azioni consigliate"
    >
      <p className="arnia-azione__eyebrow">Azioni consigliate</p>
      <AzioniConsigliateList azioni={azioni} />
    </motion.section>
  )
}
