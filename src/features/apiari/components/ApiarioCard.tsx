import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Camera, Hexagon, MapPin, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import type { ApiarioView } from '../types'
import './ApiarioCard.css'

type ApiarioCardProps = {
  apiario: ApiarioView
  index?: number
  onEdit: (apiario: ApiarioView) => void
  onDelete: (apiario: ApiarioView) => void
}

export function ApiarioCard({ apiario, index = 0, onEdit, onDelete }: ApiarioCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  const createdLabel = new Date(apiario.createdAt).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <motion.article
      className="apiario-card meli-glass"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, boxShadow: 'var(--meli-shadow-lg)' }}
    >
      <div className="apiario-card__photo">
        {apiario.foto ? (
          <img src={apiario.foto} alt="" className="apiario-card__photo-img" />
        ) : (
          <div className="apiario-card__photo-placeholder">
            <Camera size={32} strokeWidth={1.5} />
            <span>📷 Foto</span>
          </div>
        )}
      </div>

      <div className="apiario-card__body">
        <div className="apiario-card__head">
          <h2 className="apiario-card__name">{apiario.nome}</h2>
          <div className="apiario-card__menu-wrap" ref={menuRef}>
            <button
              type="button"
              className="apiario-card__menu-btn"
              aria-label="Menu opzioni"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <MoreHorizontal size={22} />
            </button>
            {menuOpen && (
              <div className="apiario-card__menu meli-glass meli-glass--deep" role="menu">
                <button
                  type="button"
                  role="menuitem"
                  className="apiario-card__menu-item"
                  onClick={() => {
                    setMenuOpen(false)
                    onEdit(apiario)
                  }}
                >
                  <Pencil size={16} aria-hidden="true" />
                  Modifica
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="apiario-card__menu-item apiario-card__menu-item--danger"
                  onClick={() => {
                    setMenuOpen(false)
                    onDelete(apiario)
                  }}
                >
                  <Trash2 size={16} aria-hidden="true" />
                  Elimina
                </button>
              </div>
            )}
          </div>
        </div>

        <ul className="apiario-card__meta">
          <li>
            <MapPin size={18} strokeWidth={1.75} aria-hidden="true" />
            <span>{apiario.localita || '—'}</span>
          </li>
          <li>
            <Hexagon size={18} strokeWidth={1.75} aria-hidden="true" />
            <span>{apiario.numeroArnie} arnie</span>
          </li>
          <li>
            <Calendar size={18} strokeWidth={1.75} aria-hidden="true" />
            <span>{createdLabel}</span>
          </li>
        </ul>

        <Link to={`/apiari/${apiario.id}`} className="apiario-card__link">
          <Button variant="primary" size="md" fullWidth>
            Apri
          </Button>
        </Link>
      </div>
    </motion.article>
  )
}
