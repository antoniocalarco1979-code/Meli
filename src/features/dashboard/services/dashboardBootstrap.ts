import { ensureWorkspaceSeeded } from '../../../demo/ensureWorkspaceSeeded'
import { getDb } from '../../../database'

export async function seedDashboardData(): Promise<void> {
  await ensureWorkspaceSeeded()
}

export async function resolvePrimaryApiario() {
  const apiari = await getDb().apiari.orderBy('nome').toArray()
  return apiari.find((a) => a.nome.includes('Acquacalda')) ?? apiari[0]
}
