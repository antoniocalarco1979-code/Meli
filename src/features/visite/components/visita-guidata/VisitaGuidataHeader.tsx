import { X } from 'lucide-react'
import { useElapsedSeconds } from '../../hooks/useElapsedSeconds'
import { formatVisitaDuration } from '../../types/visitaGuidata.types'
import '../ispezione-engine/ispezione-engine.css'
import './visita-guidata.css'

type VisitaGuidataHeaderProps = {
  arniaNumero: string
  apiarioNome?: string
  startedAt: number | null
  onClose: () => void
}

export function VisitaGuidataHeader({
  arniaNumero,
  apiarioNome,
  startedAt,
  onClose,
}: VisitaGuidataHeaderProps) {
  const elapsed = useElapsedSeconds(startedAt ?? Date.now(), Boolean(startedAt))

  return (
    <header className="ispezione-header visita-guidata-header">
      <button
        type="button"
        className="ispezione-header__close"
        onClick={onClose}
        aria-label="Chiudi visita"
      >
        <X size={24} strokeWidth={2} />
      </button>

      <div className="ispezione-header__brand">
        <p className="ispezione-header__arnia">
          <span aria-hidden="true">🐝</span> ARNIA {arniaNumero}
        </p>
        {apiarioNome && (
          <p
            className="ispezione-header__mode"
            style={{ letterSpacing: '0.06em', textTransform: 'none' }}
          >
            {apiarioNome}
          </p>
        )}
        <p className="ispezione-header__mode">VISITA GUIDATA · 1A.1</p>
      </div>

      {startedAt ? (
        <div className="visita-guidata-header__timer" aria-live="polite">
          <span className="visita-guidata-header__timer-value">{formatVisitaDuration(elapsed)}</span>
        </div>
      ) : (
        <div className="visita-guidata-header__timer visita-guidata-header__timer--idle" aria-hidden="true" />
      )}
    </header>
  )
}
