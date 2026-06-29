import type { LucideIcon } from 'lucide-react'
import {
  AlertTriangle,
  CalendarClock,
  Crown,
  Hexagon,
  Leaf,
} from 'lucide-react'
import type { IntelligenceIconId, IntelligencePriority } from '../types'

export const INTELLIGENCE_PRIORITA_LABEL: Record<IntelligencePriority, string> = {
  urgente: 'Urgente',
  alta: 'Priorità alta',
  media: 'Media',
  programmare: 'Da programmare',
}

export const INTELLIGENCE_ICONS: Record<IntelligenceIconId, LucideIcon> = {
  'calendar-clock': CalendarClock,
  crown: Crown,
  'alert-triangle': AlertTriangle,
  hexagon: Hexagon,
  leaf: Leaf,
}
