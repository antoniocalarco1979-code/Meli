import { NavLink, useLocation } from 'react-router-dom'
import { bottomNavItems, isBottomNavActive } from '../../app/router/config'
import './BottomNav.css'

export function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav className="bottom-nav meli-glass" aria-label="Navigazione principale">
      <ul className="bottom-nav__list">
        {bottomNavItems.map((item) => {
          const active = isBottomNavActive(pathname, item)
          return (
            <li key={item.path} className="bottom-nav__item">
              <NavLink
                to={item.path}
                end={item.end}
                className={`bottom-nav__link${active ? ' bottom-nav__link--active' : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                <span className="bottom-nav__emoji" aria-hidden="true">
                  {item.emoji}
                </span>
                <span className="bottom-nav__label">{item.label}</span>
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
