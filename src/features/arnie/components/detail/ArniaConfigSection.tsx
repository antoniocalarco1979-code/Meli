import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Arnia } from '../../../../database/types'
import './ArniaConfigSection.css'

type ArniaConfigSectionProps = {
  arnia: Arnia
}

type ConfigKey = 'vassoio' | 'melario' | 'escludiRegina'

const CONFIG_ITEMS: {
  key: ConfigKey
  emoji: string
  label: string
}[] = [
  {
    key: 'vassoio',
    emoji: '🛡️',
    label: 'Vassoio',
  },
  {
    key: 'melario',
    emoji: '🍯',
    label: 'Melario',
  },
  {
    key: 'escludiRegina',
    emoji: '🚫',
    label: 'Escludi regina',
  },
]

export function ArniaConfigSection({ arnia }: ArniaConfigSectionProps) {
  const [active, setActive] = useState<Record<ConfigKey, boolean>>(() => ({
    vassoio: arnia.hasVassoioAntivarroa,
    melario: arnia.hasMelario,
    escludiRegina: false,
  }))

  const toggle = (key: ConfigKey) => {
    setActive((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <motion.section
      className="arnia-config meli-glass meli-glass--deep"
      aria-label="Configurazione arnia"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.08 }}
    >
      <h2 className="arnia-config__title">Configurazione arnia</h2>

      <ul className="arnia-config__grid">
        {CONFIG_ITEMS.map(({ key, emoji, label }) => {
          const isActive = active[key]
          return (
            <li key={key}>
              <button
                type="button"
                className={`arnia-config__tile${isActive ? ' arnia-config__tile--active' : ''}`}
                aria-pressed={isActive}
                onClick={() => toggle(key)}
              >
                <span className="arnia-config__emoji" aria-hidden="true">
                  {emoji}
                </span>
                <span className="arnia-config__label">{label}</span>
                <span className="arnia-config__state">{isActive ? 'Attivo' : 'Off'}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </motion.section>
  )
}
