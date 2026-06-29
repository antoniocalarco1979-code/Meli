import { TelainoSlot } from './TelainoSlot'
import type { TelainoDesignData } from './types'

type ArniaGraphicProps = {
  telai: TelainoDesignData[]
  selectedId: string | null
  onSelectTelaino: (id: string) => void
}

export function ArniaGraphic({ telai, selectedId, onSelectTelaino }: ArniaGraphicProps) {
  const inspectedCount = telai.filter((t) => t.status === 'inspected').length

  return (
    <section className="arnia-graphic" aria-label="Rappresentazione grafica arnia">
      <div className="arnia-graphic__roof" aria-hidden="true">
        <span className="arnia-graphic__roof-cap" />
      </div>

      <div className="arnia-graphic__body">
        <div className="arnia-graphic__side arnia-graphic__side--left" aria-hidden="true" />
        <div className="arnia-graphic__hive">
          <p className="arnia-graphic__hint">Seleziona un telaino da ispezionare</p>
          <div className="arnia-graphic__telai-scroll">
            <div className="arnia-graphic__telai-row" role="list">
              {telai.map((telaino) => (
                <div key={telaino.id} role="listitem">
                  <TelainoSlot
                    telaino={telaino}
                    selected={selectedId === telaino.id}
                    onSelect={() => onSelectTelaino(telaino.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="arnia-graphic__side arnia-graphic__side--right" aria-hidden="true" />
      </div>

      <div className="arnia-graphic__base" aria-hidden="true">
        <span className="arnia-graphic__vassoio">Vassoio antivarroa</span>
      </div>

      <p className="arnia-graphic__progress">
        <strong>{inspectedCount}</strong> / {telai.length} telaini ispezionati
      </p>
    </section>
  )
}
