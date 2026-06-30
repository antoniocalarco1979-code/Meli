import { Link } from 'react-router-dom'
import { useAppPath } from '../../../demo/useAppPath'
import './ApiarioVisitaRow.css'

type ApiarioVisitaRowProps = {
  arniaId: string
  numero: string
  done?: boolean
  onSelect?: () => void
}

export function ApiarioVisitaRow({ arniaId, numero, done, onSelect }: ApiarioVisitaRowProps) {
  const appPath = useAppPath()
  const label = (
    <>
      <span aria-hidden="true">🐝</span>
      ARNIA {numero}
    </>
  )

  if (onSelect) {
    return (
      <button
        type="button"
        className={`apiario-visita-row${done ? ' apiario-visita-row--done' : ''}`}
        onClick={onSelect}
      >
        {done && <span className="apiario-visita-row__check" aria-hidden="true">✓</span>}
        {label}
      </button>
    )
  }

  return (
    <Link
      to={appPath(`/arnie/${arniaId}`)}
      className={`apiario-visita-row apiario-visita-row--link${done ? ' apiario-visita-row--done' : ''}`}
    >
      {done && <span className="apiario-visita-row__check" aria-hidden="true">✓</span>}
      {label}
    </Link>
  )
}
