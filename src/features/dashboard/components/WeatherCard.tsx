import { motion } from 'framer-motion'
import { CloudSun, Droplets, Wind } from 'lucide-react'
import type { WeatherData } from '../types'
import './WeatherCard.css'

type WeatherCardProps = WeatherData

export function WeatherCard({ temperature, condition, humidity, windKmh }: WeatherCardProps) {
  return (
    <motion.article
      className="weather-card meli-glass meli-glass--deep"
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{
        y: -4,
        boxShadow: 'var(--meli-shadow-lg)',
        transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
      }}
    >
      <div className="weather-card__sky" aria-hidden="true">
        <div className="weather-card__sun" />
        <div className="weather-card__cloud weather-card__cloud--1" />
        <div className="weather-card__cloud weather-card__cloud--2" />
      </div>

      <div className="weather-card__body">
        <div className="weather-card__hero">
          <CloudSun size={44} strokeWidth={1.25} className="weather-card__icon" aria-hidden="true" />
          <div>
            <p className="weather-card__temp">{temperature}°</p>
            <p className="weather-card__unit">Celsius</p>
          </div>
        </div>

        <p className="weather-card__condition">{condition}</p>

        <div className="weather-card__metrics">
          <div className="weather-card__metric">
            <Droplets size={20} strokeWidth={1.75} aria-hidden="true" />
            <div>
              <span className="weather-card__metric-value">{humidity}%</span>
              <span className="weather-card__metric-label">Umidità</span>
            </div>
          </div>
          <div className="weather-card__metric">
            <Wind size={20} strokeWidth={1.75} aria-hidden="true" />
            <div>
              <span className="weather-card__metric-value">{windKmh} km/h</span>
              <span className="weather-card__metric-label">Vento</span>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
