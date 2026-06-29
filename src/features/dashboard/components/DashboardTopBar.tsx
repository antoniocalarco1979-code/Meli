import { Bell, Hexagon, User } from 'lucide-react'
import './DashboardTopBar.css'

export function DashboardTopBar() {
  return (
    <header className="dashboard-topbar" aria-label="Barra superiore dashboard">
      <div className="dashboard-topbar__brand">
        <span className="dashboard-topbar__logo" aria-hidden="true">
          <Hexagon size={22} strokeWidth={1.75} />
        </span>
        <div>
          <p className="dashboard-topbar__name">MELI</p>
          <p className="dashboard-topbar__tag">Gestione Apiario</p>
        </div>
      </div>

      <div className="dashboard-topbar__actions">
        <button type="button" className="dashboard-topbar__btn" aria-label="Notifiche">
          <Bell size={20} strokeWidth={1.75} />
          <span className="dashboard-topbar__badge" aria-hidden="true" />
        </button>
        <button type="button" className="dashboard-topbar__profile" aria-label="Profilo utente">
          <User size={20} strokeWidth={1.75} />
        </button>
      </div>
    </header>
  )
}
