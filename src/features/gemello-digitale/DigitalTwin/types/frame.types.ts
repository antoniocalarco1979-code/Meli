/** Identità telaino — pronta per selezione sprint futuri. */
export type FrameIdentity = {
  id: string
  index: number
}

export type FrameSelectionState = {
  selectedFrameId: string | null
  hoveredFrameId: string | null
}

export type Hive3DConfig = {
  frameCount?: number
  showSuper?: boolean
  showQueenExcluder?: boolean
}
