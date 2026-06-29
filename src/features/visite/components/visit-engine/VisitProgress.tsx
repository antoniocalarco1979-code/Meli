type VisitProgressProps = {
  currentIndex: number
  totalSteps: number
  stepLabel: string
}

export function VisitProgress({ currentIndex, totalSteps, stepLabel }: VisitProgressProps) {
  const progress = ((currentIndex + 1) / totalSteps) * 100

  return (
    <div className="visit-progress" aria-label={`Passo ${currentIndex + 1} di ${totalSteps}`}>
      <div className="visit-progress__meta">
        <span>
          Passo {currentIndex + 1}/{totalSteps}
        </span>
        <span>{stepLabel}</span>
      </div>
      <div className="visit-progress__bar" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <div className="visit-progress__fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
