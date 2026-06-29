import { motion } from 'framer-motion'
import { Camera, ChevronRight, Droplets, QrCode } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppPath } from '../../../demo/useAppPath'
import type { ArniaListItem } from '../types'
import { SaluteSemaforo } from './SaluteSemaforo'
import './ArniaCard.css'

type ArniaCardProps = {
  item: ArniaListItem
  index?: number
  compact?: boolean
}

export function ArniaCard({ item, index = 0, compact = false }: ArniaCardProps) {
  const appPath = useAppPath()
  const { arnia, coverFoto, salute, reginaLabel, ultimaVisitaLabel, produzioneAnnoLabel } = item
  const displayName = arnia.nome ?? `Arnia ${arnia.numero}`

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      whileTap={{ scale: 0.985 }}
    >
      <Link
        to={appPath(`/arnie/${arnia.id}`)}
        className={`arnia-card meli-glass meli-glass--deep${compact ? ' arnia-card--compact' : ''}`}
        aria-label={`Apri ${displayName}`}
      >
        <div className="arnia-card__photo">
          {coverFoto ? (
            <img src={coverFoto} alt="" className="arnia-card__photo-img" loading="lazy" />
          ) : (
            <div className="arnia-card__photo-placeholder">
              <Camera size={36} strokeWidth={1.25} />
            </div>
          )}
          <span className="arnia-card__numero-badge">N. {arnia.numero}</span>
        </div>

        <div className="arnia-card__body">
          <div className="arnia-card__head">
            <h3 className="arnia-card__name">{displayName}</h3>
            <SaluteSemaforo value={salute} size="lg" />
          </div>

          <dl className="arnia-card__meta">
            <div>
              <dt>Ultima visita</dt>
              <dd>{ultimaVisitaLabel}</dd>
            </div>
            <div>
              <dt>Regina</dt>
              <dd>{reginaLabel}</dd>
            </div>
            <div>
              <dt>Produzione anno</dt>
              <dd>
                <Droplets size={16} aria-hidden="true" />
                {produzioneAnnoLabel}
              </dd>
            </div>
            {arnia.qrCode && (
              <div className="arnia-card__qr-row">
                <dt>QR Code</dt>
                <dd>
                  <QrCode size={16} aria-hidden="true" />
                  {arnia.qrCode}
                </dd>
              </div>
            )}
          </dl>

          <span className="arnia-card__cta">
            APRI
            <ChevronRight size={22} strokeWidth={2.5} aria-hidden="true" />
          </span>
        </div>
      </Link>
    </motion.article>
  )
}
