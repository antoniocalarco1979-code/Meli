import { useEffect } from 'react'
import { ArrowLeft } from '../../../theme/icons'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { EntityNotFound } from '../../../components/common/NotFoundPage'
import { PageQueryState } from '../../../components/common/PageQueryState'
import { useAppPath } from '../../../demo/useAppPath'
import { ArniaDetail } from '../components/ArniaDetail'
import type { ArniaVisitLocationState } from '../../visite/types/visitFlow.types'
import { hasVisitaGuidataDraft } from '../../visite/services/visitaGuidataStorage'
import { useArniaDetail } from '../hooks/useArnie'
import './ArniaDetailPage.css'

export function ArniaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const appPath = useAppPath()
  const { detail, loading, error } = useArniaDetail(id)

  const hasDraft = id ? hasVisitaGuidataDraft(id) : false

  useEffect(() => {
    const state = location.state as ArniaVisitLocationState | null
    if (state?.openVisita && id) {
      navigate(appPath(`/arnie/${id}/visita`), {
        replace: true,
        state: {
          ...(state.giroReturn ? { giroReturn: state.giroReturn } : {}),
          startNewSession: !hasVisitaGuidataDraft(id),
        },
      })
    }
  }, [appPath, id, location.state, navigate])

  const openNewVisit = () => {
    if (!id) return
    navigate(appPath(`/arnie/${id}/visita`), { state: { startNewSession: true } })
  }

  const resumeVisit = () => {
    if (!id) return
    navigate(appPath(`/arnie/${id}/visita`), { state: { startNewSession: false } })
  }

  if (!loading && !error && !detail) {
    return (
      <EntityNotFound
        title="Arnia non trovata"
        backTo={appPath('/arnie')}
        backLabel="Torna alle arnie"
      />
    )
  }

  return (
    <PageQueryState loading={loading} error={error} skeleton="detail">
      {detail && (
        <div className="arnia-detail-page">
          <Link
            to={detail.apiario ? appPath(`/apiari/${detail.apiario.id}`) : appPath('/arnie')}
            className="arnia-detail-page__back"
          >
            <ArrowLeft size={20} aria-hidden="true" />
            {detail.apiario?.nome ?? 'Arnie'}
          </Link>

          <ArniaDetail
            data={detail}
            hasVisitDraft={hasDraft}
            onIniziaIspezione={openNewVisit}
            onRiprendiVisita={hasDraft ? resumeVisit : undefined}
          />
        </div>
      )}
    </PageQueryState>
  )
}
