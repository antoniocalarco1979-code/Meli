import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import './ApiarioGiroHero.css'

type ApiarioGiroHeroProps = {
  nome: string
  arnieCount: number
  onIniziaGiro: () => void
  disabled?: boolean
}

function displayNome(nome: string) {
  return nome.trim().toUpperCase()
}

export function ApiarioGiroHero({ nome, arnieCount, onIniziaGiro, disabled }: ApiarioGiroHeroProps) {
  const label = arnieCount === 1 ? 'arnia' : 'arnie'

  return (
    <motion.header
      className="apiario-giro-hero meli-glass meli-glass--deep"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className="apiario-giro-hero__emoji" aria-hidden="true">
        🐝
      </p>
      <h1 className="apiario-giro-hero__title">{displayNome(nome)}</h1>
      <p className="apiario-giro-hero__count">
        {arnieCount} {label}
      </p>
      <motion.button
        type="button"
        className="apiario-giro-hero__btn"
        onClick={onIniziaGiro}
        disabled={disabled || arnieCount === 0}
        whileHover={disabled ? undefined : { scale: 1.02 }}
        whileTap={disabled ? undefined : { scale: 0.975 }}
      >
        <span className="apiario-giro-hero__shine" aria-hidden="true" />
        <Play size={26} fill="currentColor" strokeWidth={0} aria-hidden="true" />
        <span>Inizia giro apiario</span>
      </motion.button>
    </motion.header>
  )
}
