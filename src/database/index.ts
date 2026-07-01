export { db, demoDb, getDb, getDatabaseMode, setDatabaseMode } from './activeDatabase'
export { initializeDatabase, isOnboardingComplete, readOnboardingCounts, whenDatabaseReady } from './initializeDatabase'
export { parseDexieError, normalizeError } from './errors'
export { DATABASE_NAME, DATABASE_VERSION, STORE_SCHEMA, TABLES } from './schema'
export type { StoreName } from './schema'

export * from './types'
export * from './repositories'
export * from './services'
