import { formatDateTime } from '../../../utils/dateFormatters'
import type { GiroSessionStats } from '../types/giro.types'

export function exportGiroReport(apiarioNome: string, stats: GiroSessionStats): void {
  const lines = [
    'MELI — Report giro apiario',
    `Apiario: ${apiarioNome}`,
    `Data: ${formatDateTime(Date.now())}`,
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
