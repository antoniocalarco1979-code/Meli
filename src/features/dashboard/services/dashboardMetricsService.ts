import { withReadTransaction } from '../../../database/readTransaction'
import type { Visita } from '../../../database/types'
import { formatRelativeDate } from '../../../utils/dateFormatters'
import { computeSalute } from '../../arnie/utils/arniaFormatters'

const VISITA_RECENTE_MS = 10 * 86_400_000
const TRATTAMENTO_SCADENZA_WINDOW_MS = 14 * 86_400_000

export type DashboardOperationalMetrics = {
  arnieDaControllare: number
  trattamentiInScadenza: number
  regineDaSostituire: number
}

export async function getDashboardOperationalMetrics(
  apiarioId: string,
): Promise<DashboardOperationalMetrics> {
  try {
    return await withReadTransaction(async (db) => {
      const arnie = await db.arnie.where('apiarioId').equals(apiarioId).toArray()
      if (arnie.length === 0) {
        return { arnieDaControllare: 0, trattamentiInScadenza: 0, regineDaSostituire: 0 }
      }

      const arniaIds = arnie.map((a) => a.id)
      const [visite, trattamenti] = await Promise.all([
        db.visite.where('arniaId').anyOf(arniaIds).toArray(),
        db.trattamenti.where('arniaId').anyOf(arniaIds).toArray(),
      ])

      const lastVisitaByArnia = new Map<string, Visita>()
      for (const visita of visite.sort((a, b) => b.data - a.data)) {
        if (!lastVisitaByArnia.has(visita.arniaId)) {
          lastVisitaByArnia.set(visita.arniaId, visita)
        }
      }

      const now = Date.now()
      let arnieDaControllare = 0
      let regineDaSostituire = 0

      for (const arnia of arnie) {
        if (arnia.stato === 'inattiva' || arnia.stato === 'morta') continue

        const lastVisita = lastVisitaByArnia.get(arnia.id)
        const visitaNonRecente =
          !lastVisita || now - lastVisita.data >= VISITA_RECENTE_MS
        if (visitaNonRecente) arnieDaControllare++

        if (arnia.stato === 'senza_regina' || lastVisita?.reginaVista === false) {
          regineDaSostituire++
        }
      }

      const trattamentiInScadenza = trattamenti.filter(
        (t) => t.scadenza != null && t.scadenza <= now + TRATTAMENTO_SCADENZA_WINDOW_MS,
      ).length

      return { arnieDaControllare, trattamentiInScadenza, regineDaSostituire }
    })
  } catch (err) {
    console.warn('[MELI] getDashboardOperationalMetrics:', err)
    return { arnieDaControllare: 0, trattamentiInScadenza: 0, regineDaSostituire: 0 }
  }
}

export async function getDashboardLiveMetrics() {
  try {
    return await withReadTransaction(async (db) => {
      const [arnie, visite] = await Promise.all([db.arnie.toArray(), db.visite.toArray()])

      const ultimaVisita = visite.sort((a, b) => b.data - a.data)[0]
      const saluteValues = arnie.map((a) => computeSalute(a.stato, undefined, a.forzaFamiglia))
      const saluteMedia =
        saluteValues.length > 0
          ? Math.round(saluteValues.reduce((s, v) => s + v, 0) / saluteValues.length)
          : 0

      return {
        ultimaVisitaLabel: ultimaVisita ? formatRelativeDate(ultimaVisita.data) : '—',
        indiceSalute: saluteMedia,
      }
    })
  } catch (err) {
    console.warn('[MELI] getDashboardLiveMetrics:', err)
    return { ultimaVisitaLabel: '—', indiceSalute: 0 }
  }
}
