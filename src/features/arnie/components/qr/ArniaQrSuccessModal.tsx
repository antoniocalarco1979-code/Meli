import { Modal } from '../../../../components/ui/Modal'
import { Button } from '../../../../components/ui/Button'
import type { Arnia } from '../../../../database/types'
import { ArniaQrSection } from './ArniaQrSection'
import './ArniaQrSuccessModal.css'

type ArniaQrSuccessModalProps = {
  open: boolean
  arnia: Arnia | null
  apiarioNome?: string
  onClose: () => void
}

export function ArniaQrSuccessModal({
  open,
  arnia,
  apiarioNome,
  onClose,
}: ArniaQrSuccessModalProps) {
  if (!arnia) return null

  return (
    <Modal open={open} onClose={onClose} title="Arnia creata con successo">
      <p className="arnia-qr-success__lead">
        UUID e QR Code generati automaticamente. Puoi scaricare l&apos;etichetta ora o ritrovarla
        nella scheda arnia e in Impostazioni → Gestione QR.
      </p>
      <ArniaQrSection arnia={arnia} apiarioNome={apiarioNome} compact />
      <div className="arnia-qr-success__footer">
        <Button type="button" variant="primary" size="md" onClick={onClose}>
          Chiudi
        </Button>
      </div>
    </Modal>
  )
}
