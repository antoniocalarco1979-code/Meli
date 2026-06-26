import { db } from '../database'
import type { Visita } from '../types'
import { generateId } from './utils'

/**
 * Repository Visite — ispezioni collegate a un'arnia.
 */
export const visiteRepository = {
  getById(id: string): Promise<Visita | undefined> {
    return db.visite.get(id)
  },

  getByArniaId(arniaId: string): Promise<Visita[]> {
    return db.visite.where('arniaId').equals(arniaId).reverse().sortBy('data')
  },

  async create(data: Omit<Visita, 'id'>): Promise<Visita> {
    const visita: Visita = { id: generateId(), ...data }
    await db.visite.add(visita)
    return visita
  },

  async update(id: string, changes: Partial<Omit<Visita, 'id' | 'arniaId'>>): Promise<void> {
    await db.visite.update(id, changes)
  },

  delete(id: string): Promise<void> {
    return db.visite.delete(id)
  },

  deleteByArniaId(arniaId: string): Promise<number> {
    return db.visite.where('arniaId').equals(arniaId).delete()
  },
}
