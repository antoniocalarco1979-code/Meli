import { getDb } from '../activeDatabase'
import type { Produzione } from '../types'
import { generateId } from './utils'

const SMIELATURA_TIPO = 'smielatura'

function isSmielatura(row: Produzione): boolean {
  return row.tipo === SMIELATURA_TIPO || Boolean(row.apiarioId)
}

/**
 * Repository Produzione — raccolte per arnia e smielature apiario.
 */
export const produzioneRepository = {
  getById(id: string): Promise<Produzione | undefined> {
    return getDb().produzione.get(id)
  },

  getByArniaId(arniaId: string): Promise<Produzione[]> {
    return getDb().produzione.where('arniaId').equals(arniaId).reverse().sortBy('data')
  },

  async getAllSmielature(): Promise<Produzione[]> {
    const rows = await getDb().produzione.toArray()
    return rows.filter(isSmielatura).sort((a, b) => b.data - a.data)
  },

  getSmielatureByApiarioId(apiarioId: string): Promise<Produzione[]> {
    return getDb()
      .produzione.where('apiarioId')
      .equals(apiarioId)
      .reverse()
      .sortBy('data')
  },

  async create(data: Omit<Produzione, 'id'>): Promise<Produzione> {
    const record: Produzione = { id: generateId(), ...data }
    await getDb().produzione.add(record)
    return record
  },

  async update(
    id: string,
    changes: Partial<Omit<Produzione, 'id' | 'arniaId' | 'apiarioId'>>,
  ): Promise<void> {
    await getDb().produzione.update(id, changes)
  },

  delete(id: string): Promise<void> {
    return getDb().produzione.delete(id)
  },

  deleteByArniaId(arniaId: string): Promise<number> {
    return getDb().produzione.where('arniaId').equals(arniaId).delete()
  },
}
