import { motion } from 'framer-motion'
import { Hexagon, Settings } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { visibleAppRoutes } from '../../app/router/config'
import { useAppPath } from '../../demo/useAppPath'
import '../../demo/demo.css'
import './Sidebar.css'

export function Sidebar() {
  const { pathname } = useLocation()
  const appPath = useAppPath()
  const isDemoActive = pathname === '/demo' || pathname.startsWith('/demo/')

  const linkFor = (path: string, end?: boolean) => {
    if (!isDemoActive) return { to: path, end }
    if (path === '/') return { to: '/demo/dashboard', end: true }
    return { to: `/demo${path}`, end }
  }

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
          {visibleAppRoutes.map(({ path, label, icon: Icon, emoji, end }, index) => {
            const route = linkFor(path, end)
            return (
            <motion.li
              key={path}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + index * 0.04, duration: 0.35 }}
            >
              <NavLink
                to={route.to}
                end={route.end}
                className={({ isActive }) =>
                  `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
                }
              >
                {emoji ? (
                  <span className="sidebar__emoji" aria-hidden="true">
                    {emoji}
                  </span>
                ) : (
                  <Icon size={24} strokeWidth={1.65} aria-hidden="true" />
                )}
                <span>{label}</span>
              </NavLink>
            </motion.li>
            )
          })}
        </ul>

        <ul className="sidebar__demo">
          <li>
            <NavLink
              to="/demo"
              end
              className={() =>
                `sidebar__link sidebar__link--demo${isDemoActive ? ' sidebar__link--active' : ''}`
              }
            >
              <span aria-hidden="true">🚧</span>
              <span>Demo</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="sidebar__footer">
        <NavLink
          to={appPath('/impostazioni')}
          className={({ isActive }) =>
            `sidebar__link sidebar__link--muted${isActive ? ' sidebar__link--active' : ''}`
          }
        >
          <Settings size={24} strokeWidth={1.65} aria-hidden="true" />
          <span>Impostazioni</span>
        </NavLink>
      </div>
    </motion.aside>
  )
}
