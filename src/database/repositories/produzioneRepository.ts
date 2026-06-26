import { db } from '../database'
import type { Produzione } from '../types'
import { generateId } from './utils'

/**
 * Repository Produzione — raccolte per arnia.
 */
export const produzioneRepository = {
  getById(id: string): Promise<Produzione | undefined> {
    return db.produzione.get(id)
  },

  getByArniaId(arniaId: string): Promise<Produzione[]> {
    return db.produzione.where('arniaId').equals(arniaId).reverse().sortBy('data')
  },

  async create(data: Omit<Produzione, 'id'>): Promise<Produzione> {
    const record: Produzione = { id: generateId(), ...data }
    await db.produzione.add(record)
    return record
  },

  async update(id: string, changes: Partial<Omit<Produzione, 'id' | 'arniaId'>>): Promise<void> {
    await db.produzione.update(id, changes)
  },

  delete(id: string): Promise<void> {
    return db.produzione.delete(id)
  },

  deleteByArniaId(arniaId: string): Promise<number> {
    return db.produzione.where('arniaId').equals(arniaId).delete()
  },
}
