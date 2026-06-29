import type { CSSProperties } from 'react'
import type { ArniaColoreId } from '../../constants/arniaColori'
import { ARNIA_COLORI } from '../../constants/arniaColori'
import './ArniaColorPalette.css'

type ArniaColorPaletteProps = {
  value: ArniaColoreId | null
  onChange: (coloreId: ArniaColoreId) => void
}

export function ArniaColorPalette({ value, onChange }: ArniaColorPaletteProps) {
  return (
    <div className="arnia-color-palette" role="radiogroup" aria-label="Colore arnia">
      {ARNIA_COLORI.map((colore) => {
        const selected = value === colore.id
        return (
          <button
            key={colore.id}
            type="button"
            role="radio"
            aria-checked={selected}
            className={`arnia-color-palette__swatch${selected ? ' arnia-color-palette__swatch--active' : ''}`}
            style={{ '--swatch-color': colore.hex } as CSSProperties}
            onClick={() => onChange(colore.id)}
          >
            <span className="arnia-color-palette__dot" aria-hidden="true" />
            <span className="arnia-color-palette__label">{colore.label}</span>
          </button>
        )
      })}
    </div>
  )
}
