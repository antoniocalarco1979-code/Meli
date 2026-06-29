import { demoDb, db as productionDb } from './database'

export type DatabaseMode = 'production' | 'demo'

let databaseMode: DatabaseMode = 'production'

/** Database produzione — sempre separato dalla sandbox demo. */
export const db = productionDb

export { demoDb }

export function getDatabaseMode(): DatabaseMode {
  return databaseMode
}

export function setDatabaseMode(mode: DatabaseMode): void {
  databaseMode = mode
}

export function getDb() {
  return databaseMode === 'demo' ? demoDb : productionDb
}
