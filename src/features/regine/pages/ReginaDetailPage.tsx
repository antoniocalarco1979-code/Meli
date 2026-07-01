import { ArrowLeft } from '../../../theme/icons'
import { Link, useParams } from 'react-router-dom'
import { EntityNotFound } from '../../../components/common/NotFoundPage'
import { PageQueryState } from '../../../components/common/PageQueryState'
import { useAppPath } from '../../../demo/useAppPath'
import { ReginaSchedaView } from '../components/ReginaSchedaView'
import { useReginaDetail } from '../hooks/useRegine'
import './ReginaDetailPage.css'

export function ReginaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const appPath = useAppPath()
  const { detail, loading, error, refresh } = useReginaDetail(id)

  if (!loading && !error && !detail) {
    return (
      <EntityNotFound
        title="Regina non trovata"
        backTo={appPath('/regine')}
        backLabel="Torna alle regine"
      />
    )
  }

  return (
    <PageQueryState loading={loading} error={error} skeleton="detail">
      {detail && (
        <div className="regina-detail-page">
          <Link to={appPath('/regine')} className="regina-detail-page__back">
            <ArrowLeft size={20} aria-hidden="true" />
            Regine
          </Link>

          <ReginaSchedaView data={detail} onSaved={refresh} />
        </div>
      )}
    </PageQueryState>
  )
}
