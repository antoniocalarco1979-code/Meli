import { getDatabaseMode } from '../database'
import { initializeDatabase } from '../database/initializeDatabase'
import { seedApiariIfEmpty } from '../features/apiari/data/seedApiari'
import { seedArnieIfEmpty } from '../features/arnie/data/seedArnie'
import { seedDemoDatabaseIfEmpty } from './seedDemoDatabase'

let seedPromise: Promise<void> | null = null

async function runSeed(): Promise<void> {
  await initializeDatabase()

  if (getDatabaseMode() === 'demo') {
    await seedDemoDatabaseIfEmpty()
    return
  }

  await seedApiariIfEmpty()
  await seedArnieIfEmpty()
}

/** Popola il workspace attivo (produzione o demo) se vuoto. Non propaga errori. */
export async function ensureWorkspaceSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = runSeed().catch((err) => {
      console.warn('[MELI] ensureWorkspaceSeeded:', err)
    })
  }
  await seedPromise
}
