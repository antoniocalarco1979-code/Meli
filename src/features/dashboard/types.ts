export type WeatherData = {
  temperature: number
  condition: string
  humidity: number
  windKmh: number
}

export type KpiItem = {
  id: string
  label: string
  value: string
  icon: 'hives' | 'visit' | 'production' | 'queen' | 'treatment'
}

export type HiveMarker = {
  id: string
  label: string
  x: number
  y: number
  status: 'healthy' | 'warning' | 'critical' | 'inactive'
}

export type TodayActivity = {
  id: string
  time: string
  title: string
}

export type QuickAction = {
  id: string
  label: string
  icon: 'visit' | 'camera' | 'voice' | 'qr' | 'reminder'
}

export type DashboardData = {
  userName: string
  subtitle: string
  selectedApiary: string
  apiaries: string[]
  weather: WeatherData
  kpis: KpiItem[]
  hiveMarkers: HiveMarker[]
  todayActivities: TodayActivity[]
  quickActions: QuickAction[]
}
