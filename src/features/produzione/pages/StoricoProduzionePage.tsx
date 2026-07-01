import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Droplets, Plus } from 'lucide-react'
import { PageQueryState } from '../../../components/common/PageQueryState'
import { EmptyState } from '../../../components/ui/EmptyState'
import { useAppPath } from '../../../demo/useAppPath'
import { SmielaturaCard } from '../components/SmielaturaCard'
import { useSmielatureList } from '../hooks/useProduzione'
import './StoricoProduzionePage.css'

export function StoricoProduzionePage() {
  const appPath = useAppPath()
  const { smielature, loading } = useSmielatureList()
  const hasItems = smielature.length > 0

  return (
    <PageQueryState loading={loading} skeleton="list">
      <div className="storico-produzione-page">
        <motion.header
          className="storico-produzione-page__header"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="storico-produzione-page__title">
              <Droplets size={28} strokeWidth={1.75} aria-hidden="true" />
              Storico Produzione
            </h1>
            <p className="storico-produzione-page__subtitle">
              {hasItems
                ? `${smielature.length} smielature registrate`
                : 'Nessuna smielatura — inizia registrando la prima raccolta'}
            </p>
          </div>

          <Link to={appPath('/produzione/nuova')} className="storico-produzione-page__new">
            <Plus size={18} strokeWidth={2} aria-hidden="true" />
            Nuova
          </Link>
        </motion.header>

        {!hasItems ? (
          <EmptyState
            title="Nessuna smielatura"
            description="Registra kg estratti, melari e apiario per tenere traccia della produzione."
            icon={<Droplets size={40} strokeWidth={1.5} />}
            action={
              <Link to={appPath('/produzione/nuova')} className="storico-produzione-page__cta">
                Nuova smielatura
              </Link>
            }
          />
        ) : (
          <div className="storico-produzione-page__list">
            {smielature.map((item, index) => (
              <SmielaturaCard key={item.smielatura.id} item={item} index={index} />
            ))}
          </div>
        )}
      </div>
    </PageQueryState>
  )
}
