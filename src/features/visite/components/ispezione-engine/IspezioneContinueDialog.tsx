import { Modal } from '../../../../components/ui/Modal'
import './ispezione-engine.css'

type IspezioneContinueDialogProps = {
  open: boolean
  hasNextArnia: boolean
  onContinue: () => void
  onFinish: () => void
}

export function IspezioneContinueDialog({
  open,
  hasNextArnia,
  onContinue,
  onFinish,
}: IspezioneContinueDialogProps) {
  return (
    <Modal open={open} onClose={onFinish} title="Ispezione completata">
      <div className="ispezione-dialog">
        <p className="ispezione-dialog__text">
          Vuoi iniziare l&apos;ispezione dell&apos;arnia successiva?
        </p>
        <div className="ispezione-dialog__actions">
          {hasNextArnia && (
            <button type="button" className="ispezione-dialog__btn ispezione-dialog__btn--primary" onClick={onContinue}>
              <span aria-hidden="true">▶</span> Continua
            </button>
          )}
          <button type="button" className="ispezione-dialog__btn ispezione-dialog__btn--ghost" onClick={onFinish}>
            <span aria-hidden="true">✓</span> Termina giro
          </button>
        </div>
      </div>
    </Modal>
  )
}
