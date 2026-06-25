import './Loading.css'

type LoadingProps = {
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Loading({ label = 'Caricamento…', size = 'md' }: LoadingProps) {
  return (
    <div className={`ui-loading ui-loading--${size}`} role="status" aria-live="polite">
      <span className="ui-loading__spinner" aria-hidden="true" />
      <span className="ui-loading__label">{label}</span>
    </div>
  )
}
