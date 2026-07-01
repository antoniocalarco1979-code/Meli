import { getDb } from '../activeDatabase'
import type { Foto } from '../types'
import { generateId, now } from './utils'

/**
 * Repository Foto — allegati multimediali.
 */
export const fotoRepository = {
  getById(id: string): Promise<Foto | undefined> {
    return getDb().foto.get(id)
  },

  getByVisitaId(visitaId: string): Promise<Foto[]> {
    return getDb().foto.where('visitaId').equals(visitaId).reverse().sortBy('data')
  },

  getByApiarioId(apiarioId: string): Promise<Foto[]> {
    return getDb().foto.where('apiarioId').equals(apiarioId).reverse().sortBy('data')
  },

  getByArniaId(arniaId: string): Promise<Foto[]> {
    return getDb().foto.where('arniaId').equals(arniaId).reverse().sortBy('data')
  },

  getByReginaId(reginaId: string): Promise<Foto[]> {
    return getDb().foto.where('reginaId').equals(reginaId).reverse().sortBy('data')
  },

  getLatestByApiarioId(apiarioId: string): Promise<Foto | undefined> {
    return getDb().foto.where('apiarioId').equals(apiarioId).reverse().sortBy('data').then((rows) => rows[0])
  },

  async create(data: Omit<Foto, 'id'>): Promise<Foto> {
    const foto: Foto = { id: generateId(), ...data, data: data.data ?? now() }
    await getDb().foto.add(foto)
    return foto
  },

  async update(id: string, changes: Partial<Omit<Foto, 'id'>>): Promise<void> {
    await getDb().foto.update(id, changes)
  },

  delete(id: string): Promise<void> {
    return getDb().foto.delete(id)
  },

  deleteByApiarioId(apiarioId: string): Promise<number> {
    return getDb().foto.where('apiarioId').equals(apiarioId).delete()
  },

  deleteByArniaId(arniaId: string): Promise<number> {
    return getDb().foto.where('arniaId').equals(arniaId).delete()
  },

  deleteByVisitaId(visitaId: string): Promise<number> {
    return getDb().foto.where('visitaId').equals(visitaId).delete()
  },
}
