import { motion } from 'framer-motion'
import { Hexagon } from '../../../theme/icons'
import { PageQueryState } from '../../../components/common/PageQueryState'
import { useArnieList } from '../hooks/useArnie'
import { ArniaCard } from '../components/ArniaCard'
import './ArniePage.css'

export function ArniePage() {
  const { arnie, loading, error } = useArnieList()

  return (
    <PageQueryState loading={loading} error={error} skeleton="list">
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
          <p className="arnie-page__subtitle">{arnie.length} colonie registrate</p>
        </motion.header>

        <div className="arnie-page__grid">
          {arnie.map((item, index) => (
            <ArniaCard key={item.arnia.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </PageQueryState>
  )
}
