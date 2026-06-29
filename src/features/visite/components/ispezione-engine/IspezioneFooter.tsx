type IspezioneFooterProps = {
  stepIndex: number
  totalSteps: number
  canProceed: boolean
  showNext: boolean
  onNext: () => void
}

export function IspezioneFooter({
  stepIndex,
  totalSteps,
  canProceed,
  showNext,
  onNext,
}: IspezioneFooterProps) {
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
        Step {stepIndex + 1} di {totalSteps}
      </p>

      {showNext && (
        <button
          type="button"
          className="ispezione-footer__next"
          onClick={onNext}
          disabled={!canProceed}
        >
          AVANTI
        </button>
      )}
    </footer>
  )
}
