import type { LucideIcon } from 'lucide-react'

export type AppRoute = {
  path: string
  label: string
  icon: LucideIcon
  emoji?: string
  end?: boolean
  /** Nasconde voci incomplete dalla navigazione principale */
  hidden?: boolean
}

export type BottomNavItem = {
  path: string
  label: string
  emoji: string
  end?: boolean
  /** Path prefixes that highlight this tab (es. Altro → /arnie) */
  activePrefixes?: string[]
}
