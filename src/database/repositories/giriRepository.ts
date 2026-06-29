import { getDb } from '../activeDatabase'
import type { GiroApiario, GiroApiarioStato } from '../types'
import { generateId } from './utils'

export const giriRepository = {
  getById(id: string): Promise<GiroApiario | undefined> {
    return getDb().giri.get(id)
  },

  getByApiarioId(apiarioId: string): Promise<GiroApiario[]> {
    return getDb().giri.where('apiarioId').equals(apiarioId).reverse().sortBy('startedAt')
  },

  getActiveByApiarioId(apiarioId: string): Promise<GiroApiario | undefined> {
    return getDb()
      .giri.where('[apiarioId+stato]')
      .equals([apiarioId, 'in_corso'])
      .first()
  },

  async create(data: Omit<GiroApiario, 'id'>): Promise<GiroApiario> {
    const giro: GiroApiario = { id: generateId(), ...data }
    await getDb().giri.add(giro)
    return giro
  },

  async update(id: string, changes: Partial<Omit<GiroApiario, 'id' | 'apiarioId'>>): Promise<void> {
    await getDb().giri.update(id, changes)
  },

  delete(id: string): Promise<void> {
    return getDb().giri.delete(id)
  },

  deleteByApiarioId(apiarioId: string): Promise<number> {
    return getDb().giri.where('apiarioId').equals(apiarioId).delete()
  },

  async updateStato(id: string, stato: GiroApiarioStato, patch: Partial<GiroApiario> = {}): Promise<GiroApiario | undefined> {
    await getDb().giri.update(id, { stato, ...patch })
    return getDb().giri.get(id)
  },
}
