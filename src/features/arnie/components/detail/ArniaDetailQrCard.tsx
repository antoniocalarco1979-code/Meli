import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { Arnia } from '../../../../database/types'
import { ensureArniaQrIdentity } from '../../../../database/services/arnieService'
import { Button } from '../../../../components/ui/Button'
import { Modal } from '../../../../components/ui/Modal'
import { downloadArniaQrPng, printArniaQrLabel } from '../../services/arniaQrService'
import { MeliQrCode } from '../qr/MeliQrCode'
import './ArniaDetailQrCard.css'

type ArniaDetailQrCardProps = {
  arnia: Arnia
  apiarioNome?: string
}

export function ArniaDetailQrCard({ arnia: initialArnia, apiarioNome }: ArniaDetailQrCardProps) {
  const [arnia, setArnia] = useState(initialArnia)
  const [preparing, setPreparing] = useState(true)
  const [viewOpen, setViewOpen] = useState(false)
  const [busy, setBusy] = useState<'png' | 'print' | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    setArnia(initialArnia)
  }, [initialArnia])

  useEffect(() => {
    let cancelled = false

    setPreparing(true)
    setError('')

    void ensureArniaQrIdentity(initialArnia.id)
      .then((updated) => {
        if (!cancelled) setArnia(updated)
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Impossibile preparare il QR Code.')
        }
      })
      .finally(() => {
        if (!cancelled) setPreparing(false)
      })

    return () => {
      cancelled = true
    }
  }, [initialArnia.id])

  const context = { arnia, apiarioNome }

  const runAction = async (action: 'png' | 'print') => {
    setBusy(action)
    setError('')
    try {
      if (action === 'png') await downloadArniaQrPng(context)
      if (action === 'print') await printArniaQrLabel(context)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operazione non riuscita.')
    } finally {
      setBusy(null)
    }
  }

  return (
    <>
      <motion.section
        className="arnia-detail-qr-card meli-glass meli-glass--deep"
        aria-labelledby={`arnia-detail-qr-card-${arnia.id}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.04 }}
      >
        <h2 id={`arnia-detail-qr-card-${arnia.id}`} className="arnia-detail-qr-card__title">
          📱 QR CODE
        </h2>

        <div className="arnia-detail-qr-card__body">
          <div className="arnia-detail-qr-card__qr-wrap" aria-busy={preparing}>
            {preparing ? (
              <p className="arnia-detail-qr-card__loading">Generazione QR…</p>
            ) : (
              <MeliQrCode
                value={arnia.publicUuid}
                size={200}
                title={`QR Code arnia ${arnia.numero}`}
              />
            )}
          </div>

          <div className="arnia-detail-qr-card__uuid-block">
            <span className="arnia-detail-qr-card__uuid-label">UUID</span>
            <code className="arnia-detail-qr-card__uuid">
              {preparing ? '—' : arnia.publicUuid}
            </code>
          </div>
        </div>

        {error && <p className="arnia-detail-qr-card__error">{error}</p>}

        <div className="arnia-detail-qr-card__actions">
          <Button
            type="button"
            variant="secondary"
            size="md"
            disabled={preparing || busy !== null}
            onClick={() => setViewOpen(true)}
          >
            Visualizza grande
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="md"
            disabled={preparing || busy !== null}
            onClick={() => void runAction('png')}
          >
            {busy === 'png' ? 'Download…' : 'Scarica PNG'}
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            disabled={preparing || busy !== null}
            onClick={() => void runAction('print')}
          >
            {busy === 'print' ? 'Preparazione…' : 'Stampa'}
          </Button>
        </div>
      </motion.section>

      <Modal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title={`QR Code · Arnia ${arnia.numero}`}
      >
        <div className="arnia-detail-qr-card__modal">
          <MeliQrCode value={arnia.publicUuid} size={320} title={`QR Code arnia ${arnia.numero}`} />
          <code className="arnia-detail-qr-card__modal-uuid">{arnia.publicUuid}</code>
        </div>
      </Modal>
    </>
  )
}
