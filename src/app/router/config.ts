import {
  BarChart3,
  CalendarDays,
  Crown,
  Droplets,
  Hexagon,
  Home,
  Map,
  MapPin,
  Package,
  navEmoji,
  Shield,
} from '../../theme/icons'
import type { AppRoute, BottomNavItem } from '../../types'

export const appRoutes: AppRoute[] = [
  { path: '/', label: 'Home', icon: Home, end: true },
  { path: '/mappa-apiari', label: 'Mappa Apiari', icon: Map, emoji: '🗺️' },
  { path: '/apiari', label: 'Apiari', icon: MapPin },
  { path: '/arnie', label: 'Arnie', icon: Hexagon },
  { path: '/visite', label: 'Visite', icon: CalendarDays, hidden: true },
  { path: '/regine', label: 'Regine', icon: Crown, hidden: true },
  { path: '/trattamenti', label: 'Trattamenti', icon: Shield, hidden: true },
  { path: '/produzione', label: 'Produzione', icon: Droplets, hidden: true },
  { path: '/magazzino', label: 'Magazzino', icon: Package, hidden: true },
  { path: '/report', label: 'Report', icon: BarChart3, hidden: true },
]

export const visibleAppRoutes = appRoutes.filter((route) => !route.hidden)

/** Tab bar mobile / iPad — 5 voci principali */
export const bottomNavItems: BottomNavItem[] = [
  { path: '/', label: 'Home', emoji: navEmoji.home, end: true },
  { path: '/apiari', label: 'Apiari', emoji: navEmoji.apiari },
  { path: '/arnie', label: 'Arnie', emoji: navEmoji.apiari, end: true },
  { path: '/oggi', label: 'Oggi', emoji: navEmoji.oggi, end: true },
  {
    path: '/altro',
    label: 'Altro',
    emoji: navEmoji.altro,
    end: true,
    activePrefixes: [
      '/altro',
      '/impostazioni',
      '/mappa-apiari',
      '/visite',
      '/regine',
      '/trattamenti',
      '/produzione',
      '/magazzino',
      '/report',
    ],
  },
]

export const routeMeta: Record<string, { title: string; subtitle?: string }> = {
  '/': { title: 'Home', subtitle: 'La tua giornata in apiario' },
  '/oggi': { title: 'Oggi', subtitle: 'Agenda e giro apiario' },
  '/altro': { title: 'Altro', subtitle: 'Moduli e impostazioni' },
  '/impostazioni': { title: 'Impostazioni', subtitle: 'Configurazione MELI' },
  '/impostazioni/gestione-qr': { title: 'Gestione QR', subtitle: 'Etichette e codici arnie' },
  '/apiari': { title: 'Apiari', subtitle: 'Gestione siti apistici' },
  '/apiari/:id': { title: 'Scheda Apiario', subtitle: 'Informazioni e statistiche' },
  '/mappa-apiari': { title: 'Mappa Apiari', subtitle: 'Geolocalizzazione siti apistici' },
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
