import { getDb } from '../activeDatabase'
import type { Visita } from '../types'
import { generateId } from './utils'

/**
 * Repository Visite — ispezioni collegate a un'arnia.
 */
export const visiteRepository = {
  getById(id: string): Promise<Visita | undefined> {
    return getDb().visite.get(id)
  },

  getByArniaId(arniaId: string): Promise<Visita[]> {
    return getDb().visite.where('arniaId').equals(arniaId).reverse().sortBy('data')
  },

  async create(data: Omit<Visita, 'id'>): Promise<Visita> {
    const visita: Visita = { id: generateId(), ...data }
    await getDb().visite.add(visita)
    return visita
  },

  async update(id: string, changes: Partial<Omit<Visita, 'id' | 'arniaId'>>): Promise<void> {
    await getDb().visite.update(id, changes)
  },

  delete(id: string): Promise<void> {
    return getDb().visite.delete(id)
  },

  deleteByArniaId(arniaId: string): Promise<number> {
    return getDb().visite.where('arniaId').equals(arniaId).delete()
  },
}
