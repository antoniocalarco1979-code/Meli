import {
  BarChart3,
  CalendarDays,
  Crown,
  Droplets,
  Hexagon,
  LayoutDashboard,
  MapPin,
  Package,
  Shield,
} from 'lucide-react'
import type { AppRoute } from '../types'

export const appRoutes: AppRoute[] = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { path: '/apiari', label: 'Apiari', icon: MapPin },
  { path: '/arnie', label: 'Arnie', icon: Hexagon },
  { path: '/visite', label: 'Visite', icon: CalendarDays },
  { path: '/regine', label: 'Regine', icon: Crown },
  { path: '/trattamenti', label: 'Trattamenti', icon: Shield },
  { path: '/produzione', label: 'Produzione', icon: Droplets },
  { path: '/magazzino', label: 'Magazzino', icon: Package },
  { path: '/report', label: 'Report', icon: BarChart3 },
]

export const routeMeta: Record<string, { title: string; subtitle?: string }> = {
  '/': { title: 'Dashboard', subtitle: 'Panoramica apiario' },
  '/apiari': { title: 'Apiari', subtitle: 'Gestione siti apistici' },
  '/arnie': { title: 'Arnie', subtitle: 'Colonie e alveari' },
  '/visite': { title: 'Visite', subtitle: 'Ispezioni e controlli' },
  '/regine': { title: 'Regine', subtitle: 'Gestione regine' },
  '/trattamenti': { title: 'Trattamenti', subtitle: 'Sanitaria e trattamenti' },
  '/produzione': { title: 'Produzione', subtitle: 'Miele e raccolta' },
  '/magazzino': { title: 'Magazzino', subtitle: 'Materiali e attrezzatura' },
  '/report': { title: 'Report', subtitle: 'Analisi e statistiche' },
}
