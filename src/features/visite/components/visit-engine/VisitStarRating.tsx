import { formatStarRating } from '../../services/visitTelaiMapper'

type VisitStarRatingProps = {
  value: number
  onChange: (value: number) => void
}

const STAR_VALUES = [5, 4, 3, 2, 1] as const

export function VisitStarRating({ value, onChange }: VisitStarRatingProps) {
  return (
    <ul className="visit-stars-list" role="radiogroup" aria-label="Valutazione stelle">
      {STAR_VALUES.map((stars) => {
        const selected = value === stars
        return (
          <li key={stars}>
            <button
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`${stars} stelle su 5`}
              className={`visit-stars-list__btn${selected ? ' visit-stars-list__btn--selected' : ''}`}
              onClick={() => onChange(stars)}
            >
              {formatStarRating(stars)}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
