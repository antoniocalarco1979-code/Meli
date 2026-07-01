import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { parseDexieError } from '../../../database/errors'
import { useAppPath } from '../../../demo/useAppPath'
import { useToast } from '../../../hooks/useToast'
import type { ArniaListItem } from '../../arnie/types'
import type { ApiarioGiroLocationState, GiroReturnContext } from '../../visite/types/visitFlow.types'
import {
  buildGiroReturnForIndex,
  startGiroSession,
} from '../../visite/services/giroFlowService'
import {
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
  const toast = useToast()
  const [expandedIndex, setExpandedIndex] = useState(0)
  const [completedThrough, setCompletedThrough] = useState(-1)
  const [giroActive, setGiroActive] = useState(false)
  const [giroComplete, setGiroComplete] = useState(false)
  const [giroArniaIds, setGiroArniaIds] = useState<string[]>([])
  const [giroStats, setGiroStats] = useState<GiroSessionStats>(() => emptyGiroSessionStats())
  const [starting, setStarting] = useState(false)
  const autoStartHandled = useRef(false)
  const stepRefs = useRef<Map<number, HTMLLIElement>>(new Map())

  const arniaIds = giroArniaIds.length > 0 ? giroArniaIds : arnie.map((item) => item.arnia.id)

  const orderedArnie = useMemo(() => {
    if (giroArniaIds.length === 0) return arnie
    const byId = new Map(arnie.map((item) => [item.arnia.id, item]))
    return giroArniaIds
      .map((id) => byId.get(id))
      .filter((item): item is (typeof arnie)[number] => Boolean(item))
  }, [arnie, giroArniaIds])

  const scrollToStep = (index: number) => {
    window.setTimeout(() => {
      stepRefs.current.get(index)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }

  const expandStep = (index: number) => {
    setExpandedIndex(index)
    scrollToStep(index)
  }

  const navigateToArniaVisit = (index: number, giroReturn: GiroReturnContext) => {
    const arniaId = giroReturn.arniaIds?.[index] ?? arniaIds[index]
    if (!arniaId) return

    navigate(appPath(`/arnie/${arniaId}/visita`), {
      state: { giroReturn: buildGiroReturnForIndex(giroReturn, index, giroReturn.completedThrough) },
    })
  }

  const openVisita = (index: number) => {
    expandStep(index)
    navigateToArniaVisit(index, {
      apiarioId,
      apiarioNome,
      arniaIndex: index,
      giroActive,
      giroStats,
      arniaIds,
      completedThrough,
    })
  }

  const startGiro = async () => {
    if (arnie.length === 0 || starting) return

    setStarting(true)
    try {
      const payload = await startGiroSession(apiarioId, apiarioNome)
      if (!payload) {
        toast.error('Nessuna arnia attiva da ispezionare in questo apiario')
        return
      }

      setGiroActive(true)
      setGiroComplete(false)
      setGiroStats(payload.giroReturn.giroStats)
      setGiroArniaIds(payload.giroReturn.arniaIds ?? [])
      setCompletedThrough(-1)
      setExpandedIndex(0)
      navigateToArniaVisit(0, payload.giroReturn)
    } catch (err) {
      toast.error(parseDexieError(err))
    } finally {
      setStarting(false)
    }
  }

  const resetGiroView = () => {
    setGiroComplete(false)
    setGiroActive(false)
    setGiroArniaIds([])
    setCompletedThrough(-1)
    setExpandedIndex(0)
    setGiroStats(emptyGiroSessionStats())
  }

  useEffect(() => {
    if (loading || arnie.length === 0) return

    const state = location.state as ApiarioGiroLocationState | null
    const resume = state?.giroResume

    if (resume) {
      window.history.replaceState({}, document.title)

      setGiroActive(resume.giroActive)
      setGiroStats(resume.giroStats)
      setGiroArniaIds(resume.arniaIds ?? [])
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
            giroId: resume.giroId,
            apiarioId,
            apiarioNome,
            arniaIndex: resume.nextIndex,
            giroActive: true,
            giroStats: resume.giroStats,
            arniaIds: resume.arniaIds ?? arniaIds,
            completedThrough: resume.completedThrough,
          })
        }, 250)
        return
      }

      expandStep(Math.min(resume.nextIndex, arnie.length - 1))
      return
    }

    if (state?.autoStartGiro && !autoStartHandled.current) {
      autoStartHandled.current = true
      window.history.replaceState({}, document.title)
      void startGiro()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key, loading, arnie.length])

  return {
    expandedIndex,
    completedThrough,
    giroActive,
    giroComplete,
    giroStats,
    giroArniaIds,
    orderedArnie,
    starting,
    stepRefs,
    openVisita,
    startGiro,
    resetGiroView,
    expandStep,
  }
}
