import type { LucideIcon } from 'lucide-react'

export type AppRoute = {
  path: string
  label: string
  icon: LucideIcon
  end?: boolean
}

export type FeaturePageProps = {
  title: string
  description?: string
}
