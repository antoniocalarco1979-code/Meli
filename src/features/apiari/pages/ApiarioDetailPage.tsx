import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog'
import { Loading } from '../../../components/ui/Loading'
import { PageTitle } from '../../../components/ui/PageTitle'
import { ApiarioVisiteFlow } from '../components/ApiarioVisiteFlow'
import { ApiarioDetail } from '../components/ApiarioDetail'
import { useApiario } from '../hooks/useApiari'
import { deleteApiario } from '../services/apiariService'
import './ApiarioDetailPage.css'

export function ApiarioDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { apiario, loading } = useApiario(id)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  if (loading) {
    return (
      <div className="apiario-detail-page">
        <Loading size="lg" />
      </div>
    )
  }

  if (!apiario) {
    return (
      <div className="apiario-detail-page">
        <PageTitle title="Apiario non trovato" />
        <Link to="/apiari">← Torna agli apiari</Link>
      </div>
    )
  }

  const handleEdit = () => {
    navigate('/apiari', { state: { editId: apiario.id } })
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteApiario(apiario.id)
      navigate('/apiari')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="apiario-detail-page">
      <Link to="/apiari" className="apiario-detail-page__back">
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
  )
}
