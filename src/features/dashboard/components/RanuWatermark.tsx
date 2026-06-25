import { motion } from 'framer-motion'
import './RanuWatermark.css'

export function RanuWatermark() {
  return (
    <motion.div
      className="ranu-watermark"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      aria-hidden="true"
    >
      <div className="ranu-watermark__ring" />
      <span className="ranu-watermark__text">RANU</span>
      <span className="ranu-watermark__sub">Aspromonte</span>
    </motion.div>
  )
}
