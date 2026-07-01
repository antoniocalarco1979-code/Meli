import { ArrowLeft } from '../../../theme/icons'
import { Link, useParams } from 'react-router-dom'
import { EntityNotFound } from '../../../components/common/NotFoundPage'
import { PageQueryState } from '../../../components/common/PageQueryState'
import { useAppPath } from '../../../demo/useAppPath'
import { TrattamentoSchedaView } from '../components/TrattamentoSchedaView'
import { useTrattamentoDetail } from '../hooks/useTrattamenti'
import './TrattamentoDetailPage.css'

export function TrattamentoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const appPath = useAppPath()
  const { detail, loading, error, refresh } = useTrattamentoDetail(id)

  if (!loading && !error && !detail) {
    return (
      <EntityNotFound
        title="Trattamento non trovato"
        backTo={appPath('/trattamenti')}
        backLabel="Torna ai trattamenti"
      />
    )
  }

  return (
    <PageQueryState loading={loading} error={error} skeleton="detail">
      {detail && (
        <div className="trattamento-detail-page">
          <Link to={appPath('/trattamenti')} className="trattamento-detail-page__back">
            <ArrowLeft size={20} aria-hidden="true" />
            Trattamenti
          </Link>
          <TrattamentoSchedaView data={detail} onSaved={refresh} />
        </div>
      )}
    </PageQueryState>
  )
}
