import { NavLink } from 'react-router-dom'
import { ChevronRight, QrCode, Settings } from 'lucide-react'
import { useAppPath } from '../../../demo/useAppPath'
import './ImpostazioniPage.css'

const SETTINGS_LINKS = [
  {
    path: '/impostazioni/gestione-qr',
    label: 'Gestione QR',
    description: 'Visualizza, rigenera e ristampa i QR Code delle arnie.',
    icon: QrCode,
  },
] as const

export function ImpostazioniPage() {
  const appPath = useAppPath()

  return (
    <div className="impostazioni-page">
      <div className="impostazioni-page__inner">
        <header className="impostazioni-page__hero meli-glass meli-glass--deep">
          <Settings size={28} strokeWidth={1.65} aria-hidden="true" />
          <div>
            <h1 className="impostazioni-page__title">Impostazioni</h1>
            <p className="impostazioni-page__subtitle">Configurazione e strumenti MELI</p>
          </div>
        </header>

        <section aria-labelledby="impostazioni-tools">
          <h2 id="impostazioni-tools" className="impostazioni-page__heading meli-label">
            Strumenti
          </h2>
          <ul className="impostazioni-page__list">
            {SETTINGS_LINKS.map(({ path, label, description, icon: Icon }) => (
              <li key={path}>
                <NavLink to={appPath(path)} className="impostazioni-page__link meli-glass meli-glass--deep">
                  <span className="impostazioni-page__link-icon" aria-hidden="true">
                    <Icon size={24} strokeWidth={1.65} />
                  </span>
                  <span className="impostazioni-page__link-text">
                    <strong>{label}</strong>
                    <span>{description}</span>
                  </span>
                  <ChevronRight size={22} aria-hidden="true" />
                </NavLink>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
