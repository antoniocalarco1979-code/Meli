import './LoadingScreen.css'

type LoadingScreenProps = {
  label?: string
  fullScreen?: boolean
  showBrand?: boolean
}

export function LoadingScreen({
  label = 'Caricamento…',
  fullScreen = false,
  showBrand = false,
}: LoadingScreenProps) {
  return (
    <div
      className={`ui-loading-screen${fullScreen ? ' ui-loading-screen--full' : ''}`}
      role="status"
      aria-live="polite"
    >
      {showBrand && <span className="ui-loading-screen__brand">MELI</span>}
      <span className="ui-loading-screen__spinner" aria-hidden="true" />
      <span className="ui-loading-screen__label">{label}</span>
    </div>
  )
}
