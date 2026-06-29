type IspezioneStepNoteProps = {
  stepNumber: number
  value: string
  onChange: (value: string) => void
}

export function IspezioneStepNote({ stepNumber, value, onChange }: IspezioneStepNoteProps) {
  return (
    <div className="ispezione-step">
      <p className="ispezione-step__number">Domanda {stepNumber}</p>
      <div className="ispezione-step__question">
        <span className="ispezione-step__emoji" aria-hidden="true">
          📝
        </span>
        <h2 className="ispezione-step__title">Note sul campo</h2>
      </div>

      <label className="ispezione-note">
        <span className="ispezione-note__label">Note (facoltative)</span>
        <textarea
          className="ispezione-note__field"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Osservazioni, trattamenti, anomalie…"
          rows={6}
        />
      </label>
    </div>
  )
}
