import { useNavigate, useParams } from 'react-router-dom'
import { EntityNotFound } from '../../../components/common/NotFoundPage'
import { LoadingScreen } from '../../../components/ui/LoadingScreen'
import { useAppPath } from '../../../demo/useAppPath'
import { useArniaDetail } from '../../arnie/hooks/useArnie'
import { ArniaDesignVisit } from '../components/arnia-design/ArniaDesignVisit'

export function VisitWizardPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const appPath = useAppPath()
  const { detail, loading, error } = useArniaDetail(id)

  const handleClose = () => {
    navigate(id ? appPath(`/arnie/${id}`) : appPath('/arnie'), { replace: true })
  }

  if (!id) {
    return (
      <EntityNotFound
        title="Arnia non trovata"
        backTo={appPath('/arnie')}
        backLabel="Torna alle arnie"
      />
    )
  }

  if (loading) {
    return <LoadingScreen label="Preparazione ispezione…" />
  }

  if (error) {
    return (
      <EntityNotFound
        title="Errore caricamento"
        backTo={appPath('/arnie')}
        backLabel="Torna alle arnie"
      />
    )
  }

  if (!detail) {
    return (
      <EntityNotFound
        title="Arnia non trovata"
        backTo={appPath('/arnie')}
        backLabel="Torna alle arnie"
      />
    )
  }

  return (
    <ArniaDesignVisit
      arniaNumero={detail.arnia.numero}
      onClose={handleClose}
    />
  )
}
