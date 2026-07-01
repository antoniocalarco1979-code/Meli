import * as THREE from 'three'

const PALETTE = {
  pine: '#c4a574',
  pineDark: '#8b6914',
  pineLight: '#dcc9a0',
  cedar: '#a67c52',
  roof: '#6d4c2e',
  frame: '#e8d4b0',
  frameEdge: '#9a7348',
} as const

function wood(
  color: string,
  options?: Partial<THREE.MeshStandardMaterialParameters>,
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.82,
    metalness: 0.04,
    ...options,
  })
}

export const woodMaterials = {
  bottomBoard: wood(PALETTE.pineDark, { roughness: 0.9 }),
  body: wood(PALETTE.pine, { roughness: 0.78 }),
  frame: wood(PALETTE.frame, { roughness: 0.72 }),
  frameSelected: wood('#f0c040', {
    roughness: 0.65,
    emissive: '#3d2e0a',
    emissiveIntensity: 0.12,
  }),
  frameHovered: wood('#edd898', { roughness: 0.7 }),
  queenExcluder: wood(PALETTE.cedar, { roughness: 0.75, metalness: 0.08 }),
  super: wood(PALETTE.pine, { roughness: 0.76 }),
  innerCover: wood(PALETTE.pineDark, { roughness: 0.88 }),
  roof: wood(PALETTE.roof, { roughness: 0.92 }),
  metalGrid: wood(PALETTE.frameEdge, { roughness: 0.8 }),
} as const
