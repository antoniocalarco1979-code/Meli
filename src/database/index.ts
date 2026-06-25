import Dexie from 'dexie'

/**
 * Database locale IndexedDB via Dexie.
 * Schema da definire negli sprint successivi.
 */
class MeliDatabase extends Dexie {
  constructor() {
    super('MeliDatabase')
    this.version(1).stores({})
  }
}

export const db = new MeliDatabase()
