import type { SaluteLevel } from '../utils/arniaFormatters'
import { getSaluteLevel } from '../utils/arniaFormatters'
import './SaluteSemaforo.css'

type SaluteSemaforoProps = {
  value: number
  showLabel?: boolean
  size?: 'md' | 'lg'
}

const LABELS: Record<SaluteLevel, string> = {
  green: 'Buona',
  yellow: 'Attenzione',
  red: 'Critica',
}

export function SaluteSemaforo({ value, showLabel = true, size = 'md' }: SaluteSemaforoProps) {
  const level = getSaluteLevel(value)

  return (
    <div
      className={`salute-semaforo salute-semaforo--${size}`}
      role="status"
      aria-label={`Salute ${value} percento, ${LABELS[level]}`}
    >
      <span className={`salute-semaforo__dot salute-semaforo__dot--${level}`} aria-hidden="true" />
      {showLabel && (
        <span className="salute-semaforo__text">
          <strong>{value}%</strong>
          <span>{LABELS[level]}</span>
        </span>
      )}
    </div>
  )
}
