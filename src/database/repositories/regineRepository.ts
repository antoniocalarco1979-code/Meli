import { db } from '../database'
import type { Regina } from '../types'
import { generateId } from './utils'

/**
 * Repository Regine — anagrafica regine per arnia.
 */
export const regineRepository = {
  getById(id: string): Promise<Regina | undefined> {
    return db.regine.get(id)
  },

  getByArniaId(arniaId: string): Promise<Regina[]> {
    return db.regine.where('arniaId').equals(arniaId).reverse().sortBy('anno')
  },

  /** Regina attualmente referenziata da Arnia.reginaAttualeId. */
  async getAttualeByArniaId(arniaId: string): Promise<Regina | undefined> {
    const arnia = await db.arnie.get(arniaId)
    if (!arnia?.reginaAttualeId) return undefined
    return db.regine.get(arnia.reginaAttualeId)
  },

  async create(data: Omit<Regina, 'id'>): Promise<Regina> {
    const regina: Regina = { id: generateId(), ...data }
    await db.regine.add(regina)
    return regina
  },

  async update(id: string, changes: Partial<Omit<Regina, 'id' | 'arniaId'>>): Promise<void> {
    await db.regine.update(id, changes)
  },

  delete(id: string): Promise<void> {
    return db.regine.delete(id)
  },

  deleteByArniaId(arniaId: string): Promise<number> {
    return db.regine.where('arniaId').equals(arniaId).delete()
  },
}
