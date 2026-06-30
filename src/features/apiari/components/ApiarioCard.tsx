import { motion } from 'framer-motion'
import { Calendar, Camera, Globe, Hexagon, MapPin, Pencil, Play, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppPath } from '../../../demo/useAppPath'
import type { ApiarioListCardData } from '../hooks/useApiariListCards'
import { APIARIO_STATUS_LABEL } from '../utils/apiarioStatus'
import './ApiarioCard.css'

type ApiarioCardProps = {
  card: ApiarioListCardData
  index?: number
  onEdit: (apiario: ApiarioListCardData['apiario']) => void
  onDelete: (apiario: ApiarioListCardData['apiario']) => void
}

export function ApiarioCard({ card, index = 0, onEdit, onDelete }: ApiarioCardProps) {
  const appPath = useAppPath()
  const { apiario, arnieCount, ultimaVisitaLabel, status, comuneLabel } = card

  return (
    <motion.article
      className="apiario-card meli-glass meli-glass--deep"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, boxShadow: 'var(--apiari-card-shadow-hover)' }}
    >
      <div className="apiario-card__photo">
        {apiario.foto ? (
          <img src={apiario.foto} alt="" className="apiario-card__photo-img" />
        ) : (
          <div className="apiario-card__photo-placeholder">
            <Camera size={36} strokeWidth={1.5} aria-hidden="true" />
            <span>📷 Foto</span>
          </div>
        )}
        <span
          className={`apiario-card__status apiario-card__status--${status}`}
          title={APIARIO_STATUS_LABEL[status]}
        >
          <span className="apiario-card__status-dot" aria-hidden="true" />
          {APIARIO_STATUS_LABEL[status]}
        </span>
      </div>

      <div className="apiario-card__body">
        <h2 className="apiario-card__name">
          <MapPin size={18} strokeWidth={1.75} aria-hidden="true" />
          {apiario.nome}
        </h2>

        <ul className="apiario-card__meta">
          <li>
            <Globe size={17} strokeWidth={1.75} aria-hidden="true" />
            <span>{comuneLabel}</span>
          </li>
          <li>
            <Hexagon size={17} strokeWidth={1.75} aria-hidden="true" />
            <span>
              🐝 {arnieCount} {arnieCount === 1 ? 'arnia' : 'arnie'}
            </span>
          </li>
          <li>
            <Calendar size={17} strokeWidth={1.75} aria-hidden="true" />
            <span>📅 Ultima visita: {ultimaVisitaLabel}</span>
          </li>
        </ul>

        <div className="apiario-card__actions">
          <Link to={appPath(`/apiari/${apiario.id}`)} className="apiario-card__action apiario-card__action--primary">
            <Play size={16} fill="currentColor" strokeWidth={0} aria-hidden="true" />
            Apri
          </Link>
          <button
            type="button"
            className="apiario-card__action apiario-card__action--secondary"
            onClick={() => onEdit(apiario)}
          >
            <Pencil size={16} strokeWidth={1.75} aria-hidden="true" />
            Modifica
          </button>
          <button
            type="button"
            className="apiario-card__action apiario-card__action--danger"
            onClick={() => onDelete(apiario)}
          >
            <Trash2 size={16} strokeWidth={1.75} aria-hidden="true" />
            Elimina
          </button>
        </div>
      </div>
    </motion.article>
  )
}
