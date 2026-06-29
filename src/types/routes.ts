import type { LucideIcon } from 'lucide-react'

export type AppRoute = {
  path: string
  label: string
  icon: LucideIcon
  end?: boolean
}

export type BottomNavItem = {
  path: string
  label: string
  emoji: string
  end?: boolean
  /** Path prefixes that highlight this tab (es. Altro → /arnie) */
  activePrefixes?: string[]
}
