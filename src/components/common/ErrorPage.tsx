import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'
import './ErrorPage.css'

type ErrorPageProps = {
  title?: string
  message?: string
  code?: string
  fullScreen?: boolean
  onRetry?: () => void
  backTo?: string
  backLabel?: string
}

export function ErrorPage({
  title = 'Qualcosa è andato storto',
  message = 'Si è verificato un errore imprevisto. Riprova o torna alla home.',
  code,
  fullScreen = false,
  onRetry,
  backTo = '/',
  backLabel = 'Torna alla home',
}: ErrorPageProps) {
  return (
    <div
      className={`ui-error-page meli-glass${fullScreen ? ' ui-error-page--full' : ''}`}
      role="alert"
    >
      {code && <span className="ui-error-page__code">{code}</span>}
      <h1 className="ui-error-page__title">{title}</h1>
      <p className="ui-error-page__message">{message}</p>
      <div className="ui-error-page__actions">
        {onRetry && (
          <Button type="button" variant="primary" size="md" onClick={onRetry}>
            Riprova
          </Button>
        )}
        <Link to={backTo}>
          <Button type="button" variant="secondary" size="md">
            {backLabel}
          </Button>
        </Link>
      </div>
    </div>
  )
}
