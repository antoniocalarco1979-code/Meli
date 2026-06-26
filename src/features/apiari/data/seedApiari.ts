import { db } from '../../../database'
import { apiariRepository } from '../../../database/repositories'

const SEED = [
  {
    nome: 'Apiario Acquacalda',
    localita: 'San Roberto (RC)',
    latitudine: 38.156,
    longitudine: 15.782,
    quota: 420,
    descrizione: 'Apiario principale in collina.',
    numeroArnie: 28,
  },
  {
    nome: 'Apiario Bosco',
    localita: 'Santo Stefano in Aspromonte (RC)',
    latitudine: 38.017,
    longitudine: 15.902,
    descrizione: '',
    numeroArnie: 16,
  },
  {
    nome: 'Apiario Valle',
    localita: 'Calanna (RC)',
    latitudine: 38.104,
    longitudine: 15.734,
    descrizione: 'Zona castagno.',
    numeroArnie: 12,
  },
]

export async function seedApiariIfEmpty(): Promise<void> {
  const count = await db.apiari.count()
  if (count > 0) return

  for (const item of SEED) {
    await apiariRepository.create(item)
  }
}
