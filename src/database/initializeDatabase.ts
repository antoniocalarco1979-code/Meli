import { db, demoDb, getDatabaseMode, type DatabaseMode } from './activeDatabase'

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

export async function initializeDatabase(mode: DatabaseMode = getDatabaseMode()): Promise<void> {
  const existing = readyByMode.get(mode)
  if (existing) return existing

  const database = mode === 'demo' ? demoDb : db
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

export async function readOnboardingCounts(): Promise<{ apiari: number; arnie: number }> {
  await initializeDatabase()
  const [apiari, arnie] = await Promise.all([db.apiari.count(), db.arnie.count()])
  return { apiari, arnie }
}

export function isOnboardingComplete(counts: { apiari: number; arnie: number }): boolean {
  return counts.apiari > 0 && counts.arnie > 0
}
