import { formatDateTime, formatDuration } from '../../../utils/dateFormatters'
import type { GiroSessionStats } from '../types/giro.types'

export function exportGiroReport(apiarioNome: string, stats: GiroSessionStats): void {
  const elapsedSeconds =
    stats.durataSecondi ??
    (stats.completedAt ? Math.max(0, Math.round((stats.completedAt - stats.startedAt) / 1000)) : 0)

  const lines = [
    'MELI — Report giro apiario',
    `Apiario: ${apiarioNome}`,
    `Data: ${formatDateTime(Date.now())}`,
    '',
    `${stats.arnieVisitate} arnie visitate`,
    `Tempo impiegato: ${formatDuration(elapsedSeconds)}`,
    `${stats.noteInserite} note inserite`,
    `${stats.foto} foto scattate`,
    `${stats.trattamenti} trattamenti`,
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
