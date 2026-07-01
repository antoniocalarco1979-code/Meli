import { DADANT_BLATT_10 } from '../constants/dadantBlatt10'
import type { FrameIdentity } from '../types/frame.types'

export function buildFrameIdentities(count: number): FrameIdentity[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `frame-${index + 1}`,
    index: index + 1,
  }))
}

export function computeFrameLayout(count: number, bodyBaseY: number) {
  const spec = DADANT_BLATT_10
  const innerWidth = spec.bodyWidth - spec.wallThickness * 2 - spec.innerMargin * 2
  const innerDepth = spec.bodyDepth - spec.wallThickness * 2 - spec.innerMargin * 2
  const frameHeight = spec.boxHeight - spec.innerMargin * 2
  const totalFramesWidth = count * spec.frameThickness
  const gap = (innerWidth - totalFramesWidth) / (count + 1)
  const centerY = bodyBaseY + spec.boxHeight / 2

  const positions: [number, number, number][] = []
  for (let i = 0; i < count; i += 1) {
    const x =
      -innerWidth / 2 + gap + spec.frameThickness / 2 + i * (spec.frameThickness + gap)
    positions.push([x, centerY, 0])
  }

  return { positions, frameHeight, innerDepth, centerY }
}
