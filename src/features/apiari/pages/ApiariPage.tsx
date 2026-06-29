import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Leaf, Plus } from '../../../theme/icons'
import { useLocation } from 'react-router-dom'
import { PageQueryState } from '../../../components/common/PageQueryState'
import { Button } from '../../../components/ui/Button'
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog'
import { EmptyState } from '../../../components/ui/EmptyState'
import { FloatingActionButton } from '../../../components/ui/FloatingActionButton'
import { parseDexieError } from '../../../database/errors'
import { useToast } from '../../../hooks/useToast'
import { ApiarioCard } from '../components/ApiarioCard'
import { ApiarioModal } from '../components/ApiarioModal'
import { useApiari } from '../hooks/useApiari'
import { createApiario, deleteApiario, updateApiario } from '../services/apiariService'
import type { ApiarioInput, ApiarioView } from '../types'
import './ApiariPage.css'

export function ApiariPage() {
  const { apiari, loading, error } = useApiari()
  const location = useLocation()
  const toast = useToast()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ApiarioView | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<ApiarioView | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const editId = (location.state as { editId?: string } | null)?.editId
    if (!editId || loading) return

    const target = apiari.find((a) => a.id === editId)
    if (target) {
      setEditing(target)
      setModalOpen(true)
      window.history.replaceState({}, '')
    }
  }, [location.state, apiari, loading])

  const openCreate = () => {
    setEditing(undefined)
    setModalOpen(true)
  }

  const openEdit = (apiario: ApiarioView) => {
    setEditing(apiario)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditing(undefined)
  }

  const handleSubmit = async (data: ApiarioInput) => {
    if (editing) {
      await updateApiario(editing.id, data)
    } else {
      await createApiario(data)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteApiario(deleteTarget.id)
      setDeleteTarget(null)
      toast.success('Apiario eliminato')
    } catch (err) {
      toast.error(parseDexieError(err))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <PageQueryState loading={loading} error={error} skeleton="list">
      <div className="apiari-page">
        <motion.header
          className="apiari-page__header"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="apiari-page__title">
            <Leaf size={28} strokeWidth={1.75} aria-hidden="true" />
            APIARI
          </h1>
          <Button variant="secondary" size="md" className="apiari-page__new" onClick={openCreate}>
            <Plus size={20} strokeWidth={2} aria-hidden="true" />
            Nuovo Apiario
          </Button>
        </motion.header>

        {apiari.length === 0 ? (
          <EmptyState
            title="Nessun apiario"
            description="Crea il tuo primo apiario per iniziare a gestire le colonie."
            action={
              <Button variant="primary" size="md" onClick={openCreate}>
                Nuovo Apiario
              </Button>
            }
          />
        ) : (
          <div className="apiari-page__grid">
            {apiari.map((apiario, index) => (
              <ApiarioCard
                key={apiario.id}
                apiario={apiario}
                index={index}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        )}

        <FloatingActionButton
          icon={<Plus size={26} strokeWidth={2} />}
          label="Nuovo apiario"
          onClick={openCreate}
        />

        <ApiarioModal
          open={modalOpen}
          apiario={editing}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />

        <ConfirmDialog
          open={Boolean(deleteTarget)}
          message="Eliminare definitivamente questo apiario?"
          confirmLabel="Elimina"
          loading={deleting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      </div>
    </PageQueryState>
  )
}
