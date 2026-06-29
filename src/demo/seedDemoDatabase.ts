import { demoDb, getDatabaseMode, setDatabaseMode } from '../database'
import { seedApiariIfEmpty } from '../features/apiari/data/seedApiari'
import { seedArnieIfEmpty } from '../features/arnie/data/seedArnie'

/** Popola IndexedDB demo (`MeliDemoDatabase`) — separato dai dati reali. */
export async function seedDemoDatabaseIfEmpty(): Promise<void> {
  if ((await demoDb.apiari.count()) > 0) return

  const previousMode = getDatabaseMode()
  setDatabaseMode('demo')

  try {
    await seedApiariIfEmpty({ force: true })
    await seedArnieIfEmpty({ force: true })
  } finally {
    setDatabaseMode(previousMode)
  }
}

export async function resetDemoDatabase(): Promise<void> {
  await Promise.all([
    demoDb.apiari.clear(),
    demoDb.arnie.clear(),
    demoDb.regine.clear(),
    demoDb.visite.clear(),
    demoDb.foto.clear(),
    demoDb.produzione.clear(),
    demoDb.trattamenti.clear(),
  ])
  setDatabaseMode('demo')
  await seedDemoDatabaseIfEmpty()
}
