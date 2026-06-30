import { motion } from 'framer-motion'
import { ChevronDown } from '../../../theme/icons'
import { ErrorPage } from '../../../components/common/ErrorPage'
import { parseDexieError } from '../../../database/errors'
import { EmptyState } from '../../../components/ui/EmptyState'
import { PageSkeleton } from '../../../components/ui/Skeleton'
import { useArnieByApiarioId } from '../../arnie/hooks/useArnie'
import { exportGiroReport } from '../../visite/services/giroReportService'
import { useApiarioGiroFlow } from '../hooks/useApiarioGiroFlow'
import { ApiarioGiroCompletato } from './ApiarioGiroCompletato'
import { ApiarioGiroHero } from './ApiarioGiroHero'
import { ApiarioVisitaCard } from './ApiarioVisitaCard'
import { ApiarioVisitaRow } from './ApiarioVisitaRow'
import './ApiarioVisiteFlow.css'

type ApiarioVisiteFlowProps = {
  apiarioId: string
  apiarioNome: string
}

export function ApiarioVisiteFlow({ apiarioId, apiarioNome }: ApiarioVisiteFlowProps) {
  const { arnie, loading, error } = useArnieByApiarioId(apiarioId)
  const {
    expandedIndex,
    completedThrough,
    giroComplete,
    giroStats,
    starting,
    stepRefs,
    openVisita,
    startGiro,
    resetGiroView,
    expandStep,
  } = useApiarioGiroFlow({ apiarioId, apiarioNome, arnie, loading })

  if (error) {
    return (
      <ErrorPage
        title="Errore caricamento arnie"
        message={parseDexieError(error)}
        onRetry={() => window.location.reload()}
      />
    )
  }

  if (loading) {
    return (
      <>
        <ApiarioGiroHero
          nome={apiarioNome}
          arnieCount={0}
          onIniziaGiro={() => void startGiro()}
          disabled
        />
        <section className="apiario-visite-flow meli-glass meli-glass--deep">
          <PageSkeleton variant="list" />
        </section>
      </>
    )
  }

  return (
    <>
      {!giroComplete && (
        <ApiarioGiroHero
          nome={apiarioNome}
          arnieCount={arnie.length}
          onIniziaGiro={() => void startGiro()}
          disabled={arnie.length === 0 || starting}
        />
      )}

      {giroComplete ? (
        <ApiarioGiroCompletato
          stats={giroStats}
          onExportReport={() => exportGiroReport(apiarioNome, giroStats)}
          onTornaPercorso={resetGiroView}
        />
      ) : arnie.length === 0 ? (
        <EmptyState
          title="Nessuna arnia"
          description="Non ci sono arnie registrate in questo apiario."
        />
      ) : (
        <motion.section
          className="apiario-visite-flow meli-glass meli-glass--deep"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Percorso visite apiario"
        >
          <ol className="apiario-visite-flow__list">
            {arnie.map((item, index) => {
              const { arnia, salute, ultimaVisitaLabel } = item
              const isExpanded = index === expandedIndex
              const isDone = index <= completedThrough

              return (
                <li
                  key={arnia.id}
                  className="apiario-visite-flow__step"
                  ref={(el) => {
                    if (el) stepRefs.current.set(index, el)
                    else stepRefs.current.delete(index)
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.03 }}
                  >
                    {isExpanded ? (
                      <ApiarioVisitaCard
                        arniaId={arnia.id}
                        numero={arnia.numero}
                        salute={salute}
                        ultimaVisitaLabel={ultimaVisitaLabel}
                        active={false}
                        onVisita={() => openVisita(index)}
                      />
                    ) : (
                      <ApiarioVisitaRow
                        arniaId={arnia.id}
                        numero={arnia.numero}
                        done={isDone}
                        onSelect={() => expandStep(index)}
                      />
                    )}
                  </motion.div>

                  {index < arnie.length - 1 && (
                    <div className="apiario-visite-flow__arrow" aria-hidden="true">
                      <ChevronDown size={28} strokeWidth={2.5} />
                    </div>
                  )}
                </li>
              )
            })}
          </ol>
        </motion.section>
      )}
    </>
  )
}
