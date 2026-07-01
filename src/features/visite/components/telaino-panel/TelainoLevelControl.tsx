import {
  choiceToIndex,
  indexToChoice,
  type TelainoCovataChoice,
  type TelainoQuantitaChoice,
  type TelainoUovaChoice,
} from '../../types/telainoPanel.types'

type LevelOption<T extends string> = {
  value: T
  label: string
  short?: string
}

type TelainoLevelControlProps<T extends string> = {
  label: string
  value: T | null
  options: LevelOption<T>[]
  onChange: (value: T) => void
}

export function TelainoLevelControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: TelainoLevelControlProps<T>) {
  const sliderIndex = choiceToIndex(options, value)
  const maxIndex = options.length - 1

  return (
    <div className="telaino-panel__field">
      <div className="telaino-panel__field-head">
        <p className="telaino-panel__label">{label}</p>
        <span className="telaino-panel__value-badge">
          {options[sliderIndex]?.label ?? '—'}
        </span>
      </div>

      {maxIndex > 0 && (
        <input
          type="range"
          className="telaino-panel__slider"
          min={0}
          max={maxIndex}
          step={1}
          value={sliderIndex}
          aria-label={`${label} — livello`}
          onChange={(event) => onChange(indexToChoice(options, Number(event.target.value)))}
        />
      )}

      <div
        className={`telaino-panel__quick-row telaino-panel__quick-row--${options.length}`}
        role="group"
        aria-label={`${label} rapido`}
      >
        {options.map((option) => {
          const selected = value === option.value
          return (
            <button
              key={option.value}
              type="button"
              className={`telaino-panel__quick-btn${selected ? ' telaino-panel__quick-btn--active' : ''}`}
              aria-pressed={selected}
              onClick={() => onChange(option.value)}
            >
              {option.short != null && (
                <span className="telaino-panel__quick-btn-index">{option.short}</span>
              )}
              <span className="telaino-panel__quick-btn-label">{option.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export type TelainoUovaControlProps = {
  value: TelainoUovaChoice | null
  onChange: (value: TelainoUovaChoice) => void
}

export type TelainoCovataControlProps = {
  label: string
  value: TelainoCovataChoice | null
  onChange: (value: TelainoCovataChoice) => void
}

export type TelainoQuantitaControlProps = {
  label: string
  value: TelainoQuantitaChoice | null
  onChange: (value: TelainoQuantitaChoice) => void
}
