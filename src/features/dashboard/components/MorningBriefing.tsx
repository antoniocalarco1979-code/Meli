import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronDown, MapPin } from '../../../theme/icons'
import './MorningBriefing.css'

type MorningBriefingProps = {
  userName: string
  totalArnie: number
  trattamentiInScadenza: number
  regineDaSostituire: number
  weatherHint?: string
  loading?: boolean
  selectedApiarioName?: string
  onSelectApiario?: () => void
  onStartGiro: () => void
}

type BriefingRowProps = {
  emoji: string
  count?: number
  label: string
  loading?: boolean
}

function BriefingRow({ emoji, count, label, loading }: BriefingRowProps) {
  return (
    <li className="morning-briefing__item">
      <span className="morning-briefing__emoji" aria-hidden="true">
        {emoji}
      </span>
      <span className="morning-briefing__item-text">
        {count !== undefined && (
          <>
            <strong className="morning-briefing__count">
              {loading ? '—' : count}
            </strong>{' '}
          </>
        )}
        {label}
      </span>
    </li>
  )
}

const QUICK_LINKS = [
  { to: '/apiari', label: 'Apiari' },
  { to: '/visite', label: 'Visite' },
  { to: '/produzione', label: 'Produzione' },
  { to: '/report', label: 'Report' },
] as const

export function MorningBriefing({
  userName,
  totalArnie,
  trattamentiInScadenza,
  regineDaSostituire,
  weatherHint = 'Meteo ideale',
  loading = false,
  selectedApiarioName,
  onSelectApiario,
  onStartGiro,
}: MorningBriefingProps) {
  return (
    <motion.section
      className="morning-briefing meli-glass meli-glass--deep"
      aria-label="Riepilogo giornaliero"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <header className="morning-briefing__brand">
        <p className="morning-briefing__logo">
          <span aria-hidden="true">🐝</span> MELI
        </p>
        <p className="morning-briefing__byline">by RANU</p>
      </header>

      <h1 className="morning-briefing__greeting">Buongiorno {userName}</h1>

      <p className="morning-briefing__lead">Oggi hai:</p>

      <ul className="morning-briefing__list">
        <BriefingRow
          emoji="🐝"
          count={totalArnie}
          label={totalArnie === 1 ? 'arnia' : 'arnie'}
          loading={loading}
        />
        <BriefingRow
          emoji="⚠"
          count={trattamentiInScadenza}
          label={trattamentiInScadenza === 1 ? 'trattamento' : 'trattamenti'}
          loading={loading}
        />
        <BriefingRow
          emoji="👑"
          count={regineDaSostituire}
          label={regineDaSostituire === 1 ? 'regina da sostituire' : 'regine da sostituire'}
          loading={loading}
        />
        <BriefingRow emoji="🌤" label={weatherHint} />
      </ul>

      {onSelectApiario && (
        <button
          type="button"
          className="morning-briefing__apiario-select"
          onClick={onSelectApiario}
          disabled={loading}
        >
          <MapPin size={20} strokeWidth={1.75} aria-hidden="true" />
          <span className="morning-briefing__apiario-label">
            {selectedApiarioName ?? 'Seleziona apiario'}
          </span>
          <ChevronDown size={18} className="morning-briefing__apiario-chevron" aria-hidden="true" />
        </button>
      )}

      <hr className="morning-briefing__divider" aria-hidden="true" />

      <motion.button
        type="button"
        className="morning-briefing__cta"
        onClick={onStartGiro}
        disabled={loading}
        whileHover={{
          scale: 1.02,
          boxShadow: 'var(--meli-shadow-button)',
          transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
        }}
        whileTap={{ scale: 0.975 }}
      >
        <span className="morning-briefing__cta-shine" aria-hidden="true" />
        <span className="morning-briefing__cta-play" aria-hidden="true">
          ▶
        </span>
        <span>Inizia giro apiario</span>
      </motion.button>

      <hr className="morning-briefing__divider" aria-hidden="true" />

      <nav className="morning-briefing__nav" aria-label="Collegamenti rapidi">
        {QUICK_LINKS.map((link, index) => (
          <span key={link.to} className="morning-briefing__nav-item">
            {index > 0 && (
              <span className="morning-briefing__nav-sep" aria-hidden="true">
                |
              </span>
            )}
            <Link to={link.to} className="morning-briefing__nav-link">
              {link.label}
            </Link>
          </span>
        ))}
      </nav>
    </motion.section>
  )
}
