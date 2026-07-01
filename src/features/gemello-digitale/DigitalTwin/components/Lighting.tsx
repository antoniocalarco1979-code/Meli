export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.42} />
      <hemisphereLight args={['#fff8e8', '#3d2e1a', 0.35]} />
      <directionalLight
        castShadow
        position={[6, 10, 5]}
        intensity={1.35}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={40}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-2}
        shadow-bias={-0.0002}
      />
      <directionalLight position={[-4, 6, -3]} intensity={0.25} />
    </>
  )
}
