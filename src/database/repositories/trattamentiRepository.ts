import { getDb } from '../activeDatabase'
import type { Trattamento } from '../types'

/**
 * Repository Trattamenti — sanitari per arnia.
 */
export const trattamentiRepository = {
  getById(id: string): Promise<Trattamento | undefined> {
    return getDb().trattamenti.get(id)
  },

  getAll(): Promise<Trattamento[]> {
    return getDb().trattamenti.orderBy('data').reverse().toArray()
  },

  getByArniaId(arniaId: string): Promise<Trattamento[]> {
    return getDb().trattamenti.where('arniaId').equals(arniaId).reverse().sortBy('data')
  },

  async create(trattamento: Trattamento): Promise<Trattamento> {
    await getDb().trattamenti.add(trattamento)
    return trattamento
  },

  async update(id: string, changes: Partial<Omit<Trattamento, 'id' | 'arniaId'>>): Promise<void> {
    await getDb().trattamenti.update(id, changes)
  },

  delete(id: string): Promise<void> {
    return getDb().trattamenti.delete(id)
  },

  deleteByArniaId(arniaId: string): Promise<number> {
    return getDb().trattamenti.where('arniaId').equals(arniaId).delete()
  },

  /** Trattamenti con scadenza entro la data indicata. */
  getInScadenzaEntro(timestamp: number): Promise<Trattamento[]> {
    return getDb().trattamenti
      .filter((row) => (row.scadenza ?? Number.MAX_SAFE_INTEGER) <= timestamp)
      .toArray()
  },

  /** Promemoria calendario programmati — base per calendario / notifiche future. */
  getPromemoriaProgrammati(): Promise<Trattamento[]> {
    return getDb().trattamenti
      .filter((row) => row.promemoriaCalendario?.stato === 'programmato')
      .toArray()
  },
}
