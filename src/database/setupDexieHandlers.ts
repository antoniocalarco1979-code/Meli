import type Dexie from 'dexie'

export function setupDexieErrorHandlers(database: Dexie): void {
  database.on('blocked', () => {
    console.warn('[MELI] Database bloccato: chiudi le altre schede dell\'app.')
  })

  database.on('versionchange', () => {
    database.close()
  })
}
