import { useEffect, useState } from 'react'
import { ArrowLeft } from '../../../theme/icons'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { EntityNotFound } from '../../../components/common/NotFoundPage'
import { PageQueryState } from '../../../components/common/PageQueryState'
import { Button } from '../../../components/ui/Button'
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog'
import { parseDexieError } from '../../../database/errors'
import { useAppPath } from '../../../demo/useAppPath'
import { useToast } from '../../../hooks/useToast'
import { ApiarioArnieSection } from '../components/ApiarioArnieSection'
import { ApiarioVisiteFlow } from '../components/ApiarioVisiteFlow'
import { ApiarioDetailTabs, type ApiarioDetailTab } from '../components/ApiarioDetailTabs'
import { ApiarioInfoSection } from '../components/ApiarioInfoSection'
import { ApiarioStatisticheSection } from '../components/ApiarioStatisticheSection'
import { useApiarioDetail } from '../hooks/useApiari'
import { deleteApiario } from '../services/apiariService'
import type { ApiarioGiroLocationState } from '../../visite/types/visitFlow.types'
import './ApiarioDetailPage.css'

export function ApiarioDetailPage() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const appPath = useAppPath()
  const toast = useToast()
  const { detail, loading, error } = useApiarioDetail(id)
  const [activeTab, setActiveTab] = useState<ApiarioDetailTab>('informazioni')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const state = location.state as ApiarioGiroLocationState | null
    if (state?.tab) {
      setActiveTab(state.tab)
    }
  }, [location.key, location.state])

  if (!loading && !error && !detail) {
    return (
      <EntityNotFound
        title="Apiario non trovato"
        backTo={appPath('/apiari')}
        backLabel="Torna agli apiari"
      />
    )
  }

  const handleEdit = () => {
    if (!detail) return
    navigate(appPath('/apiari'), { state: { editId: detail.apiario.id } })
  }

  const handleDelete = async () => {
    if (!detail) return
    setDeleting(true)
    try {
      await deleteApiario(detail.apiario.id)
      toast.success('Apiario eliminato')
      navigate(appPath('/apiari'))
    } catch (err) {
      toast.error(parseDexieError(err))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <PageQueryState loading={loading} error={error} skeleton="detail">
      {detail && (
        <div className="apiario-detail-page">
          <Link to={appPath('/apiari')} className="apiario-detail-page__back">
            <ArrowLeft size={20} aria-hidden="true" />
            Apiari
          </Link>

          <ApiarioDetailTabs active={activeTab} onChange={setActiveTab} />

          <div className="apiario-detail-page__panel" role="tabpanel">
            {activeTab === 'informazioni' && (
              <>
                <ApiarioInfoSection
                  detail={detail}
                  onEdit={handleEdit}
                  actions={
                    <Button type="button" variant="danger" size="md" onClick={() => setDeleteOpen(true)}>
                      Elimina apiario
                    </Button>
                  }
                />
                <ApiarioArnieSection
                  apiarioId={detail.apiario.id}
                  apiarioNome={detail.apiario.nome}
                />
              </>
            )}

            {activeTab === 'statistiche' && (
              <ApiarioStatisticheSection statistiche={detail.statistiche} />
            )}

            {activeTab === 'giro' && (
              <ApiarioVisiteFlow apiarioId={detail.apiario.id} apiarioNome={detail.apiario.nome} />
            )}
          </div>

          <ConfirmDialog
            open={deleteOpen}
            message="Eliminare definitivamente questo apiario?"
            confirmLabel="Elimina"
            loading={deleting}
            onConfirm={handleDelete}
            onCancel={() => setDeleteOpen(false)}
          />
        </div>
      )}
    </PageQueryState>
  )
}
