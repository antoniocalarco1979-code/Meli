import { useState } from 'react'
import { ArrowLeft } from '../../../theme/icons'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { EntityNotFound } from '../../../components/common/NotFoundPage'
import { PageQueryState } from '../../../components/common/PageQueryState'
import { Button } from '../../../components/ui/Button'
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog'
import { parseDexieError } from '../../../database/errors'
import { useAppPath } from '../../../demo/useAppPath'
import { useToast } from '../../../hooks/useToast'
import { ApiarioVisiteFlow } from '../components/ApiarioVisiteFlow'
import { ApiarioDetail } from '../components/ApiarioDetail'
import { useApiario } from '../hooks/useApiari'
import { deleteApiario } from '../services/apiariService'
import './ApiarioDetailPage.css'

export function ApiarioDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const appPath = useAppPath()
  const toast = useToast()
  const { apiario, loading, error } = useApiario(id)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  if (!loading && !error && !apiario) {
    return (
      <EntityNotFound
        title="Apiario non trovato"
        backTo={appPath('/apiari')}
        backLabel="Torna agli apiari"
      />
    )
  }

  const handleEdit = () => {
    if (!apiario) return
    navigate(appPath('/apiari'), { state: { editId: apiario.id } })
  }

  const handleDelete = async () => {
    if (!apiario) return
    setDeleting(true)
    try {
      await deleteApiario(apiario.id)
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
      {apiario && (
        <div className="apiario-detail-page">
          <Link to={appPath('/apiari')} className="apiario-detail-page__back">
            <ArrowLeft size={20} aria-hidden="true" />
            Apiari
          </Link>

          <ApiarioVisiteFlow apiarioId={apiario.id} apiarioNome={apiario.nome} />

          <details className="apiario-detail-page__admin">
            <summary>Gestione apiario</summary>
            <ApiarioDetail
              apiario={apiario}
              onEdit={handleEdit}
              actions={
                <Button type="button" variant="danger" size="md" onClick={() => setDeleteOpen(true)}>
                  Elimina apiario
                </Button>
              }
            />
          </details>

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
