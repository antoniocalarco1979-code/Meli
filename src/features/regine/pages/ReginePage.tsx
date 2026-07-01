import { motion } from 'framer-motion'
import { Crown } from 'lucide-react'
import { PageQueryState } from '../../../components/common/PageQueryState'
import { EmptyState } from '../../../components/ui/EmptyState'
import { useRegineList } from '../hooks/useRegine'
import { ReginaCard } from '../components/ReginaCard'
import './ReginePage.css'

export function ReginePage() {
  const { regine, loading } = useRegineList()
  const hasRegine = regine.length > 0

  return (
    <PageQueryState loading={loading} skeleton="list">
      <div className="regine-page">
        <motion.header
          className="regine-page__header"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="regine-page__title">
            <Crown size={28} strokeWidth={1.75} aria-hidden="true" />
            REGINE
          </h1>
          <p className="regine-page__subtitle">
            {hasRegine
              ? `${regine.length} regine registrate`
              : 'Le regine collegate alle arnie compariranno qui'}
          </p>
        </motion.header>

        {!hasRegine ? (
          <EmptyState
            title="Nessuna regina"
            description="I passaporti regina compariranno qui quando registri una regina su un arnia."
            icon={<Crown size={40} strokeWidth={1.5} />}
          />
        ) : (
          <div className="regine-page__grid">
            {regine.map((item, index) => (
              <ReginaCard key={item.regina.id} item={item} index={index} />
            ))}
          </div>
        )}
      </div>
    </PageQueryState>
  )
}
