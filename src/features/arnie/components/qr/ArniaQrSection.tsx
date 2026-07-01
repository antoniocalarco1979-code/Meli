import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { Arnia } from '../../../../database/types'
import { regenerateArniaQr } from '../../../../database/services/arnieService'
import { Button } from '../../../../components/ui/Button'
import { Modal } from '../../../../components/ui/Modal'
import {
  downloadArniaQrPdf,
  downloadArniaQrPng,
  printArniaQrLabel,
} from '../../services/arniaQrService'
import { MeliQrCode } from './MeliQrCode'
import './ArniaQrSection.css'

type ArniaQrSectionProps = {
  arnia: Arnia
  apiarioNome?: string
  showRegenerate?: boolean
  compact?: boolean
  onArniaUpdate?: (arnia: Arnia) => void
}

export function ArniaQrSection({
  arnia: initialArnia,
  apiarioNome,
  showRegenerate = false,
  compact = false,
  onArniaUpdate,
}: ArniaQrSectionProps) {
  const [arnia, setArnia] = useState(initialArnia)
  const [viewOpen, setViewOpen] = useState(false)
  const [busy, setBusy] = useState<'png' | 'pdf' | 'print' | 'regen' | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    setArnia(initialArnia)
  }, [initialArnia])

  const context = { arnia, apiarioNome }

  const runAction = async (action: 'png' | 'pdf' | 'print' | 'regen') => {
    setBusy(action)
    setError('')
    try {
      if (action === 'png') await downloadArniaQrPng(context)
      if (action === 'pdf') await downloadArniaQrPdf(context)
      if (action === 'print') await printArniaQrLabel(context)
      if (action === 'regen') {
        const updated = await regenerateArniaQr(arnia.id)
        setArnia(updated)
        onArniaUpdate?.(updated)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operazione non riuscita.')
    } finally {
      setBusy(null)
    }
  }

  return (
    <>
      <motion.section
        className={`arnia-qr-section meli-glass meli-glass--deep${compact ? ' arnia-qr-section--compact' : ''}`}
        aria-labelledby={`arnia-qr-title-${arnia.id}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <header className="arnia-qr-section__header">
          <h2 id={`arnia-qr-title-${arnia.id}`} className="arnia-qr-section__title">
            QR Code
          </h2>
          <p className="arnia-qr-section__subtitle">
            UUID permanente dell&apos;arnia — il codice QR contiene solo l&apos;UUID, valido anche offline.
          </p>
        </header>

        <div className="arnia-qr-section__body">
          <div className="arnia-qr-section__preview">
            <MeliQrCode
              value={arnia.publicUuid}
              size={compact ? 180 : 220}
              title={`QR Code arnia ${arnia.numero}`}
            />
          </div>

          <div className="arnia-qr-section__info">
            <p className="arnia-qr-section__arnia">
              Arnia {arnia.numero}
              {arnia.nome?.trim() ? ` · ${arnia.nome.trim()}` : ''}
            </p>
            {apiarioNome && <p className="arnia-qr-section__apiario">{apiarioNome}</p>}
            <div className="arnia-qr-section__uuid-block">
              <span className="arnia-qr-section__uuid-label">UUID</span>
              <code className="arnia-qr-section__uuid">{arnia.publicUuid}</code>
            </div>
          </div>
        </div>

        {error && <p className="arnia-qr-section__error">{error}</p>}

        <div className="arnia-qr-section__actions">
          <Button type="button" variant="secondary" size="md" onClick={() => setViewOpen(true)}>
            Visualizza
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="md"
            disabled={busy !== null}
            onClick={() => void runAction('png')}
          >
            {busy === 'png' ? 'Download…' : 'Scarica PNG'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="md"
            disabled={busy !== null}
            onClick={() => void runAction('pdf')}
          >
            {busy === 'pdf' ? 'Download…' : 'Scarica PDF'}
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            disabled={busy !== null}
            onClick={() => void runAction('print')}
          >
            {busy === 'print' ? 'Preparazione…' : 'Stampa'}
          </Button>
          {showRegenerate && (
            <Button
              type="button"
              variant="ghost"
              size="md"
              disabled={busy !== null}
              onClick={() => void runAction('regen')}
            >
              {busy === 'regen' ? 'Rigenerazione…' : 'Rigenera QR'}
            </Button>
          )}
        </div>
      </motion.section>

      <Modal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        title={`QR Code · Arnia ${arnia.numero}`}
      >
        <div className="arnia-qr-section__modal">
          <MeliQrCode value={arnia.publicUuid} size={280} title={`QR Code arnia ${arnia.numero}`} />
          <p className="arnia-qr-section__modal-code">{arnia.publicUuid}</p>
          <p className="arnia-qr-section__modal-hint">
            Scansiona dalla Home con «Scansiona QR» per aprire questa arnia, anche senza connessione.
          </p>
        </div>
      </Modal>
    </>
  )
}
