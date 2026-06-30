import { getDb } from '../../../database/activeDatabase'
import { apiariRepository } from '../../../database/repositories'
import { shouldSeedDemoData } from '../../../config/demoSeed'

const SEED = [
  {
    nome: 'Apiario Acquacalda',
    localita: 'San Roberto (RC)',
    comune: 'San Roberto',
    provincia: 'RC',
    regione: 'Calabria',
    latitudine: 38.156,
    longitudine: 15.782,
    quota: 420,
    esposizione: 'sud',
    accessibilita: 'media',
    presenzaAcqua: true,
    fiorituraPrevalente: 'Castagno',
    descrizione: 'Apiario principale in collina.',
    numeroArnie: 28,
  },
  {
    nome: 'Apiario Bosco',
    localita: 'Santo Stefano in Aspromonte (RC)',
    comune: 'Santo Stefano in Aspromonte',
    provincia: 'RC',
    regione: 'Calabria',
    latitudine: 38.017,
    longitudine: 15.902,
    esposizione: 'mista',
    accessibilita: 'difficile',
    presenzaAcqua: false,
    fiorituraPrevalente: 'Bosco misto',
    descrizione: '',
    numeroArnie: 16,
  },
  {
    nome: 'Apiario Valle',
    localita: 'Calanna (RC)',
    comune: 'Calanna',
    provincia: 'RC',
    regione: 'Calabria',
    latitudine: 38.104,
    longitudine: 15.734,
    quota: 310,
    esposizione: 'est',
    accessibilita: 'facile',
    presenzaAcqua: true,
    fiorituraPrevalente: 'Millefiori',
    descrizione: 'Zona castagno.',
    numeroArnie: 12,
  },
]

export async function seedApiariIfEmpty(options?: { force?: boolean }): Promise<void> {
  if (!options?.force && !shouldSeedDemoData()) return
  const count = await getDb().apiari.count()
  if (count > 0) return

  for (const item of SEED) {
    await apiariRepository.create(item)
  }
}
