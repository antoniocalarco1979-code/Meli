import {
  BarChart3,
  CalendarDays,
  Crown,
  Droplets,
  Hexagon,
  LayoutDashboard,
  MapPin,
  Package,
  navEmoji,
  Shield,
} from '../../theme/icons'
import type { AppRoute, BottomNavItem } from '../../types'

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

/** Tab bar mobile / iPad — 5 voci principali */
export const bottomNavItems: BottomNavItem[] = [
  { path: '/', label: 'Home', emoji: navEmoji.home, end: true },
  { path: '/apiari', label: 'Apiari', emoji: navEmoji.apiari },
  { path: '/oggi', label: 'Oggi', emoji: navEmoji.oggi, end: true },
  { path: '/report', label: 'Report', emoji: navEmoji.report, end: true },
  {
    path: '/altro',
    label: 'Altro',
    emoji: navEmoji.altro,
    end: true,
    activePrefixes: [
      '/altro',
      '/arnie',
      '/visite',
      '/regine',
      '/trattamenti',
      '/produzione',
      '/magazzino',
    ],
  },
]

export const routeMeta: Record<string, { title: string; subtitle?: string }> = {
  '/': { title: 'Home', subtitle: 'Panoramica apiario' },
  '/oggi': { title: 'Oggi', subtitle: 'Agenda e giro apiario' },
  '/altro': { title: 'Altro', subtitle: 'Moduli e impostazioni' },
  '/apiari': { title: 'Apiari', subtitle: 'Gestione siti apistici' },
  '/arnie': { title: 'Arnie', subtitle: 'Colonie e alveari' },
  '/visite': { title: 'Visite', subtitle: 'Ispezioni e controlli' },
  '/regine': { title: 'Regine', subtitle: 'Gestione regine' },
  '/trattamenti': { title: 'Trattamenti', subtitle: 'Sanitaria e trattamenti' },
  '/produzione': { title: 'Produzione', subtitle: 'Miele e raccolta' },
  '/magazzino': { title: 'Magazzino', subtitle: 'Materiali e attrezzatura' },
  '/report': { title: 'Report', subtitle: 'Analisi e statistiche' },
}

export function resolveRouteMeta(pathname: string) {
  if (routeMeta[pathname]) return routeMeta[pathname]

  const prefix = Object.keys(routeMeta)
    .filter((key) => key !== '/')
    .sort((a, b) => b.length - a.length)
    .find((key) => pathname.startsWith(key))

  return prefix ? routeMeta[prefix] : routeMeta['/']
}

export function isBottomNavActive(pathname: string, item: BottomNavItem): boolean {
  if (item.activePrefixes) {
    return item.activePrefixes.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    )
  }
  if (item.end) return pathname === item.path
  return pathname === item.path || pathname.startsWith(`${item.path}/`)
}
