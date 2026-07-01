import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import { PageQueryState } from '../../../components/common/PageQueryState'
import { EmptyState } from '../../../components/ui/EmptyState'
import { useTrattamentiList } from '../hooks/useTrattamenti'
import { TrattamentoCard } from '../components/TrattamentoCard'
import './TrattamentiPage.css'

export function TrattamentiPage() {
  const { trattamenti, loading } = useTrattamentiList()
  const hasItems = trattamenti.length > 0

  return (
    <PageQueryState loading={loading} skeleton="list">
      <div className="trattamenti-page">
        <motion.header
          className="trattamenti-page__header"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="trattamenti-page__title">
            <Shield size={28} strokeWidth={1.75} aria-hidden="true" />
            TRATTAMENTI
          </h1>
          <p className="trattamenti-page__subtitle">
            {hasItems
              ? `${trattamenti.length} trattamenti registrati`
              : 'Registra un trattamento durante una visita guidata'}
          </p>
        </motion.header>

        {!hasItems ? (
          <EmptyState
            title="Nessun trattamento"
            description="Seleziona Trattamento negli interventi di una visita per registrarlo rapidamente."
            icon={<Shield size={40} strokeWidth={1.5} />}
          />
        ) : (
          <div className="trattamenti-page__grid">
            {trattamenti.map((item, index) => (
              <TrattamentoCard key={item.trattamento.id} item={item} index={index} />
            ))}
          </div>
        )}
      </div>
    </PageQueryState>
  )
}
