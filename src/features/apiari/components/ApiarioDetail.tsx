import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Hexagon, MapPin, Pencil } from 'lucide-react'
import { Button } from '../../../components/ui/Button'
import type { ApiarioView } from '../types'
import { formatApiarioLocation } from '../utils/formatApiarioLocation'
import './ApiarioDetail.css'

type ApiarioDetailProps = {
  apiario: ApiarioView
  onEdit?: () => void
  actions?: ReactNode
}

export function ApiarioDetail({ apiario, onEdit, actions }: ApiarioDetailProps) {
  const hasGps = apiario.latitudine != null && apiario.longitudine != null

  return (
    <motion.div
      className="apiario-detail"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {apiario.foto ? (
        <div className="apiario-detail__gallery meli-glass">
          <img src={apiario.foto} alt="" className="apiario-detail__photo" />
        </div>
      ) : (
        <div className="apiario-detail__no-photo meli-glass">Nessuna foto</div>
      )}

      <div className="apiario-detail__main meli-glass meli-glass--deep">
        <div className="apiario-detail__header">
          <div>
            <h1 className="apiario-detail__title">{apiario.nome}</h1>
            <p className="apiario-detail__location">
              <MapPin size={18} aria-hidden="true" />
              {formatApiarioLocation(apiario)}
            </p>
          </div>
          {onEdit && (
            <Button variant="secondary" size="md" onClick={onEdit}>
              <Pencil size={18} aria-hidden="true" />
              Modifica
            </Button>
          )}
        </div>

        <dl className="apiario-detail__stats">
          <div>
            <dt>
              <Hexagon size={16} aria-hidden="true" /> Arnie
            </dt>
            <dd>{apiario.numeroArnie}</dd>
          </div>
          <div>
            <dt>
              <Calendar size={16} aria-hidden="true" /> Creato
            </dt>
            <dd>{new Date(apiario.createdAt).toLocaleDateString('it-IT')}</dd>
          </div>
          {hasGps && (
            <div>
              <dt>
                <MapPin size={16} aria-hidden="true" /> Coordinate
              </dt>
              <dd>
                {apiario.latitudine}, {apiario.longitudine}
              </dd>
            </div>
          )}
          {apiario.indirizzo && (
            <div className="apiario-detail__stat-wide">
              <dt>Indirizzo</dt>
              <dd>{apiario.indirizzo}</dd>
            </div>
          )}
          {apiario.quota != null && (
            <div>
              <dt>Quota</dt>
              <dd>{apiario.quota} m</dd>
            </div>
          )}
        </dl>

        {apiario.note && (
          <div className="apiario-detail__notes">
            <h2>Note</h2>
            <p>{apiario.note}</p>
          </div>
        )}

        {actions && <div className="apiario-detail__actions">{actions}</div>}
      </div>
    </motion.div>
  )
}
