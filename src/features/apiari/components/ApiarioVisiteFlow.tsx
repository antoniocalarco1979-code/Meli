import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { liveQuery } from 'dexie'
import { Loading } from '../../../components/ui/Loading'
import type { VisitaSaveSummary } from '../../arnie/services/visitaSaveService'
import { NuovaVisitaModal } from '../../arnie/components/NuovaVisitaModal'
import { getArnieEnrichedByApiarioId } from '../../arnie/services/arniaDetailService'
import type { ArniaListItem } from '../../arnie/types'
import {
  accumulateGiroStats,
  emptyGiroSessionStats,
  exportGiroReport,
  type GiroSessionStats,
} from '../services/giroReportService'
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
  const [arnie, setArnie] = useState<ArniaListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [visitaOpen, setVisitaOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [expandedIndex, setExpandedIndex] = useState(0)
  const [completedThrough, setCompletedThrough] = useState(-1)
  const [giroActive, setGiroActive] = useState(false)
  const [giroComplete, setGiroComplete] = useState(false)
  const [giroStats, setGiroStats] = useState<GiroSessionStats>(emptyGiroSessionStats)
  const stepRefs = useRef<Map<number, HTMLLIElement>>(new Map())

  useEffect(() => {
    const subscription = liveQuery(() => getArnieEnrichedByApiarioId(apiarioId)).subscribe({
      next: (data) => {
        setArnie(data)
        setLoading(false)
      },
      error: () => setLoading(false),
    })

    return () => subscription.unsubscribe()
  }, [apiarioId])

  const active = activeIndex !== null ? arnie[activeIndex] : undefined

  const scrollToStep = (index: number) => {
    window.setTimeout(() => {
      stepRefs.current.get(index)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }

  const expandStep = (index: number) => {
    setExpandedIndex(index)
    scrollToStep(index)
  }

  const openVisita = (index: number) => {
    expandStep(index)
    setActiveIndex(index)
    setVisitaOpen(true)
  }

  const startGiro = () => {
    if (arnie.length === 0) return
    setGiroActive(true)
    setGiroComplete(false)
    setGiroStats(emptyGiroSessionStats())
    setCompletedThrough(-1)
    openVisita(0)
  }

  const closeVisita = () => {
    setVisitaOpen(false)
    setActiveIndex(null)
  }

  const resetGiroView = () => {
    setGiroComplete(false)
    setGiroActive(false)
    setCompletedThrough(-1)
    setExpandedIndex(0)
    setGiroStats(emptyGiroSessionStats())
  }

  const handleSaved = (summary: VisitaSaveSummary) => {
    if (activeIndex === null) return

    if (giroActive) {
      setGiroStats((current) => accumulateGiroStats(current, summary))
    }

    setCompletedThrough(activeIndex)

    const nextIndex = activeIndex + 1
    if (nextIndex < arnie.length) {
      window.setTimeout(() => {
        expandStep(nextIndex)
        setActiveIndex(nextIndex)
        setVisitaOpen(true)
      }, 400)
      return
    }

    setActiveIndex(null)
    setVisitaOpen(false)

    if (giroActive) {
      setGiroComplete(true)
      setGiroActive(false)
      window.setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 200)
    }
  }

  if (loading) {
    return (
      <>
        <ApiarioGiroHero
          nome={apiarioNome}
          arnieCount={0}
          onIniziaGiro={startGiro}
          disabled
        />
        <section className="apiario-visite-flow meli-glass meli-glass--deep">
          <Loading size="md" label="Caricamento arnie…" />
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
          onIniziaGiro={startGiro}
          disabled={arnie.length === 0}
        />
      )}

      {giroComplete ? (
        <ApiarioGiroCompletato
          stats={giroStats}
          onExportReport={() => exportGiroReport(apiarioNome, giroStats)}
          onTornaPercorso={resetGiroView}
        />
      ) : arnie.length === 0 ? (
        <section className="apiario-visite-flow meli-glass meli-glass--deep">
          <p className="apiario-visite-flow__empty">Nessuna arnia in questo apiario.</p>
        </section>
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
              const isActive = activeIndex === index && visitaOpen
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
                        active={isActive}
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

      {active && (
        <NuovaVisitaModal
          open={visitaOpen}
          arniaId={active.arnia.id}
          arniaNumero={active.arnia.numero}
          apiarioNome={apiarioNome}
          onClose={closeVisita}
          onSaved={handleSaved}
        />
      )}
    </>
  )
}
