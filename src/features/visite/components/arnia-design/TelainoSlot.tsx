import type { TelainoDesignData } from './types'

type TelainoSlotProps = {
  telaino: TelainoDesignData
  selected: boolean
  onSelect: () => void
}

export function TelainoSlot({ telaino, selected, onSelect }: TelainoSlotProps) {
  const stateClass =
    telaino.status === 'inspected'
      ? 'telaino-slot--inspected'
      : selected
        ? 'telaino-slot--selected'
        : 'telaino-slot--pending'

  return (
    <button
      type="button"
      className={`telaino-slot ${stateClass}`}
      onClick={onSelect}
      aria-label={`Telaino ${telaino.numero}${telaino.status === 'inspected' ? ', ispezionato' : ''}`}
      aria-pressed={selected}
    >
      <span className="telaino-slot__frame" aria-hidden="true">
        <span className="telaino-slot__cells" />
        <span className="telaino-slot__cells telaino-slot__cells--offset" />
      </span>
      <span className="telaino-slot__number">{telaino.numero}</span>
      {telaino.status === 'inspected' && (
        <span className="telaino-slot__badge" aria-hidden="true">
          ✓
        </span>
      )}
    </button>
  )
}
