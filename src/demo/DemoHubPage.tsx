import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { useAppPath } from './useAppPath'
import './demo.css'

const DEMO_SECTIONS = [
  {
    title: 'Dashboard',
    description: 'Panoramica KPI, mappa apiario e azioni consigliate.',
    path: '/dashboard',
    emoji: '📊',
  },
  {
    title: 'Apiario',
    description: 'Elenco apiari e scheda con flusso visite.',
    path: '/apiari',
    emoji: '📍',
  },
  {
    title: 'Elenco Arnie',
    description: 'Tutte le colonie demo con salute e ultima visita.',
    path: '/arnie',
    emoji: '🐝',
  },
  {
    title: 'Scheda Arnia',
    description: 'Dettaglio arnia 12 — regina, cronologia, ispezione.',
    path: '/arnie',
    emoji: '📋',
    hint: 'Apri Arnia 12 dall’elenco',
  },
  {
    title: 'Ispezione',
    description: 'Prototipo UX ispezione con telaini grafici.',
    path: '/arnie',
    emoji: '🔍',
    hint: 'Da scheda arnia → INIZIA ISPEZIONE',
  },
] as const

export function DemoHubPage() {
  const appPath = useAppPath()

  return (
    <main className="demo-hub">
      <header className="demo-hub__header">
        <p className="demo-hub__kicker">🚧 Demo Mode</p>
        <h1 className="demo-hub__title">Verifica sprint senza setup manuale</h1>
        <p className="demo-hub__lead">
          Esplora le schermate principali con dati dimostrativi precaricati. Ogni nuova
          funzionalità sarà disponibile anche qui, separata dai dati reali.
        </p>
      </header>

      <div className="demo-hub__grid">
        {DEMO_SECTIONS.map((section) => (
          <article key={section.title} className="demo-hub__card meli-glass meli-glass--deep">
            <span className="demo-hub__emoji" aria-hidden="true">
              {section.emoji}
            </span>
            <h2 className="demo-hub__card-title">{section.title}</h2>
            <p className="demo-hub__card-text">{section.description}</p>
            {'hint' in section && section.hint && (
              <p className="demo-hub__card-hint">{section.hint}</p>
            )}
            <Link to={appPath(section.path)} className="demo-hub__card-link">
              Apri →
            </Link>
          </article>
        ))}
      </div>

      <div className="demo-hub__actions">
        <Link to={appPath('/dashboard')}>
          <Button variant="primary" size="lg">
            Avvia tour demo
          </Button>
        </Link>
        <Link to="/">
          <Button variant="ghost" size="md">
            Torna all’app reale
          </Button>
        </Link>
      </div>
    </main>
  )
}
