import { OrbitControls } from '@react-three/drei'
import { computeHiveStackY } from '../constants/dadantBlatt10'

export function Controls() {
  const stack = computeHiveStackY()
  const targetY = stack.totalHeight / 2

  return (
    <OrbitControls
      makeDefault
      target={[0, targetY, 0]}
      enablePan
      enableZoom
      enableRotate
      minDistance={5}
      maxDistance={18}
      maxPolarAngle={Math.PI / 2.05}
      minPolarAngle={0.15}
    />
  )
}
