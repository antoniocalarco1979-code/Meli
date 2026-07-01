/**
 * Dadant-Blatt 10 favi — unità scena: 1 u = 10 cm.
 * Esterno ~465 × 375 mm, altezza corpo ~243 mm.
 */
export const DADANT_BLATT_10 = {
  label: 'Dadant-Blatt 10 favi',
  bodyWidth: 4.65,
  bodyDepth: 3.75,
  boxHeight: 2.43,
  frameCount: 10,
  frameThickness: 0.028,
  wallThickness: 0.022,
  bottomBoardHeight: 0.045,
  queenExcluderHeight: 0.018,
  innerCoverHeight: 0.032,
  roofPeakHeight: 0.38,
  roofOverhang: 0.12,
  superHeight: 2.43,
  innerMargin: 0.06,
} as const

export type DadantBlatt10Spec = typeof DADANT_BLATT_10

export function computeHiveStackY(spec: DadantBlatt10Spec = DADANT_BLATT_10) {
  const bottomBoardBase = 0
  const bodyBase = bottomBoardBase + spec.bottomBoardHeight
  const queenExcluderBase = bodyBase + spec.boxHeight
  const superBase = queenExcluderBase + spec.queenExcluderHeight
  const innerCoverBase = superBase + spec.superHeight
  const roofBase = innerCoverBase + spec.innerCoverHeight

  return {
    bottomBoardBase,
    bodyBase,
    queenExcluderBase,
    superBase,
    innerCoverBase,
    roofBase,
    totalHeight: roofBase + spec.roofPeakHeight,
  }
}
