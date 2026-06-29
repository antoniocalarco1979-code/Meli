import { motion } from 'framer-motion'
import { MapPin, Pencil, QrCode } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Apiario, Arnia } from '../../../database/types'
import { Button } from '../../../components/ui/Button'
import './ArniaMetaBar.css'

type ArniaMetaBarProps = {
  arnia: Arnia
  apiario?: Apiario
  onEdit?: () => void
}

export function ArniaMetaBar({ arnia, apiario, onEdit }: ArniaMetaBarProps) {
  const displayName = arnia.nome ?? `Arnia ${arnia.numero}`

  return (
    <motion.div
      className="arnia-meta-bar meli-glass meli-glass--deep"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="arnia-meta-bar__top">
        <div>
          <h1 className="arnia-meta-bar__name">🐝 {displayName}</h1>
          <p className="arnia-meta-bar__numero">N. {arnia.numero}</p>
        </div>
        {onEdit && (
          <Button variant="secondary" size="md" onClick={onEdit}>
            <Pencil size={20} aria-hidden="true" />
            Modifica
          </Button>
        )}
      </div>

      {apiario && (
        <Link to={`/apiari/${apiario.id}`} className="arnia-meta-bar__apiario">
          <MapPin size={18} aria-hidden="true" />
          {apiario.nome}
        </Link>
      )}

      {arnia.qrCode && (
        <div className="arnia-meta-bar__qr">
          <QrCode size={20} aria-hidden="true" />
          <span>{arnia.qrCode}</span>
        </div>
      )}
    </motion.div>
  )
}
