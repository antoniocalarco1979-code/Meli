import { useMemo } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { parseDexieError } from '../../../database/errors'
import { EntityNotFound } from '../../../components/common/NotFoundPage'
import { LoadingScreen } from '../../../components/ui/LoadingScreen'
import { useAppPath } from '../../../demo/useAppPath'
import { useToast } from '../../../hooks/useToast'
import { useArniaDetail } from '../../arnie/hooks/useArnie'
import { VisitaGuidataWizard } from '../components/visita-guidata/VisitaGuidataWizard'
import { advanceGiroAfterSavedVisit } from '../services/giroFlowService'
import { getVisitWeatherLabel } from '../services/visitWeatherService'
import type { VisitaSaveSummary } from '../types/visitSave.types'
import type { VisitWizardLocationState } from '../types/visitFlow.types'

export function VisitWizardPage() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const appPath = useAppPath()
  const toast = useToast()
  const { detail, loading, error } = useArniaDetail(id)

  const locationState = location.state as VisitWizardLocationState | null

  const giroReturn = useMemo(() => locationState?.giroReturn, [locationState])

  const startNewSession = useMemo(() => {
    if (locationState?.startNewSession === true) return true
    if (locationState?.startNewSession === false) return false
    return Boolean(giroReturn?.giroActive)
  }, [giroReturn?.giroActive, locationState?.startNewSession])

  const meteo = useMemo(() => getVisitWeatherLabel(), [])

  const navigateAfterClose = () => {
    if (giroReturn?.giroActive) {
      navigate(appPath(`/apiari/${giroReturn.apiarioId}`), {
        replace: true,
        state: {
          tab: 'giro',
          giroResume: {
            giroId: giroReturn.giroId,
            nextIndex: giroReturn.arniaIndex,
            giroActive: true,
            giroStats: giroReturn.giroStats,
            arniaIds: giroReturn.arniaIds,
            completedThrough: giroReturn.completedThrough,
          },
        },
      })
      return
    }

    navigate(id ? appPath(`/arnie/${id}`) : appPath('/arnie'), { replace: true })
  }

  const handleSaved = async (summary: VisitaSaveSummary) => {
    if (!id) {
      navigateAfterClose()
      return
    }

    if (giroReturn?.giroActive) {
      try {
        const result = await advanceGiroAfterSavedVisit(giroReturn, id, summary)

        if (result.kind === 'next') {
          navigate(appPath(`/arnie/${result.nextArniaId}/visita`), {
            replace: true,
            state: { giroReturn: result.giroReturn, startNewSession: true },
          })
          return
        }

        navigate(appPath(`/apiari/${result.apiarioId}`), {
          replace: true,
          state: {
            tab: 'giro',
            giroResume: {
              giroId: result.stats.giroId,
              nextIndex: result.stats.totaleArnie,
              giroActive: true,
              giroStats: result.stats,
              arniaIds: giroReturn.arniaIds,
              completedThrough: result.completedThrough,
            },
          },
        })
        return
      } catch (err) {
        toast.error(parseDexieError(err))
        navigateAfterClose()
        return
      }
    }

    navigate(appPath(`/arnie/${id}`), { replace: true })
  }

  if (!id) {
    return (
      <EntityNotFound
        title="Arnia non trovata"
        backTo={appPath('/arnie')}
        backLabel="Torna alle arnie"
      />
    )
  }

  if (loading) {
    return <LoadingScreen label="Preparazione ispezione…" />
  }

  if (error) {
    return (
      <EntityNotFound
        title="Errore caricamento"
        backTo={appPath('/arnie')}
        backLabel="Torna alle arnie"
      />
    )
  }

  if (!detail) {
    return (
      <EntityNotFound
        title="Arnia non trovata"
        backTo={appPath('/arnie')}
        backLabel="Torna alle arnie"
      />
    )
  }

  return (
    <VisitaGuidataWizard
      arniaId={detail.arnia.id}
      arniaNumero={detail.arnia.numero}
      apiarioNome={detail.apiario?.nome}
      meteo={meteo}
      startNewSession={startNewSession}
      frameCount={detail.arnia.numeroTelai || 10}
      hasMelario={detail.arnia.hasMelario}
      isGiroActive={Boolean(giroReturn?.giroActive)}
      giroProgress={
        giroReturn?.giroActive
          ? {
              current: giroReturn.arniaIndex + 1,
              total: giroReturn.giroStats.totaleArnie,
              apiarioNome: giroReturn.apiarioNome,
              startedAt: giroReturn.giroStats.startedAt,
            }
          : undefined
      }
      onClose={navigateAfterClose}
      onSaved={handleSaved}
    />
  )
}
