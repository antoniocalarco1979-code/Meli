import { X } from 'lucide-react'
import './ispezione-engine.css'

type IspezioneHeaderProps = {
  arniaNumero: string
  onClose: () => void
}

export function IspezioneHeader({ arniaNumero, onClose }: IspezioneHeaderProps) {
  return (
    <header className="ispezione-header">
      <button type="button" className="ispezione-header__close" onClick={onClose} aria-label="Chiudi ispezione">
        <X size={24} strokeWidth={2} />
      </button>

      <div className="ispezione-header__brand">
        <p className="ispezione-header__arnia">
          <span aria-hidden="true">🐝</span> ARNIA {arniaNumero}
        </p>
        <p className="ispezione-header__mode">ISPEZIONE</p>
      </div>
    </header>
  )
}
