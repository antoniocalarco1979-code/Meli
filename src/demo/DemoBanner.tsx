import { Link } from 'react-router-dom'
import './demo.css'

export function DemoBanner() {
  return (
    <div className="demo-banner" role="status">
      <div className="demo-banner__content">
        <span className="demo-banner__icon" aria-hidden="true">
          🚧
        </span>
        <div className="demo-banner__text">
          <strong>Modalità Demo</strong>
          <span>Dati dimostrativi separati dal tuo apiario reale.</span>
        </div>
      </div>
      <Link to="/" className="demo-banner__exit">
        Esci demo
      </Link>
    </div>
  )
}

export function DemoBannerCompact() {
  return (
    <p className="demo-banner-compact" role="status">
      🚧 Stai navigando con dati demo isolati
    </p>
  )
}
