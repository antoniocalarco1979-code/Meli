import type { GemelloDigitaleModel } from '../types/gemelloDigitale.types'
import { EscludiRegina } from './EscludiRegina'
import type { MelarioClickEvent } from './Melario'
import { Melario } from './Melario'
import { Nido } from './Nido'

type ArniaStackSceneProps = {
  model: GemelloDigitaleModel
  liftedMelarioIds: ReadonlySet<string>
  escludiReginaVisible: boolean
  selectedMelarioId: string | null
  onMelarioClick: (event: MelarioClickEvent) => void
  onEscludiReginaRemove: () => void
  onNidoClick: () => void
}

export function ArniaStackScene({
  model,
  liftedMelarioIds,
  escludiReginaVisible,
  selectedMelarioId,
  onMelarioClick,
  onEscludiReginaRemove,
  onNidoClick,
}: ArniaStackSceneProps) {
  const orderedMelari = [...model.melari].sort((a, b) => b.stackIndex - a.stackIndex)

  return (
    <section className="gemello-stack" aria-label="Vista impilata arnia">
      <div className="gemello-stack__roof" aria-hidden="true">
        <span className="gemello-stack__roof-cap" />
      </div>

      <div className="gemello-stack__tower">
        {orderedMelari.map((melario) => (
          <Melario
            key={melario.id}
            melario={melario}
            lifted={liftedMelarioIds.has(melario.id)}
            selected={selectedMelarioId === melario.id}
            onClick={onMelarioClick}
          />
        ))}

        <EscludiRegina
          escludi={model.escludiRegina}
          visible={escludiReginaVisible}
          onRemove={onEscludiReginaRemove}
        />

        <Nido nido={model.nido} selected={false} onClick={onNidoClick} />
      </div>

      {model.hasVassoio && (
        <div className="gemello-stack__base" aria-hidden="true">
          <span className="gemello-stack__vassoio">Vassoio antivarroa</span>
        </div>
      )}

      <p className="gemello-stack__hint">
        Solleva un <strong>melario</strong>, rimuovi l&apos;<strong>escludi regina</strong>, entra nel{' '}
        <strong>nido</strong>.
      </p>
    </section>
  )
}
