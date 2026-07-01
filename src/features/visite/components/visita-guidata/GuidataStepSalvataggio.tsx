type GuidataStepSalvataggioProps = {
  saving: boolean
  onSave: () => void
}

export function GuidataStepSalvataggio({ saving, onSave }: GuidataStepSalvataggioProps) {
  return (
    <div className="ispezione-step ispezione-step--salva visita-guidata-step visita-guidata-step--salvataggio">
      <div className="ispezione-step__question">
        <span className="ispezione-step__emoji" aria-hidden="true">
          ✅
        </span>
        <h2 className="ispezione-step__title">Salvataggio</h2>
      </div>

      <p className="ispezione-step__lead">
        Conferma per salvare la visita e aggiornare i dati dell&apos;arnia.
      </p>

      <button
        type="button"
        className="ispezione-salva-btn visita-guidata-action visita-guidata-action--primary"
        onClick={onSave}
        disabled={saving}
      >
        {saving ? 'Salvataggio…' : 'SALVA VISITA'}
      </button>
    </div>
  )
}
