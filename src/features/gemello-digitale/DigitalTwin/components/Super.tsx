import type { ThreeElements } from '@react-three/fiber'
import { DADANT_BLATT_10 } from '../constants/dadantBlatt10'
import { woodMaterials } from '../materials/woodMaterials'

type SuperProps = ThreeElements['group'] & {
  baseY: number
  visible?: boolean
}

/** Melario / super. */
export function Super({ baseY, visible = true, ...props }: SuperProps) {
  if (!visible) return null

  const { bodyWidth, bodyDepth, superHeight, wallThickness } = DADANT_BLATT_10
  const centerY = baseY + superHeight / 2

  return (
    <group {...props} name="super">
      <mesh
        position={[0, centerY, bodyDepth / 2 - wallThickness / 2]}
        castShadow
        receiveShadow
        material={woodMaterials.super}
      >
        <boxGeometry args={[bodyWidth, superHeight, wallThickness]} />
      </mesh>
      <mesh
        position={[0, centerY, -bodyDepth / 2 + wallThickness / 2]}
        castShadow
        receiveShadow
        material={woodMaterials.super}
      >
        <boxGeometry args={[bodyWidth, superHeight, wallThickness]} />
      </mesh>
      <mesh
        position={[-bodyWidth / 2 + wallThickness / 2, centerY, 0]}
        castShadow
        receiveShadow
        material={woodMaterials.super}
      >
        <boxGeometry args={[wallThickness, superHeight, bodyDepth - wallThickness * 2]} />
      </mesh>
      <mesh
        position={[bodyWidth / 2 - wallThickness / 2, centerY, 0]}
        castShadow
        receiveShadow
        material={woodMaterials.super}
      >
        <boxGeometry args={[wallThickness, superHeight, bodyDepth - wallThickness * 2]} />
      </mesh>
    </group>
  )
}
