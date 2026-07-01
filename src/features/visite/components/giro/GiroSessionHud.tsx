import { formatDuration } from '../../../../utils/dateFormatters'
import { useElapsedSeconds } from '../../hooks/useElapsedSeconds'
import './GiroSessionHud.css'

export type GiroSessionHudProps = {
  current: number
  total: number
  startedAt: number
  apiarioNome?: string
  live?: boolean
  elapsedSeconds?: number
}

export function GiroSessionHud({
  current,
  total,
  startedAt,
  apiarioNome,
  live = true,
  elapsedSeconds,
}: GiroSessionHudProps) {
  const liveElapsed = useElapsedSeconds(startedAt, live)
  const elapsed = elapsedSeconds ?? liveElapsed
  const remaining = Math.max(0, total - current)
  const progress = total > 0 ? Math.min(100, (current / total) * 100) : 0

  return (
    <section className="giro-session-hud" aria-label="Progresso giro apiario">
      {apiarioNome ? (
        <p className="giro-session-hud__eyebrow">Giro apiario · {apiarioNome}</p>
      ) : (
        <p className="giro-session-hud__eyebrow">Giro apiario in corso</p>
      )}

      <div className="giro-session-hud__metrics" aria-live="polite">
        <div className="giro-session-hud__metric">
          <span className="giro-session-hud__metric-value">
            {current}/{total}
          </span>
          <span className="giro-session-hud__metric-label">progresso</span>
        </div>
        <div className="giro-session-hud__metric">
          <span className="giro-session-hud__metric-value">{formatDuration(elapsed)}</span>
          <span className="giro-session-hud__metric-label">tempo trascorso</span>
        </div>
        <div className="giro-session-hud__metric">
          <span className="giro-session-hud__metric-value">{remaining}</span>
          <span className="giro-session-hud__metric-label">arnie rimanenti</span>
        </div>
      </div>

      <div
        className="giro-session-hud__bar"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-label={`Arnia ${current} di ${total}`}
      >
        <span className="giro-session-hud__bar-fill" style={{ width: `${progress}%` }} />
      </div>
    </section>
  )
}
