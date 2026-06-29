import { getDb } from '../activeDatabase'
import type { Arnia } from '../types'
import { generateId, now } from './utils'

/**
 * Repository Arnie — colonie collegate a un apiario.
 */
export const arnieRepository = {
  getAll(): Promise<Arnia[]> {
    return getDb().arnie.orderBy('numero').toArray()
  },

  getById(id: string): Promise<Arnia | undefined> {
    return getDb().arnie.get(id)
  },

  getByApiarioId(apiarioId: string): Promise<Arnia[]> {
    return getDb().arnie.where('apiarioId').equals(apiarioId).sortBy('numero')
  },

  countByApiarioId(apiarioId: string): Promise<number> {
    return getDb().arnie.where('apiarioId').equals(apiarioId).count()
  },

  async create(data: Omit<Arnia, 'id' | 'createdAt' | 'updatedAt'>): Promise<Arnia> {
    const timestamp = now()
    const arnia: Arnia = { id: generateId(), ...data, createdAt: timestamp, updatedAt: timestamp }
    await getDb().arnie.add(arnia)
    return arnia
  },

  async update(id: string, changes: Partial<Omit<Arnia, 'id' | 'apiarioId' | 'createdAt'>>): Promise<void> {
    await getDb().arnie.update(id, { ...changes, updatedAt: now() })
  },

  delete(id: string): Promise<void> {
    return getDb().arnie.delete(id)
  },

  deleteByApiarioId(apiarioId: string): Promise<number> {
    return getDb().arnie.where('apiarioId').equals(apiarioId).delete()
  },
}
