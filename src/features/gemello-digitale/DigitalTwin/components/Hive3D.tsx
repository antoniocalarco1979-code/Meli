import { computeHiveStackY, DADANT_BLATT_10 } from '../constants/dadantBlatt10'
import type { Hive3DConfig } from '../types/frame.types'
import { Body } from './Body'
import { BottomBoard } from './BottomBoard'
import { FramesRow } from './FramesRow'
import { QueenExcluder } from './QueenExcluder'
import { Roof } from './Roof'
import { Super } from './Super'

type Hive3DProps = Hive3DConfig

/** Assemblaggio Dadant-Blatt 10 favi. */
export function Hive3D({
  frameCount = DADANT_BLATT_10.frameCount,
  showSuper = true,
  showQueenExcluder = true,
}: Hive3DProps) {
  const stack = computeHiveStackY()

  return (
    <group name="hive-3d">
      <BottomBoard baseY={stack.bottomBoardBase} />
      <Body baseY={stack.bodyBase} />
      <FramesRow bodyBaseY={stack.bodyBase} count={frameCount} />
      <QueenExcluder baseY={stack.queenExcluderBase} visible={showQueenExcluder} />
      <Super baseY={stack.superBase} visible={showSuper} />
      <Roof innerCoverBaseY={stack.innerCoverBase} roofBaseY={stack.roofBase} />
    </group>
  )
}
