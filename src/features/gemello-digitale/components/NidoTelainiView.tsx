import { ArrowLeft } from 'lucide-react'
import type { TelainoGemelloModel } from '../types/gemelloDigitale.types'
import type { TelainoClickEvent } from './Telaino'
import { Telaino } from './Telaino'

type NidoTelainiViewProps = {
  telaini: TelainoGemelloModel[]
  selectedTelainoId: string | null
  onTelainoClick: (event: TelainoClickEvent) => void
  onBack: () => void
}

export function NidoTelainiView({
  telaini,
  selectedTelainoId,
  onTelainoClick,
  onBack,
}: NidoTelainiViewProps) {
  return (
    <section className="gemello-nido-view" aria-label="Nido — telaini dall'alto">
      <header className="gemello-nido-view__header">
        <button type="button" className="gemello-nido-view__back" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          Vista arnia
        </button>
        <div>
          <p className="gemello-nido-view__kicker">Nido</p>
          <h3 className="gemello-nido-view__title">Telaini dall&apos;alto</h3>
        </div>
      </header>

      <div className="gemello-nido-view__grid" role="list">
        {telaini.map((telaino) => (
          <div key={telaino.id} role="listitem">
            <Telaino
              telaino={telaino}
              selected={selectedTelainoId === telaino.id}
              onClick={onTelainoClick}
            />
          </div>
        ))}
      </div>

      <p className="gemello-nido-view__hint">
        Seleziona un telaino: si solleva, si evidenzia e apre il pannello laterale.
      </p>
    </section>
  )
}
