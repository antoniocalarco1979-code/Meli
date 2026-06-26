import { db } from '../database'
import type { Arnia } from '../types'
import { generateId, now } from './utils'

/**
 * Repository Arnie — colonie collegate a un apiario.
 */
export const arnieRepository = {
  getAll(): Promise<Arnia[]> {
    return db.arnie.orderBy('numero').toArray()
  },

  getById(id: string): Promise<Arnia | undefined> {
    return db.arnie.get(id)
  },

  getByApiarioId(apiarioId: string): Promise<Arnia[]> {
    return db.arnie.where('apiarioId').equals(apiarioId).sortBy('numero')
  },

  countByApiarioId(apiarioId: string): Promise<number> {
    return db.arnie.where('apiarioId').equals(apiarioId).count()
  },

  async create(data: Omit<Arnia, 'id' | 'createdAt' | 'updatedAt'>): Promise<Arnia> {
    const timestamp = now()
    const arnia: Arnia = { id: generateId(), ...data, createdAt: timestamp, updatedAt: timestamp }
    await db.arnie.add(arnia)
    return arnia
  },

  async update(id: string, changes: Partial<Omit<Arnia, 'id' | 'apiarioId' | 'createdAt'>>): Promise<void> {
    await db.arnie.update(id, { ...changes, updatedAt: now() })
  },

  delete(id: string): Promise<void> {
    return db.arnie.delete(id)
  },

  deleteByApiarioId(apiarioId: string): Promise<number> {
    return db.arnie.where('apiarioId').equals(apiarioId).delete()
  },
}
