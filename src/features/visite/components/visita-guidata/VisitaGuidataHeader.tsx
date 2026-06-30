import { X } from 'lucide-react'
import '../ispezione-engine/ispezione-engine.css'
import './visita-guidata.css'

type VisitaGuidataHeaderProps = {
  arniaNumero: string
  apiarioNome?: string
  giroProgress?: {
    current: number
    total: number
    apiarioNome: string
  }
  onClose: () => void
}

export function VisitaGuidataHeader({
  arniaNumero,
  apiarioNome,
  giroProgress,
  onClose,
}: VisitaGuidataHeaderProps) {
  return (
    <header className="ispezione-header">
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
        {(giroProgress?.apiarioNome ?? apiarioNome) && (
          <p
            className="ispezione-header__mode"
            style={{ letterSpacing: '0.06em', textTransform: 'none' }}
          >
            {giroProgress?.apiarioNome ?? apiarioNome}
          </p>
        )}
        {giroProgress ? (
          <p className="visita-guidata-giro-badge" aria-live="polite">
            GIRO APIARIO · Arnia {giroProgress.current} di {giroProgress.total}
          </p>
        ) : (
          <p className="ispezione-header__mode">VISITA GUIDATA</p>
        )}
      </div>
    </header>
  )
}
