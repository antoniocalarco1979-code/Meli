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

export function exportGiroReport(apiarioNome: string, stats: GiroSessionStats): void {
  const lines = [
    'MELI — Report giro apiario',
    `Apiario: ${apiarioNome}`,
    `Data: ${new Date().toLocaleString('it-IT')}`,
    '',
    `${stats.arnieVisitate} arnie visitate`,
    `${stats.trattamenti} trattamenti`,
    `${stats.foto} foto`,
    `${stats.regineDaControllare} regine da controllare`,
  ]

  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `meli-giro-${apiarioNome.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.txt`
  anchor.click()
  URL.revokeObjectURL(url)
}
