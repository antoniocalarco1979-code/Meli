import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Arnia } from '../../../../database/types'
import { Button } from '../../../../components/ui/Button'
import { Modal } from '../../../../components/ui/Modal'
import { printArniaQrLabel } from '../../services/arniaQrService'
import { MeliQrCode } from '../qr/MeliQrCode'
import './ArniaDetailQrStrip.css'

type ArniaDetailQrStripProps = {
  arnia: Arnia
  apiarioNome?: string
}

export function ArniaDetailQrStrip({ arnia, apiarioNome }: ArniaDetailQrStripProps) {
  const [viewOpen, setViewOpen] = useState(false)
  const [printing, setPrinting] = useState(false)
  const [error, setError] = useState('')

  const handlePrint = async () => {
    setPrinting(true)
    setError('')
    try {
      await printArniaQrLabel({ arnia, apiarioNome })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Stampa non riuscita.')
    } finally {
      setPrinting(false)
    }
  }

  return (
    <>
      <motion.section
        className="arnia-detail-qr meli-glass meli-glass--deep"
        aria-labelledby={`arnia-detail-qr-${arnia.id}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.03 }}
      >
        <div className="arnia-detail-qr__head">
          <h2 id={`arnia-detail-qr-${arnia.id}`} className="arnia-detail-qr__title">
            QR Code
          </h2>
          <div className="arnia-detail-qr__preview" aria-hidden="true">
            <MeliQrCode value={arnia.qrCode} size={72} title="" />
          </div>
        </div>

        {error && <p className="arnia-detail-qr__error">{error}</p>}

        <div className="arnia-detail-qr__actions">
          <Button type="button" variant="secondary" size="md" onClick={() => setViewOpen(true)}>
            Visualizza
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            disabled={printing}
            onClick={() => void handlePrint()}
          >
            {printing ? 'Preparazione…' : 'Stampa'}
          </Button>
        </div>
      </motion.section>

      <Modal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title={`QR Code · Arnia ${arnia.numero}`}
      >
        <div className="arnia-detail-qr__modal">
          <MeliQrCode value={arnia.qrCode} size={260} title={`QR arnia ${arnia.numero}`} />
          <code className="arnia-detail-qr__code">{arnia.qrCode}</code>
        </div>
      </Modal>
    </>
  )
}
