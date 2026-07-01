import { motion } from 'framer-motion'
import { Droplets } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppPath } from '../../../../demo/useAppPath'
import './HomeProduzioneCard.css'

type HomeProduzioneCardProps = {
  kgAnno: number
  loading?: boolean
}

function formatKgAnno(kg: number): string {
  if (kg <= 0) return '0 kg'
  const value = Number.isInteger(kg) ? String(kg) : kg.toFixed(1)
  return `${value} kg`
}

export function HomeProduzioneCard({ kgAnno, loading = false }: HomeProduzioneCardProps) {
  const appPath = useAppPath()
  const year = new Date().getFullYear()

  return (
    <motion.section
      className="home-produzione meli-glass meli-glass--deep"
      aria-label="Produzione anno corrente"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to={appPath('/produzione')} className="home-produzione__link">
        <span className="home-produzione__icon" aria-hidden="true">
          <Droplets size={22} strokeWidth={1.75} />
        </span>
        <div className="home-produzione__content">
          <p className="home-produzione__eyebrow meli-label">Produzione {year}</p>
          <p className="home-produzione__value">{loading ? '—' : formatKgAnno(kgAnno)}</p>
          <p className="home-produzione__label">Kg prodotti anno corrente</p>
        </div>
      </Link>
    </motion.section>
  )
}
