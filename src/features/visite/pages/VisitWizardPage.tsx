import { useMemo } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { EntityNotFound } from '../../../components/common/NotFoundPage'
import { LoadingScreen } from '../../../components/ui/LoadingScreen'
import { useAppPath } from '../../../demo/useAppPath'
import { useArniaDetail } from '../../arnie/hooks/useArnie'
import { VisitaGuidataWizard } from '../components/visita-guidata/VisitaGuidataWizard'
import { accumulateGiroStats } from '../types/giro.types'
import type { VisitaSaveSummary } from '../types/visitSave.types'
import type { VisitWizardLocationState } from '../types/visitFlow.types'

export function VisitWizardPage() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const appPath = useAppPath()
  const { detail, loading, error } = useArniaDetail(id)

  const giroReturn = useMemo(() => {
    return (location.state as VisitWizardLocationState | null)?.giroReturn
  }, [location.state])

  const navigateAfterClose = () => {
    if (giroReturn?.giroActive) {
      navigate(appPath(`/apiari/${giroReturn.apiarioId}`), {
        replace: true,
        state: {
          tab: 'giro',
          giroResume: {
            nextIndex: giroReturn.arniaIndex,
            giroActive: true,
            giroStats: giroReturn.giroStats,
            completedThrough: giroReturn.completedThrough,
          },
        },
      })
      return
    }

    navigate(id ? appPath(`/arnie/${id}`) : appPath('/arnie'), { replace: true })
  }

  const handleSaved = (summary: VisitaSaveSummary) => {
    if (!id) {
      navigateAfterClose()
      return
    }

    if (giroReturn?.giroActive) {
      const giroStats = accumulateGiroStats(
        giroReturn.giroStats,
        {
          fotoCount: summary.fotoCount,
          hadTrattamento: summary.hadTrattamento,
          reginaNonVista: summary.reginaNonVista,
        },
        id,
      )
      const completedThrough = Math.max(giroReturn.completedThrough, giroReturn.arniaIndex)
      const nextIndex = giroReturn.arniaIndex + 1

      navigate(appPath(`/apiari/${giroReturn.apiarioId}`), {
        replace: true,
        state: {
          tab: 'giro',
          giroResume: {
            nextIndex,
            giroActive: true,
            giroStats,
            completedThrough,
          },
        },
      })
      return
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
      hasMelario={detail.arnia.hasMelario}
      onClose={navigateAfterClose}
      onSaved={handleSaved}
    />
  )
}
