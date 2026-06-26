import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'
import './Modal.css'

type ModalVariant = 'default' | 'fullscreen'

type ModalProps = {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  variant?: ModalVariant
}

export function Modal({
  open,
  onClose,
  title,
  children,
  variant = 'default',
}: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className={`ui-modal${variant === 'fullscreen' ? ' ui-modal--fullscreen' : ''}`}
      role="presentation"
      onClick={variant === 'default' ? onClose : undefined}
    >
      <div
        className="ui-modal__dialog meli-glass meli-glass--deep"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="ui-modal__header">
          {title && <h2 className="ui-modal__title">{title}</h2>}
          <button type="button" className="ui-modal__close" onClick={onClose} aria-label="Chiudi">
            <X size={22} />
          </button>
        </header>
        <div className="ui-modal__body">{children}</div>
      </div>
    </div>
  )
}
