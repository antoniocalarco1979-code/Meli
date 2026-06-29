import { NavLink } from 'react-router-dom'
import { Settings } from 'lucide-react'
import { appRoutes } from '../../../app/router/config'
import './AltroPage.css'

const SECONDARY_PATHS = new Set([
  '/arnie',
  '/visite',
  '/regine',
  '/trattamenti',
  '/produzione',
  '/magazzino',
])

const secondaryRoutes = appRoutes.filter((route) => SECONDARY_PATHS.has(route.path))

export function AltroPage() {
  return (
    <div className="altro-page">
      <div className="altro-page__inner">
        <section className="altro-page__section" aria-labelledby="altro-moduli">
          <h2 id="altro-moduli" className="altro-page__heading meli-label">
            Moduli
          </h2>
          <ul className="altro-page__grid">
            {secondaryRoutes.map(({ path, label, icon: Icon }) => (
              <li key={path}>
                <NavLink to={path} className="altro-page__link meli-glass">
                  <Icon size={24} strokeWidth={1.65} aria-hidden="true" />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </section>

        <section className="altro-page__section" aria-labelledby="altro-app">
          <h2 id="altro-app" className="altro-page__heading meli-label">
            App
          </h2>
          <button type="button" className="altro-page__link meli-glass altro-page__link--muted">
            <Settings size={24} strokeWidth={1.65} aria-hidden="true" />
            <span>Impostazioni</span>
          </button>
        </section>
      </div>
    </div>
  )
}
