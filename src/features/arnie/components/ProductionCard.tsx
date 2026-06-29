import { motion } from 'framer-motion'
import type { ProductionSummary } from '../types'
import { ProduzioneChart } from './ProduzioneChart'
import './ProductionCard.css'

type ProductionCardProps = {
  production: ProductionSummary
}

export function ProductionCard({ production }: ProductionCardProps) {
  return (
    <motion.section
      className="production-card meli-glass meli-glass--deep"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Produzione"
    >
      <header className="production-card__header">
        <h2 className="arnia-section-title">📈 Produzione</h2>
      </header>

      <div className="production-card__stats">
        <div className="production-card__stat">
          <span className="production-card__stat-label">Produzione anno</span>
          <span className="production-card__stat-value">{production.annoTotaleLabel}</span>
        </div>
        <div className="production-card__stat">
          <span className="production-card__stat-label">Ultima smielatura</span>
          <span className="production-card__stat-value">{production.ultimaSmielaturaLabel}</span>
        </div>
      </div>

      <div className="production-card__chart">
        <p className="production-card__chart-label">Andamento</p>
        <ProduzioneChart data={production.chartData} />
      </div>
    </motion.section>
  )
}
