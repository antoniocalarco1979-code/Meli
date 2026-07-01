import type { ThreeElements } from '@react-three/fiber'
import { DADANT_BLATT_10 } from '../constants/dadantBlatt10'
import { woodMaterials } from '../materials/woodMaterials'

type RoofProps = ThreeElements['group'] & {
  innerCoverBaseY: number
  roofBaseY: number
}

/** Coprifavo + tetto telescopico. */
export function Roof({ innerCoverBaseY, roofBaseY, ...props }: RoofProps) {
  const { bodyWidth, bodyDepth, innerCoverHeight, innerMargin, roofPeakHeight, roofOverhang } =
    DADANT_BLATT_10
  const roofW = bodyWidth + roofOverhang * 2
  const roofD = bodyDepth + roofOverhang * 2
  const halfH = roofPeakHeight / 2

  return (
    <group {...props} name="roof">
      <mesh
        position={[0, innerCoverBaseY + innerCoverHeight / 2, 0]}
        castShadow
        receiveShadow
        material={woodMaterials.innerCover}
      >
        <boxGeometry
          args={[bodyWidth - innerMargin * 0.5, innerCoverHeight, bodyDepth - innerMargin * 0.5]}
        />
      </mesh>

      <group position={[0, roofBaseY, 0]}>
        <mesh
          position={[0, halfH, roofD / 4]}
          rotation={[Math.PI / 5.5, 0, 0]}
          castShadow
          receiveShadow
          material={woodMaterials.roof}
        >
          <boxGeometry args={[roofW, 0.06, roofD / 2 + 0.05]} />
        </mesh>
        <mesh
          position={[0, halfH, -roofD / 4]}
          rotation={[-Math.PI / 5.5, 0, 0]}
          castShadow
          receiveShadow
          material={woodMaterials.roof}
        >
          <boxGeometry args={[roofW, 0.06, roofD / 2 + 0.05]} />
        </mesh>
        <mesh position={[0, roofPeakHeight - 0.02, 0]} castShadow material={woodMaterials.roof}>
          <boxGeometry args={[roofW * 0.95, 0.05, 0.12]} />
        </mesh>
      </group>
    </group>
  )
}
