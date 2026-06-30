import { motion } from 'framer-motion'
import { CalendarDays, CloudSun } from 'lucide-react'
import type { WeatherData } from '../../types'
import { formatHomeDate, getPersonalizedGreeting } from '../../utils/homeHelpers'
import './HomeHeader.css'

type HomeHeaderProps = {
  userName: string
  weather: WeatherData
  loading?: boolean
}

export function HomeHeader({ userName, weather, loading = false }: HomeHeaderProps) {
  const greeting = getPersonalizedGreeting(userName)
  const todayLabel = formatHomeDate()

  return (
    <motion.header
      className="home-header meli-glass meli-glass--deep"
      aria-label="Intestazione Home"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="home-header__brand">
        <p className="home-header__logo">
          <span aria-hidden="true">🐝</span> MELI
        </p>
        <p className="home-header__byline">by RANU</p>
      </div>

      <div className="home-header__main">
        <h1 className="home-header__greeting">{loading ? 'Caricamento…' : greeting}</h1>
        <div className="home-header__meta">
          <span className="home-header__meta-item">
            <CalendarDays size={16} strokeWidth={1.75} aria-hidden="true" />
            <span>{todayLabel}</span>
          </span>
          <span className="home-header__meta-item home-header__meta-item--weather">
            <CloudSun size={16} strokeWidth={1.75} aria-hidden="true" />
            <span>
              {weather.temperature}° · {weather.condition}
            </span>
          </span>
        </div>
      </div>
    </motion.header>
  )
}
