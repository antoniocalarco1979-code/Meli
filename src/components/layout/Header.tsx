import { useLocation } from 'react-router-dom'
import { Bell, Settings } from 'lucide-react'
import { resolveRouteMeta } from '../../app/router/config'
import './Header.css'

export function Header() {
  const { pathname } = useLocation()
  const meta = resolveRouteMeta(pathname)

  return (
    <header className="app-header meli-glass">
      <div className="app-header__info">
        <p className="app-header__eyebrow meli-label">MELI · Gestione Apiario</p>
        <h1 className="app-header__title">{meta.title}</h1>
        {meta.subtitle && <p className="app-header__subtitle">{meta.subtitle}</p>}
      </div>
      <div className="app-header__actions">
        <button type="button" className="app-header__btn" aria-label="Notifiche">
          <Bell size={22} strokeWidth={1.65} />
        </button>
        <button type="button" className="app-header__btn" aria-label="Impostazioni">
          <Settings size={22} strokeWidth={1.65} />
        </button>
      </div>
    </header>
  )
}
