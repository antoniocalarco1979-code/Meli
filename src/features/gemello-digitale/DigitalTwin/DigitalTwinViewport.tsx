import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { FrameSelectionProvider } from './context/FrameSelectionContext'
import type { Hive3DConfig } from './types/frame.types'
import { HiveScene } from './components/HiveScene'

type DigitalTwinViewportProps = Hive3DConfig & {
  className?: string
  selectedFrameId?: string | null
  onFrameSelect?: (frameId: string | null) => void
}

function SceneFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.4, 0.4, 0.4]} />
      <meshStandardMaterial color="#c9a227" wireframe />
    </mesh>
  )
}

/** Viewport Canvas — Digital Twin Engine DG-01. */
export function DigitalTwinViewport({
  className = '',
  selectedFrameId,
  onFrameSelect,
  ...config
}: DigitalTwinViewportProps) {
  return (
    <div className={`digital-twin-viewport gemello-3d-canvas${className ? ` ${className}` : ''}`}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [7, 6.5, 8], fov: 42, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={<SceneFallback />}>
          <FrameSelectionProvider selectedFrameId={selectedFrameId} onFrameSelect={onFrameSelect}>
            <HiveScene {...config} />
          </FrameSelectionProvider>
        </Suspense>
      </Canvas>
    </div>
  )
}
