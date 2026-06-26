import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { Loading } from '../../../components/ui/Loading'
import { PageTitle } from '../../../components/ui/PageTitle'
import { ArniaDetail } from '../components/ArniaDetail'
import { NuovaVisitaModal } from '../components/NuovaVisitaModal'
import { useArniaDetail } from '../hooks/useArnie'
import './ArniaDetailPage.css'

type LocationState = {
  openVisita?: boolean
}

export function ArniaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const { detail, loading } = useArniaDetail(id)
  const [visitaOpen, setVisitaOpen] = useState(false)

  useEffect(() => {
    const state = location.state as LocationState | null
    if (state?.openVisita) {
      setVisitaOpen(true)
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  if (loading) {
    return (
      <div className="arnia-detail-page">
        <Loading size="lg" label="Caricamento arnia…" />
      </div>
    )
  }

  if (!detail) {
    return (
      <div className="arnia-detail-page">
        <PageTitle title="Arnia non trovata" />
        <Link to="/arnie">← Torna alle arnie</Link>
      </div>
    )
  }

  return (
    <div className="arnia-detail-page">
      <Link
        to={detail.apiario ? `/apiari/${detail.apiario.id}` : '/arnie'}
        className="arnia-detail-page__back"
      >
        <ArrowLeft size={20} aria-hidden="true" />
        {detail.apiario?.nome ?? 'Arnie'}
      </Link>

      <ArniaDetail
        data={detail}
        onNuovaVisita={() => setVisitaOpen(true)}
        onEdit={() => {
          /* Modifica arnia — prossimo sprint */
        }}
      />

      <NuovaVisitaModal
        open={visitaOpen}
        arniaId={detail.arnia.id}
        arniaNumero={detail.arnia.numero}
        apiarioNome={detail.apiario?.nome}
        onClose={() => setVisitaOpen(false)}
        onSaved={() => {
          /* liveQuery aggiorna timeline, ultima visita e dashboard */
        }}
      />
    </div>
  )
}
