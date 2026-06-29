import { X } from 'lucide-react'
import './visit-engine.css'

type VisitHeaderProps = {
  arniaNumero: string
  apiarioNome?: string
  onClose: () => void
}

export function VisitHeader({ arniaNumero, apiarioNome, onClose }: VisitHeaderProps) {
  return (
    <header className="visit-header">
      <button type="button" className="visit-header__close" onClick={onClose} aria-label="Chiudi visita">
        <X size={24} strokeWidth={2} />
      </button>
      <div className="visit-header__info">
        <p className="visit-header__eyebrow">Nuova visita</p>
        <h1 className="visit-header__title">Arnia {arniaNumero}</h1>
        {apiarioNome && <p className="visit-header__subtitle">{apiarioNome}</p>}
      </div>
    </header>
  )
}
