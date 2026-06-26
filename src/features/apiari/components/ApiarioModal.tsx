import { Modal } from '../../../components/ui/Modal'
import { ApiarioForm } from './ApiarioForm'
import type { ApiarioInput, ApiarioView } from '../types'
import './ApiarioModal.css'

type ApiarioModalProps = {
  open: boolean
  apiario?: ApiarioView
  onClose: () => void
  onSubmit: (data: ApiarioInput) => Promise<void>
}

export function ApiarioModal({ open, apiario, onClose, onSubmit }: ApiarioModalProps) {
  const isEdit = Boolean(apiario)

  const handleSubmit = async (data: ApiarioInput) => {
    try {
      await onSubmit(data)
      onClose()
    } catch {
      // ApiarioForm mostra l'errore inline
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Modifica Apiario' : 'Nuovo Apiario'}
    >
      <div className="apiario-modal">
        <ApiarioForm
          key={apiario?.id ?? 'new'}
          initial={apiario}
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitLabel="Salva"
        />
      </div>
    </Modal>
  )
}
