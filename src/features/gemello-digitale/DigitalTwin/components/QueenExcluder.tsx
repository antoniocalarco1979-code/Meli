import type { ThreeElements } from '@react-three/fiber'
import { DADANT_BLATT_10 } from '../constants/dadantBlatt10'
import { woodMaterials } from '../materials/woodMaterials'

type QueenExcluderProps = ThreeElements['group'] & {
  baseY: number
  visible?: boolean
}

export function QueenExcluder({ baseY, visible = true, ...props }: QueenExcluderProps) {
  if (!visible) return null

  const { bodyWidth, bodyDepth, queenExcluderHeight, innerMargin } = DADANT_BLATT_10
  const plateW = bodyWidth - innerMargin * 2
  const plateD = bodyDepth - innerMargin * 2

  return (
    <group {...props} position={[0, baseY + queenExcluderHeight / 2, 0]} name="queen-excluder">
      <mesh castShadow receiveShadow material={woodMaterials.queenExcluder}>
        <boxGeometry args={[plateW, queenExcluderHeight, plateD]} />
      </mesh>
      <mesh position={[0, queenExcluderHeight / 2 + 0.002, 0]} material={woodMaterials.metalGrid}>
        <boxGeometry args={[plateW * 0.92, 0.004, plateD * 0.92]} />
      </mesh>
    </group>
  )
}
