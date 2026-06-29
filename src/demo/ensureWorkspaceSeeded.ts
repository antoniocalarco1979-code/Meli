import { getDatabaseMode } from '../database'
import { seedApiariIfEmpty } from '../features/apiari/data/seedApiari'
import { seedArnieIfEmpty } from '../features/arnie/data/seedArnie'
import { seedDemoDatabaseIfEmpty } from './seedDemoDatabase'

/** Popola il workspace attivo (produzione o demo) se vuoto. */
export async function ensureWorkspaceSeeded(): Promise<void> {
  if (getDatabaseMode() === 'demo') {
    await seedDemoDatabaseIfEmpty()
    return
  }

  await seedApiariIfEmpty()
  await seedArnieIfEmpty()
}
