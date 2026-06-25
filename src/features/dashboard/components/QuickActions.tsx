import { motion } from 'framer-motion'
import {
  Bell,
  Camera,
  Mic,
  PlusCircle,
  QrCode,
} from 'lucide-react'
import type { QuickAction } from '../types'
import './QuickActions.css'

type QuickActionsProps = {
  actions: QuickAction[]
}

const iconMap = {
  visit: PlusCircle,
  camera: Camera,
  voice: Mic,
  qr: QrCode,
  reminder: Bell,
} as const

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.48 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <motion.nav
      className="quick-actions"
      aria-label="Azioni rapide"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {actions.map((action) => {
        const Icon = iconMap[action.icon]
        return (
          <motion.button
            key={action.id}
            type="button"
            className="quick-actions__btn meli-glass"
            variants={item}
            whileHover={{
              y: -5,
              scale: 1.03,
              boxShadow: 'var(--meli-shadow-lg)',
              transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
            }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="quick-actions__icon" aria-hidden="true">
              <Icon size={26} strokeWidth={1.65} />
            </span>
            <span className="quick-actions__label">{action.label}</span>
          </motion.button>
        )
      })}
    </motion.nav>
  )
}
