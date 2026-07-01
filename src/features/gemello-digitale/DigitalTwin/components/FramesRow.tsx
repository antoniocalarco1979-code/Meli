import { useMemo } from 'react'
import { DADANT_BLATT_10 } from '../constants/dadantBlatt10'
import { buildFrameIdentities, computeFrameLayout } from '../utils/computeFrameLayout'
import { Frame } from './Frame'

type FramesRowProps = {
  bodyBaseY: number
  count?: number
}

export function FramesRow({ bodyBaseY, count = DADANT_BLATT_10.frameCount }: FramesRowProps) {
  const identities = useMemo(() => buildFrameIdentities(count), [count])
  const layout = useMemo(() => computeFrameLayout(count, bodyBaseY), [count, bodyBaseY])

  return (
    <group name="frames">
      {identities.map((identity, index) => (
        <Frame
          key={identity.id}
          identity={identity}
          position={layout.positions[index]!}
          height={layout.frameHeight}
          depth={layout.innerDepth}
        />
      ))}
    </group>
  )
}
