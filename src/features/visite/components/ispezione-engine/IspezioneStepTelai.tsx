import type { TelainoInspection } from '../../types/ispezioneWizard.types'
import { IspezioneTelainoCard } from './IspezioneTelainoCard'

type IspezioneStepTelaiProps = {
  telai: TelainoInspection[]
  onUpdate: (id: string, patch: Partial<TelainoInspection>) => void
  onAdd: () => void
  onRemove: (id: string) => void
}

export function IspezioneStepTelai({ telai, onUpdate, onAdd, onRemove }: IspezioneStepTelaiProps) {
  return (
    <div className="ispezione-step ispezione-step--telai">
      <p className="ispezione-step__number">Ispezione telaini</p>
      <div className="ispezione-step__question">
        <span className="ispezione-step__emoji" aria-hidden="true">
          🍯
        </span>
        <h2 className="ispezione-step__title">Registra ogni telaino</h2>
      </div>
      <p className="ispezione-step__lead">
        Compila una card per ogni telaino ispezionato. Puoi aggiungerne quanti ne servono.
      </p>

      <div className="ispezione-telai-list">
        {telai.map((telaino) => (
          <IspezioneTelainoCard
            key={telaino.id}
            telaino={telaino}
            canRemove={telai.length > 1}
            onUpdate={(patch) => onUpdate(telaino.id, patch)}
            onRemove={() => onRemove(telaino.id)}
          />
        ))}
      </div>

      <button type="button" className="ispezione-telai-add" onClick={onAdd}>
        + Aggiungi telaino
      </button>
    </div>
  )
}
