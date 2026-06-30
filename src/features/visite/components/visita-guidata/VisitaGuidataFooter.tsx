type VisitaGuidataFooterProps = {
  stepIndex: number
  totalSteps: number
  stepLabel: string
  canProceed: boolean
  showNext: boolean
  showBack: boolean
  onNext: () => void
  onBack: () => void
}

export function VisitaGuidataFooter({
  stepIndex,
  totalSteps,
  stepLabel,
  canProceed,
  showNext,
  showBack,
  onNext,
  onBack,
}: VisitaGuidataFooterProps) {
  const progress = ((stepIndex + 1) / totalSteps) * 100

  return (
    <footer className="ispezione-footer">
      <div
        className="ispezione-footer__progress"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Step ${stepIndex + 1} di ${totalSteps}`}
      >
        <div className="ispezione-footer__progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <p className="ispezione-footer__step">
        {stepLabel} · Step {stepIndex + 1} di {totalSteps}
      </p>

      {(showBack || showNext) && (
        <div className="visita-guidata-footer__nav">
          {showBack && (
            <button type="button" className="visita-guidata-footer__back" onClick={onBack}>
              INDIETRO
            </button>
          )}
          {showNext && (
            <button
              type="button"
              className="ispezione-footer__next visita-guidata-footer__next"
              onClick={onNext}
              disabled={!canProceed}
            >
              AVANTI
            </button>
          )}
        </div>
      )}
    </footer>
  )
}
