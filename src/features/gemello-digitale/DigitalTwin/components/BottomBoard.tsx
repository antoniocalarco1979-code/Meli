import type { ThreeElements } from '@react-three/fiber'
import { DADANT_BLATT_10 } from '../constants/dadantBlatt10'
import { woodMaterials } from '../materials/woodMaterials'

type BottomBoardProps = ThreeElements['group'] & {
  baseY: number
}

export function BottomBoard({ baseY, ...props }: BottomBoardProps) {
  const { bodyWidth, bodyDepth, bottomBoardHeight } = DADANT_BLATT_10

  return (
    <group {...props} position={[0, baseY + bottomBoardHeight / 2, 0]} name="bottom-board">
      <mesh castShadow receiveShadow material={woodMaterials.bottomBoard}>
        <boxGeometry args={[bodyWidth + 0.08, bottomBoardHeight, bodyDepth + 0.08]} />
      </mesh>
    </group>
  )
}
