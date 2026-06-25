import { motion } from 'framer-motion'
import { Hexagon, Settings } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { appRoutes } from '../../router/config'
import './Sidebar.css'

export function Sidebar() {
  return (
    <motion.aside
      className="sidebar"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="sidebar__brand">
        <div className="sidebar__logo" aria-hidden="true">
          <Hexagon size={28} strokeWidth={1.5} />
        </div>
        <div className="sidebar__brand-text">
          <span className="sidebar__name">MELI</span>
          <span className="sidebar__tag">Gestione Apiario</span>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Navigazione principale">
        <ul>
          {appRoutes.map(({ path, label, icon: Icon, end }, index) => (
            <motion.li
              key={path}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + index * 0.04, duration: 0.35 }}
            >
              <NavLink
                to={path}
                end={end}
                className={({ isActive }) =>
                  `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
                }
              >
                <Icon size={24} strokeWidth={1.65} aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            </motion.li>
          ))}
        </ul>
      </nav>

      <div className="sidebar__footer">
        <button type="button" className="sidebar__link sidebar__link--muted">
          <Settings size={24} strokeWidth={1.65} aria-hidden="true" />
          <span>Impostazioni</span>
        </button>
      </div>
    </motion.aside>
  )
}
