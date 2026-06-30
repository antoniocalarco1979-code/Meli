import { NavLink } from 'react-router-dom'
import { Hexagon, Map, QrCode, Settings } from 'lucide-react'
import { useAppPath } from '../../../demo/useAppPath'
import './AltroPage.css'

const QUICK_LINKS = [
  { path: '/arnie', label: 'Arnie', icon: Hexagon },
  { path: '/mappa-apiari', label: 'Mappa Apiari', icon: Map },
] as const

export function AltroPage() {
  const appPath = useAppPath()

  return (
    <div className="altro-page">
      <div className="altro-page__inner">
        <section className="altro-page__section" aria-labelledby="altro-moduli">
          <h2 id="altro-moduli" className="altro-page__heading meli-label">
            Accesso rapido
          </h2>
          <ul className="altro-page__grid">
            {QUICK_LINKS.map(({ path, label, icon: Icon }) => (
              <li key={path}>
                <NavLink to={appPath(path)} className="altro-page__link meli-glass">
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
          <ul className="altro-page__grid altro-page__grid--app">
            <li>
              <NavLink to={appPath('/impostazioni')} className="altro-page__link meli-glass">
                <Settings size={24} strokeWidth={1.65} aria-hidden="true" />
                <span>Impostazioni</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={appPath('/impostazioni/gestione-qr')}
                className="altro-page__link meli-glass"
              >
                <QrCode size={24} strokeWidth={1.65} aria-hidden="true" />
                <span>Gestione QR</span>
              </NavLink>
            </li>
          </ul>
        </section>

        <p className="altro-page__note meli-glass">
          Moduli Visite, Regine, Trattamenti, Produzione, Magazzino e Report saranno disponibili
          nei prossimi aggiornamenti.
        </p>
      </div>
    </div>
  )
}
