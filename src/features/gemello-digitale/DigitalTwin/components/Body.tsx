import type { ThreeElements } from '@react-three/fiber'
import { DADANT_BLATT_10 } from '../constants/dadantBlatt10'
import { woodMaterials } from '../materials/woodMaterials'

type BodyProps = ThreeElements['group'] & {
  baseY: number
}

export function Body({ baseY, ...props }: BodyProps) {
  const { bodyWidth, bodyDepth, boxHeight, wallThickness } = DADANT_BLATT_10
  const centerY = baseY + boxHeight / 2

  return (
    <group {...props} name="body">
      <mesh
        position={[0, centerY, bodyDepth / 2 - wallThickness / 2]}
        castShadow
        receiveShadow
        material={woodMaterials.body}
      >
        <boxGeometry args={[bodyWidth, boxHeight, wallThickness]} />
      </mesh>
      <mesh
        position={[0, centerY, -bodyDepth / 2 + wallThickness / 2]}
        castShadow
        receiveShadow
        material={woodMaterials.body}
      >
        <boxGeometry args={[bodyWidth, boxHeight, wallThickness]} />
      </mesh>
      <mesh
        position={[-bodyWidth / 2 + wallThickness / 2, centerY, 0]}
        castShadow
        receiveShadow
        material={woodMaterials.body}
      >
        <boxGeometry args={[wallThickness, boxHeight, bodyDepth - wallThickness * 2]} />
      </mesh>
      <mesh
        position={[bodyWidth / 2 - wallThickness / 2, centerY, 0]}
        castShadow
        receiveShadow
        material={woodMaterials.body}
      >
        <boxGeometry args={[wallThickness, boxHeight, bodyDepth - wallThickness * 2]} />
      </mesh>
    </group>
  )
}
