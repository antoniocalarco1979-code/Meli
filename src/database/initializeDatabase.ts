import { db, demoDb, getDatabaseMode, getDb, type DatabaseMode } from './activeDatabase'

const DB_OPEN_TIMEOUT_MS = 12_000
const readyByMode = new Map<DatabaseMode, Promise<void>>()

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error(message)), ms)
    promise
      .then((value) => {
        window.clearTimeout(timer)
        resolve(value)
      })
      .catch((err) => {
        window.clearTimeout(timer)
        reject(err)
      })
  })
}

/** Apre IndexedDB una sola volta per modalità (produzione / demo). */
export async function initializeDatabase(mode: DatabaseMode = getDatabaseMode()): Promise<void> {
  const database = mode === 'demo' ? demoDb : db
  if (database.isOpen()) return

  const existing = readyByMode.get(mode)
  if (existing) return existing

  const promise = withTimeout(
    database.open().then(() => undefined),
    DB_OPEN_TIMEOUT_MS,
    'Timeout apertura database IndexedDB',
  ).catch((err) => {
    readyByMode.delete(mode)
    throw err
  })

  readyByMode.set(mode, promise)
  return promise
}

/** Alias per hook e servizi che devono attendere l'apertura. */
export function whenDatabaseReady(mode: DatabaseMode = getDatabaseMode()): Promise<void> {
  return initializeDatabase(mode)
}

export async function readOnboardingCounts(): Promise<{ apiari: number; arnie: number }> {
  try {
    await initializeDatabase()
    const database = getDb()
    const apiari = await database.apiari.count()
    const arnie = await database.arnie.count()
    return { apiari, arnie }
  } catch (err) {
    console.warn('[MELI] readOnboardingCounts:', err)
    return { apiari: 0, arnie: 0 }
  }
}

export function isOnboardingComplete(counts: { apiari: number; arnie: number }): boolean {
  return counts.apiari > 0 && counts.arnie > 0
}
