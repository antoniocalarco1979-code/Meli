import { VisitChoiceGrid } from '../visit-engine/VisitChoiceGrid'
import './ispezione-engine.css'

type ChoiceOption<T extends string> = {
  value: T
  label: string
  icon?: string
}

type IspezioneStepChoiceProps<T extends string> = {
  stepNumber: number
  emoji: string
  question: string
  options: ChoiceOption<T>[]
  value: T | null
  onSelect: (value: T) => void
  variant?: 'status' | 'radio'
}

export function IspezioneStepChoice<T extends string>({
  stepNumber,
  emoji,
  question,
  options,
  value,
  onSelect,
  variant = 'status',
}: IspezioneStepChoiceProps<T>) {
  return (
    <div className="ispezione-step">
      <p className="ispezione-step__number">Domanda {stepNumber}</p>
      <div className="ispezione-step__question">
        <span className="ispezione-step__emoji" aria-hidden="true">
          {emoji}
        </span>
        <h2 className="ispezione-step__title">&ldquo;{question}&rdquo;</h2>
      </div>

      <VisitChoiceGrid variant={variant} options={options} value={value} onSelect={onSelect} />
    </div>
  )
}
