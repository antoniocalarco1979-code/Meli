import { getDatabaseMode } from '../database'
import { initializeDatabase } from '../database/initializeDatabase'
import { seedApiariIfEmpty } from '../features/apiari/data/seedApiari'
import { seedArnieIfEmpty } from '../features/arnie/data/seedArnie'
import { seedDemoDatabaseIfEmpty } from './seedDemoDatabase'

let seedPromise: Promise<void> | null = null

/** Popola il workspace attivo (produzione o demo) se vuoto. */
export async function ensureWorkspaceSeeded(): Promise<void> {
  if (seedPromise) return seedPromise

  seedPromise = (async () => {
    await initializeDatabase()
    if (getDatabaseMode() === 'demo') {
      await seedDemoDatabaseIfEmpty()
      return
    }

    await seedApiariIfEmpty()
    await seedArnieIfEmpty()
  })().finally(() => {
    seedPromise = null
  })

  return seedPromise
}
