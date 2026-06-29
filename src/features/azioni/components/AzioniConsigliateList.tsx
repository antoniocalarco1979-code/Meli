import type { AzioneConsigliata, AzioneConsigliataConArnia } from '../types'
import './AzioniConsigliateList.css'

const PRIORITA_LABEL: Record<AzioneConsigliata['priorita'], string> = {
  urgente: 'Urgente',
  importante: 'Importante',
  programmare: 'Da programmare',
}

type AzioniConsigliateListProps = {
  azioni: AzioneConsigliata[] | AzioneConsigliataConArnia[]
  showArnia?: boolean
  onArniaClick?: (arniaId: string) => void
  className?: string
}

function isConArnia(
  azione: AzioneConsigliata | AzioneConsigliataConArnia,
): azione is AzioneConsigliataConArnia {
  return 'arniaId' in azione && 'arniaNumero' in azione
}

export function AzioniConsigliateList({
  azioni,
  showArnia = false,
  onArniaClick,
  className = '',
}: AzioniConsigliateListProps) {
  if (azioni.length === 0) {
    return <p className={`azioni-list__empty${className ? ` ${className}` : ''}`}>Nessuna azione consigliata.</p>
  }

  return (
    <ul className={`azioni-list${className ? ` ${className}` : ''}`}>
      {azioni.map((azione) => (
        <li key={azione.id} className={`azioni-list__item azioni-list__item--${azione.priorita}`}>
          <span className="azioni-list__dot" aria-hidden="true" />
          <div className="azioni-list__content">
            <span className={`azioni-list__badge azioni-list__badge--${azione.priorita}`}>
              {PRIORITA_LABEL[azione.priorita]}
            </span>
            <p className="azioni-list__message">{azione.messaggio}</p>
            {showArnia && isConArnia(azione) && (
              <button
                type="button"
                className="azioni-list__arnia"
                onClick={() => onArniaClick?.(azione.arniaId)}
              >
                Arnia {azione.arniaNumero}
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}
