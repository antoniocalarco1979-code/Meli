import { X } from 'lucide-react'
import '../ispezione-engine/ispezione-engine.css'

type VisitaGuidataHeaderProps = {
  arniaNumero: string
  apiarioNome?: string
  onClose: () => void
}

export function VisitaGuidataHeader({ arniaNumero, apiarioNome, onClose }: VisitaGuidataHeaderProps) {
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
        {apiarioNome && (
          <p className="ispezione-header__mode" style={{ letterSpacing: '0.06em', textTransform: 'none' }}>
            {apiarioNome}
          </p>
        )}
        <p className="ispezione-header__mode">VISITA GUIDATA</p>
      </div>
    </header>
  )
}
