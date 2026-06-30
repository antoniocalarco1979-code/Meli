import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppPath } from '../../../demo/useAppPath'
import { generateId } from '../../../database/repositories/utils'
import type { ArniaListItem } from '../../arnie/types'
import type { ApiarioGiroLocationState, GiroReturnContext } from '../../visite/types/visitFlow.types'
import {
  createGiroSessionStats,
  emptyGiroSessionStats,
  type GiroSessionStats,
} from '../../visite/types/giro.types'

type UseApiarioGiroFlowOptions = {
  apiarioId: string
  apiarioNome: string
  arnie: ArniaListItem[]
  loading: boolean
}

export function useApiarioGiroFlow({
  apiarioId,
  apiarioNome,
  arnie,
  loading,
}: UseApiarioGiroFlowOptions) {
  const navigate = useNavigate()
  const appPath = useAppPath()
  const location = useLocation()
  const [expandedIndex, setExpandedIndex] = useState(0)
  const [completedThrough, setCompletedThrough] = useState(-1)
  const [giroActive, setGiroActive] = useState(false)
  const [giroComplete, setGiroComplete] = useState(false)
  const [giroStats, setGiroStats] = useState<GiroSessionStats>(() => emptyGiroSessionStats())
  const stepRefs = useRef<Map<number, HTMLLIElement>>(new Map())

  const scrollToStep = (index: number) => {
    window.setTimeout(() => {
      stepRefs.current.get(index)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }

  const expandStep = (index: number) => {
    setExpandedIndex(index)
    scrollToStep(index)
  }

  const navigateToArniaVisit = (
    index: number,
    options: {
      giroActive: boolean
      giroStats: GiroSessionStats
      completedThrough: number
    },
  ) => {
    const item = arnie[index]
    if (!item) return

    const giroReturn: GiroReturnContext = {
      apiarioId,
      apiarioNome,
      arniaIndex: index,
      giroActive: options.giroActive,
      giroStats: options.giroStats,
      completedThrough: options.completedThrough,
    }

    navigate(appPath(`/arnie/${item.arnia.id}`), {
      state: { openVisita: true, giroReturn },
    })
  }

  const openVisita = (index: number) => {
    expandStep(index)
    navigateToArniaVisit(index, {
      giroActive,
      giroStats,
      completedThrough,
    })
  }

  const startGiro = () => {
    if (arnie.length === 0) return
    const stats = createGiroSessionStats(arnie.length, generateId(), Date.now())
    setGiroActive(true)
    setGiroComplete(false)
    setGiroStats(stats)
    setCompletedThrough(-1)
    navigateToArniaVisit(0, {
      giroActive: true,
      giroStats: stats,
      completedThrough: -1,
    })
  }

  const resetGiroView = () => {
    setGiroComplete(false)
    setGiroActive(false)
    setCompletedThrough(-1)
    setExpandedIndex(0)
    setGiroStats(emptyGiroSessionStats())
  }

  useEffect(() => {
    if (loading || arnie.length === 0) return

    const state = location.state as ApiarioGiroLocationState | null
    const resume = state?.giroResume
    if (!resume) return

    window.history.replaceState({}, document.title)

    setGiroActive(resume.giroActive)
    setGiroStats(resume.giroStats)
    setCompletedThrough(resume.completedThrough)

    if (resume.giroActive && resume.nextIndex >= arnie.length) {
      setGiroComplete(true)
      setGiroActive(false)
      window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 200)
      return
    }

    if (resume.giroActive) {
      window.setTimeout(() => {
        navigateToArniaVisit(resume.nextIndex, {
          giroActive: true,
          giroStats: resume.giroStats,
          completedThrough: resume.completedThrough,
        })
      }, 400)
      return
    }

    expandStep(Math.min(resume.nextIndex, arnie.length - 1))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key, loading, arnie.length])

  return {
    expandedIndex,
    completedThrough,
    giroComplete,
    giroStats,
    stepRefs,
    openVisita,
    startGiro,
    resetGiroView,
    expandStep,
  }
}
