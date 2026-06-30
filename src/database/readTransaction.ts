import { getDb } from './activeDatabase'

const READ_STORES = [
  'apiari',
  'arnie',
  'regine',
  'visite',
  'foto',
  'produzione',
  'trattamenti',
  'giri',
] as const

/**
 * Esegue letture Dexie in un'unica transazione read-only.
 * Obbligatorio per query multi-tabella dentro liveQuery (evita TransactionInactiveError).
 */
export async function withReadTransaction<T>(
  fn: (db: ReturnType<typeof getDb>) => Promise<T>,
): Promise<T> {
  const db = getDb()
  return db.transaction('r', READ_STORES, () => fn(db))
}
