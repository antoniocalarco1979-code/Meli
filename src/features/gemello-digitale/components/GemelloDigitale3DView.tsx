import { lazy, Suspense, useMemo } from 'react'
import { motion } from 'framer-motion'
import type { Arnia } from '../../../database/types'
import { DADANT_BLATT_10 } from '../DigitalTwin/constants/dadantBlatt10'
import '../styles/gemello-3d.css'

const DigitalTwinViewport = lazy(() =>
  import('../DigitalTwin/DigitalTwinViewport').then((mod) => ({
    default: mod.DigitalTwinViewport,
  })),
)

type GemelloDigitale3DViewProps = {
  arnia: Arnia
  selectedFrameId?: string | null
  onFrameSelect?: (frameId: string | null) => void
}

export function GemelloDigitale3DView({
  arnia,
  selectedFrameId,
  onFrameSelect,
}: GemelloDigitale3DViewProps) {
  const engineProps = useMemo(
    () => ({
      frameCount: arnia.numeroTelai || DADANT_BLATT_10.frameCount,
      showSuper: arnia.hasMelario,
      showQueenExcluder: true,
    }),
    [arnia.hasMelario, arnia.numeroTelai],
  )

  return (
    <motion.div
      className="gemello-3d-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="gemello-3d-view__toolbar">
        <span className="gemello-3d-view__spec">{DADANT_BLATT_10.label}</span>
      </div>

      <Suspense
        fallback={
          <div className="gemello-3d-view__loading meli-glass" aria-busy="true">
            Caricamento motore 3D…
          </div>
        }
      >
        <DigitalTwinViewport
          {...engineProps}
          selectedFrameId={selectedFrameId}
          onFrameSelect={onFrameSelect}
        />
      </Suspense>

      <p className="gemello-3d-view__hint">
        Clicca un telaino per aprire il pannello · trascina per ruotare · scroll per zoom
      </p>
    </motion.div>
  )
}
