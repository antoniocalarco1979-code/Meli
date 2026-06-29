export type GiroSessionStats = {
  arnieVisitate: number
  trattamenti: number
  foto: number
  regineDaControllare: number
}

export const emptyGiroSessionStats = (): GiroSessionStats => ({
  arnieVisitate: 0,
  trattamenti: 0,
  foto: 0,
  regineDaControllare: 0,
})

export function accumulateGiroStats(
  current: GiroSessionStats,
  visit: { fotoCount: number; hadTrattamento: boolean; reginaNonVista: boolean },
): GiroSessionStats {
  return {
    arnieVisitate: current.arnieVisitate + 1,
    trattamenti: current.trattamenti + (visit.hadTrattamento ? 1 : 0),
    foto: current.foto + visit.fotoCount,
    regineDaControllare: current.regineDaControllare + (visit.reginaNonVista ? 1 : 0),
  }
}
