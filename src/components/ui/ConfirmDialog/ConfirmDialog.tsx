import { useEffect } from 'react'
import { Button } from '../Button'
import './ConfirmDialog.css'

type ConfirmDialogProps = {
  open: boolean
  message: string
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
  onConfirm: () => void | Promise<void>
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  message,
  confirmLabel = 'Elimina',
  cancelLabel = 'Annulla',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="ui-confirm" role="presentation" onClick={onCancel}>
      <div
        className="ui-confirm__dialog meli-glass meli-glass--deep"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-message"
        onClick={(e) => e.stopPropagation()}
      >
        <p id="confirm-message" className="ui-confirm__message">
          {message}
        </p>
        <div className="ui-confirm__actions">
          <Button type="button" variant="ghost" size="md" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button type="button" variant="danger" size="md" onClick={onConfirm} disabled={loading}>
            {loading ? 'Eliminazione…' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

export type { ConfirmDialogProps }
