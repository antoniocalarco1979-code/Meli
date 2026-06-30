import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Hexagon } from '../../../theme/icons'
import { PageQueryState } from '../../../components/common/PageQueryState'
import { EmptyState } from '../../../components/ui/EmptyState'
import { useAppPath } from '../../../demo/useAppPath'
import { useArnieList } from '../hooks/useArnie'
import { ArniaCard } from '../components/ArniaCard'
import '../../apiari/pages/ApiariPage.css'
import './ArniePage.css'

export function ArniePage() {
  const appPath = useAppPath()
  const { arnie, loading } = useArnieList()
  const hasArnie = arnie.length > 0

  return (
    <PageQueryState loading={loading} skeleton="list">
      <div className="arnie-page">
        <motion.header
          className="arnie-page__header"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="arnie-page__title">
            <Hexagon size={28} strokeWidth={1.75} aria-hidden="true" />
            ARNIE
          </h1>
          <p className="arnie-page__subtitle">
            {hasArnie ? `${arnie.length} colonie registrate` : 'Nessuna arnia registrata'}
          </p>
        </motion.header>

        {!hasArnie ? (
          <EmptyState
            title="Nessuna arnia"
            description="Non hai ancora registrato nessuna arnia. Crea prima un apiario e aggiungi le tue colonie."
            action={
              <Link to={appPath('/apiari')} className="apiari-page__new apiari-page__new--inline">
                <Plus size={20} strokeWidth={2.25} aria-hidden="true" />
                Nuovo Apiario
              </Link>
            }
          />
        ) : (
          <div className="arnie-page__grid">
            {arnie.map((item, index) => (
              <ArniaCard key={item.arnia.id} item={item} index={index} />
            ))}
          </div>
        )}
      </div>
    </PageQueryState>
  )
}
