import { db } from '../database'
import type { Apiario } from '../types'
import { generateId, now } from './utils'

/**
 * Repository Apiari — accesso CRUD alla tabella `apiari`.
 */
export const apiariRepository = {
  /** Elenco ordinato per nome. */
  getAll(): Promise<Apiario[]> {
    return db.apiari.orderBy('nome').toArray()
  },

  getById(id: string): Promise<Apiario | undefined> {
    return db.apiari.get(id)
  },

  count(): Promise<number> {
    return db.apiari.count()
  },

  async create(data: Omit<Apiario, 'id' | 'createdAt' | 'updatedAt'>): Promise<Apiario> {
    const timestamp = now()
    const apiario: Apiario = { id: generateId(), ...data, createdAt: timestamp, updatedAt: timestamp }
    await db.apiari.add(apiario)
    return apiario
  },

  async update(id: string, changes: Partial<Omit<Apiario, 'id' | 'createdAt'>>): Promise<void> {
    await db.apiari.update(id, { ...changes, updatedAt: now() })
  },

  delete(id: string): Promise<void> {
    return db.apiari.delete(id)
  },

  /** Somma denormalizzata numeroArnie (KPI dashboard). */
  sumNumeroArnie(): Promise<number> {
    return db.apiari.toArray().then((rows) => rows.reduce((sum, row) => sum + row.numeroArnie, 0))
  },
}
