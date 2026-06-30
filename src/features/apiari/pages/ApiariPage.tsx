import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { PageQueryState } from '../../../components/common/PageQueryState'
import { EmptyState } from '../../../components/ui/EmptyState'
import { parseDexieError } from '../../../database/errors'
import { useToast } from '../../../hooks/useToast'
import { ApiarioCard } from '../components/ApiarioCard'
import { ApiarioModal } from '../components/ApiarioModal'
import { useApiariListCards } from '../hooks/useApiariListCards'
import { createApiario, deleteApiario, updateApiario } from '../services/apiariService'
import type { ApiarioInput, ApiarioView } from '../types'
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog'
import './ApiariPage.css'

function normalizeSearch(value: string): string {
  return value.trim().toLowerCase()
}

export function ApiariPage() {
  const { cards, loading } = useApiariListCards()
  const location = useLocation()
  const toast = useToast()

  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ApiarioView | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<ApiarioView | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const editId = (location.state as { editId?: string } | null)?.editId
    if (!editId || loading) return

    const target = cards.find((card) => card.apiario.id === editId)?.apiario
    if (target) {
      setEditing(target)
      setModalOpen(true)
      window.history.replaceState({}, '')
    }
  }, [location.state, cards, loading])

  const filteredCards = useMemo(() => {
    const query = normalizeSearch(search)
    if (!query) return cards

    return cards.filter((card) => {
      const { apiario, comuneLabel } = card
      const haystack = [
        apiario.nome,
        comuneLabel,
        apiario.localita,
        apiario.comune,
        apiario.provincia,
        apiario.regione,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(query)
    })
  }, [cards, search])

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

  const hasApiari = cards.length > 0
  const showEmptySearch = hasApiari && filteredCards.length === 0

  return (
    <PageQueryState loading={loading} skeleton="list">
      <div className="apiari-page">
        <motion.header
          className="apiari-page__header"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="apiari-page__intro">
            <p className="apiari-page__eyebrow meli-label">Gestione siti apistici</p>
            <h1 className="apiari-page__title">Apiari</h1>
          </div>
          <button type="button" className="apiari-page__new" onClick={openCreate}>
            <Plus size={20} strokeWidth={2.25} aria-hidden="true" />
            Nuovo Apiario
          </button>
        </motion.header>

        {hasApiari && (
          <motion.div
            className="apiari-page__search-wrap meli-glass"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <Search size={20} strokeWidth={1.75} className="apiari-page__search-icon" aria-hidden="true" />
            <input
              type="search"
              className="apiari-page__search"
              placeholder="Cerca per nome o comune…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Cerca apiari"
            />
          </motion.div>
        )}

        {!hasApiari ? (
          <EmptyState
            title="Nessun apiario"
            description="Non hai ancora creato nessun apiario."
            action={
              <button type="button" className="apiari-page__new apiari-page__new--inline" onClick={openCreate}>
                <Plus size={20} strokeWidth={2.25} aria-hidden="true" />
                Nuovo Apiario
              </button>
            }
          />
        ) : showEmptySearch ? (
          <div className="apiari-page__no-results meli-glass">
            <p>Nessun apiario corrisponde a &quot;{search}&quot;</p>
          </div>
        ) : (
          <div className="apiari-page__grid">
            {filteredCards.map((card, index) => (
              <ApiarioCard
                key={card.apiario.id}
                card={card}
                index={index}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        )}

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
