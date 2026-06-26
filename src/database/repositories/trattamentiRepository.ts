import { db } from '../database'
import type { Trattamento } from '../types'
import { generateId } from './utils'

/**
 * Repository Trattamenti — sanitari per arnia.
 */
export const trattamentiRepository = {
  getById(id: string): Promise<Trattamento | undefined> {
    return db.trattamenti.get(id)
  },

  getByArniaId(arniaId: string): Promise<Trattamento[]> {
    return db.trattamenti.where('arniaId').equals(arniaId).reverse().sortBy('data')
  },

  async create(data: Omit<Trattamento, 'id'>): Promise<Trattamento> {
    const trattamento: Trattamento = { id: generateId(), ...data }
    await db.trattamenti.add(trattamento)
    return trattamento
  },

  async update(id: string, changes: Partial<Omit<Trattamento, 'id' | 'arniaId'>>): Promise<void> {
    await db.trattamenti.update(id, changes)
  },

  delete(id: string): Promise<void> {
    return db.trattamenti.delete(id)
  },

  deleteByArniaId(arniaId: string): Promise<number> {
    return db.trattamenti.where('arniaId').equals(arniaId).delete()
  },

  /** Trattamenti con scadenza entro la data indicata. */
  getInScadenzaEntro(timestamp: number): Promise<Trattamento[]> {
    return db.trattamenti
      .filter((row) => (row.scadenza ?? Number.MAX_SAFE_INTEGER) <= timestamp)
      .toArray()
  },
}
