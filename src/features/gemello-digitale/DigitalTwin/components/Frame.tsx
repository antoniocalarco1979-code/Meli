import { useMemo } from 'react'
import type { ThreeElements } from '@react-three/fiber'
import { DADANT_BLATT_10 } from '../constants/dadantBlatt10'
import { useFrameSelectionOptional } from '../context/FrameSelectionContext'
import { woodMaterials } from '../materials/woodMaterials'
import type { FrameIdentity } from '../types/frame.types'

type FrameProps = ThreeElements['mesh'] & {
  identity: FrameIdentity
  position: [number, number, number]
  height: number
  depth: number
}

export function Frame({ identity, position, height, depth, ...props }: FrameProps) {
  const selection = useFrameSelectionOptional()
  const selected = selection?.selectedFrameId === identity.id
  const hovered = selection?.hoveredFrameId === identity.id

  const material = useMemo(() => {
    if (selected) return woodMaterials.frameSelected
    if (hovered) return woodMaterials.frameHovered
    return woodMaterials.frame
  }, [selected, hovered])

  return (
    <mesh
      {...props}
      name={`frame-${identity.index}`}
      position={position}
      material={material}
      castShadow
      receiveShadow
      userData={{ hivePart: 'frame', frameId: identity.id, frameIndex: identity.index }}
      onClick={(event) => {
        event.stopPropagation()
        selection?.selectFrame(identity.id)
      }}
      onPointerOver={(event) => {
        event.stopPropagation()
        document.body.style.cursor = 'pointer'
        selection?.hoverFrame(identity.id)
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
        selection?.hoverFrame(null)
      }}
    >
      <boxGeometry args={[DADANT_BLATT_10.frameThickness, height, depth]} />
    </mesh>
  )
}
