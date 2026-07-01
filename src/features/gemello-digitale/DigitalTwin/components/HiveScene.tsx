import { ContactShadows } from '@react-three/drei'
import type { Hive3DConfig } from '../types/frame.types'
import { Controls } from './Controls'
import { Hive3D } from './Hive3D'
import { Lighting } from './Lighting'

export function HiveScene(props: Hive3DConfig) {
  return (
    <>
      <color attach="background" args={['#1c1814']} />
      <fog attach="fog" args={['#1c1814', 12, 28]} />

      <Lighting />
      <Controls />

      <Hive3D {...props} />

      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={0.45}
        scale={14}
        blur={2.5}
        far={12}
        color="#000000"
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[24, 24]} />
        <shadowMaterial transparent opacity={0.18} />
      </mesh>
    </>
  )
}
