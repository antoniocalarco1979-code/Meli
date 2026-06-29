import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'
import { ErrorPage } from './ErrorPage'

export function NotFoundPage() {
  return (
    <ErrorPage
      code="404"
      title="Pagina non trovata"
      message="La pagina che cerchi non esiste o è stata spostata."
      backTo="/"
      backLabel="Torna alla home"
    />
  )
}

export function EntityNotFound({
  title,
  backTo,
  backLabel,
}: {
  title: string
  backTo: string
  backLabel: string
}) {
  return (
    <div className="ui-error-page">
      <h1 className="ui-error-page__title">{title}</h1>
      <Link to={backTo}>
        <Button type="button" variant="secondary" size="md">
          ← {backLabel}
        </Button>
      </Link>
    </div>
  )
}
