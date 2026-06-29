type VisitChoiceGridProps<T extends string> = {
  options: { value: T; label: string }[]
  value: T | null
  onSelect: (value: T) => void
  columns?: boolean
  variant?: 'cards' | 'radio' | 'checkbox' | 'status'
}

type ChoiceOption<T extends string> = {
  value: T
  label: string
  icon?: string
}

export function VisitChoiceGrid<T extends string>({
  options,
  value,
  onSelect,
  columns = true,
  variant = 'cards',
}: VisitChoiceGridProps<T>) {
  if (variant === 'status') {
    const statusOptions = options as ChoiceOption<T>[]
    return (
      <ul className="visit-choices visit-choices--status" role="radiogroup">
        {statusOptions.map((option) => {
          const selected = value === option.value
          return (
            <li key={option.value}>
              <button
                type="button"
                role="radio"
                aria-checked={selected}
                className={`visit-choices__status${selected ? ' visit-choices__status--selected' : ''}`}
                onClick={() => onSelect(option.value)}
              >
                <span className="visit-choices__status-icon" aria-hidden="true">
                  {option.icon ?? '○'}
                </span>
                <span className="visit-choices__status-label">{option.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    )
  }

  if (variant === 'radio' || variant === 'checkbox') {
    const isCheckbox = variant === 'checkbox'
    const groupClass = isCheckbox ? 'visit-choices--check' : 'visit-choices--radio'
    const itemClass = isCheckbox ? 'visit-choices__check' : 'visit-choices__radio'
    const markClass = isCheckbox ? 'visit-choices__check-mark' : 'visit-choices__radio-mark'
    const labelClass = isCheckbox ? 'visit-choices__check-label' : 'visit-choices__radio-label'

    return (
      <ul className={`visit-choices ${groupClass}`} role="radiogroup">
        {options.map((option) => {
          const selected = value === option.value
          return (
            <li key={option.value}>
              <button
                type="button"
                role="radio"
                aria-checked={selected}
                className={`${itemClass}${selected ? ` ${itemClass}--selected` : ''}`}
                onClick={() => onSelect(option.value)}
              >
                <span className={markClass} aria-hidden="true">
                  {isCheckbox ? (selected ? '☑' : '☐') : selected ? '●' : '○'}
                </span>
                <span className={labelClass}>{option.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <ul className={`visit-choices${columns ? ' visit-choices--grid' : ''}`} role="listbox">
      {options.map((option) => {
        const selected = value === option.value
        return (
          <li key={option.value}>
            <button
              type="button"
              role="option"
              aria-selected={selected}
              className={`visit-choices__btn${selected ? ' visit-choices__btn--selected' : ''}`}
              onClick={() => onSelect(option.value)}
            >
              {option.label}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
