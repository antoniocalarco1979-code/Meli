import { motion } from 'framer-motion'
import { Camera, MapPin, Pencil, QrCode } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Apiario, Arnia } from '../../../database/types'
import { Button } from '../../../components/ui/Button'
import './ArniaHeader.css'

type ArniaHeaderProps = {
  arnia: Arnia
  apiario?: Apiario
  coverFoto?: string
  onEdit?: () => void
}

export function ArniaHeader({ arnia, apiario, coverFoto, onEdit }: ArniaHeaderProps) {
  const displayName = arnia.nome ?? `Arnia ${arnia.numero}`

  return (
    <motion.header
      className="arnia-header"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="arnia-header__photo-wrap">
        {coverFoto ? (
          <img src={coverFoto} alt="" className="arnia-header__photo" />
        ) : (
          <div className="arnia-header__photo-placeholder">
            <Camera size={56} strokeWidth={1.1} />
          </div>
        )}
      </div>

      <div className="arnia-header__body meli-glass meli-glass--deep">
        <div className="arnia-header__top">
          <div>
            <h1 className="arnia-header__name">{displayName}</h1>
            <p className="arnia-header__numero">Arnia N. {arnia.numero}</p>
          </div>
          {onEdit && (
            <Button variant="secondary" size="md" onClick={onEdit}>
              <Pencil size={20} aria-hidden="true" />
              Modifica
            </Button>
          )}
        </div>

        {apiario && (
          <Link to={`/apiari/${apiario.id}`} className="arnia-header__apiario">
            <MapPin size={18} aria-hidden="true" />
            {apiario.nome}
          </Link>
        )}

        {arnia.qrCode && (
          <div className="arnia-header__qr">
            <QrCode size={20} aria-hidden="true" />
            <span>{arnia.qrCode}</span>
          </div>
        )}
      </div>
    </motion.header>
  )
}
