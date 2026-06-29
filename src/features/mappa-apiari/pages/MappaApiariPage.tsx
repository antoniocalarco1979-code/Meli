import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { EmptyState } from '../../../components/ui/EmptyState/EmptyState'
import { LoadingScreen } from '../../../components/ui/LoadingScreen'
import { useAppPath } from '../../../demo/useAppPath'
import { ApiariInteractiveMap } from '../components/ApiariInteractiveMap'
import { useMappaApiari } from '../hooks/useMappaApiari'
import { MAPPA_APIARI_FUTURE_CAPABILITIES } from '../types'
import './MappaApiariPage.css'

export function MappaApiariPage() {
  const navigate = useNavigate()
  const appPath = useAppPath()
  const { data, loading } = useMappaApiari()

  if (loading || !data) {
    return <LoadingScreen label="Caricamento mappa apiari…" />
  }

  const hasApiari = data.totaleApiari > 0
  const hasMarkers = data.markers.length > 0

  return (
    <motion.div
      className="mappa-apiari-page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <header className="mappa-apiari-page__header">
        <h1 className="mappa-apiari-page__title">Mappa Apiari</h1>
        <p className="mappa-apiari-page__subtitle">
          Visualizza i tuoi siti apistici sulla mappa e apri rapidamente ogni apiario.
        </p>
      </header>

      {!hasApiari ? (
        <EmptyState title="Nessun apiario presente." />
      ) : (
        <>
          {!hasMarkers && (
            <p className="mappa-apiari-page__notice">
              Nessun apiario ha coordinate GPS salvate. Aggiungi la posizione durante la creazione dell&apos;apiario.
            </p>
          )}

          {hasMarkers && (
            <div className="mappa-apiari-page__map-wrap">
              <ApiariInteractiveMap
                markers={data.markers}
                onOpenApiario={(apiarioId) => navigate(appPath(`/apiari/${apiarioId}`))}
              />
            </div>
          )}

          <section className="mappa-apiari-page__future meli-glass meli-glass--deep" aria-label="Funzioni future">
            <h2 className="mappa-apiari-page__future-title">Funzioni in preparazione</h2>
            <ul className="mappa-apiari-page__future-list">
              {MAPPA_APIARI_FUTURE_CAPABILITIES.map((capability) => (
                <li key={capability.id} className="mappa-apiari-page__future-item" title={capability.description}>
                  {capability.label}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </motion.div>
  )
}
