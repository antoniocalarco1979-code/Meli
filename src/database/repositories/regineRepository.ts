import { getDb } from '../activeDatabase'
import type { Regina } from '../types'
import { generateId } from './utils'

/**
 * Repository Regine — anagrafica regine per arnia.
 */
export const regineRepository = {
  getById(id: string): Promise<Regina | undefined> {
    return getDb().regine.get(id)
  },

  getByArniaId(arniaId: string): Promise<Regina[]> {
    return getDb().regine.where('arniaId').equals(arniaId).reverse().sortBy('anno')
  },

  /** Regina attualmente referenziata da Arnia.reginaAttualeId. */
  async getAttualeByArniaId(arniaId: string): Promise<Regina | undefined> {
    const arnia = await getDb().arnie.get(arniaId)
    if (!arnia?.reginaAttualeId) return undefined
    return getDb().regine.get(arnia.reginaAttualeId)
  },

  async create(data: Omit<Regina, 'id'>): Promise<Regina> {
    const regina: Regina = { id: generateId(), ...data }
    await getDb().regine.add(regina)
    return regina
  },

  async update(id: string, changes: Partial<Omit<Regina, 'id' | 'arniaId'>>): Promise<void> {
    await getDb().regine.update(id, changes)
  },

  delete(id: string): Promise<void> {
    return getDb().regine.delete(id)
  },

  deleteByArniaId(arniaId: string): Promise<number> {
    return getDb().regine.where('arniaId').equals(arniaId).delete()
  },
}
