import { getDb } from '../../../database/activeDatabase'
import { apiariRepository } from '../../../database/repositories'
import { createArnia } from '../../../database/services/arnieService'
import { createProduzione } from '../../../database/services/produzioneService'
import { createRegina } from '../../../database/services/regineService'
import { createTrattamento } from '../../../database/services/trattamentiService'
import { createVisita } from '../../../database/services/visiteService'
import { fotoRepository } from '../../../database/repositories/fotoRepository'
import { seedApiariIfEmpty } from '../../apiari/data/seedApiari'
import { shouldSeedDemoData } from '../../../config/demoSeed'

const DEMO_FOTO =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIge2CyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjN2E5ZTdlIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjNWE3YTVlIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNnKSIvPHRleHQgeD0iNTAlIiB5PSI1MCUiBmb250LXNpemU9IjI0IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+QW52b2xsbyAxMjwvdGV4dD48L3N2Zz4='

export async function seedArnieIfEmpty(options?: { force?: boolean }): Promise<void> {
  if (!options?.force && !shouldSeedDemoData()) return
  await seedApiariIfEmpty()

  const count = await getDb().arnie.count()
  if (count > 0) return

  const apiari = await apiariRepository.getAll()
  const acquacalda = apiari.find((a) => a.nome.includes('Acquacalda'))
  const bosco = apiari.find((a) => a.nome.includes('Bosco'))

  if (!acquacalda) return

  const now = Date.now()
  const day = 86_400_000

  const arnia12 = await createArnia({
    apiarioId: acquacalda.id,
    numero: '12',
    modelloId: 'dadant_blatt_10',
    nome: 'Arnia principale',
    qrCode: 'MELI-ACQ-12',
    stato: 'attiva',
    forzaFamiglia: 94,
    note: 'Colonia forte, buona covata. Ultimo controllo positivo.',
    fotoCopertina: DEMO_FOTO,
  })

  await createRegina({
    arniaId: arnia12.id,
    anno: 2025,
    razza: 'Ligustica',
    colore: 'Bianca',
    origine: 'locale',
    marcata: true,
  })

  await createVisita({
    arniaId: arnia12.id,
    data: now - 5 * day,
    meteo: 'Soleggiato',
    temperatura: 24,
    covata: 'Covata compatta',
    scorte: 'Scorte abbondanti',
    forza: 8,
    reginaVista: true,
    comportamento: 'Docile',
    note: 'Colonia popolosa, scorte adeguata. Nessun segno di malattia.',
  })

  await createTrattamento({
    arniaId: arnia12.id,
    data: now - 2 * day,
    prodotto: 'Oxalico',
    dose: '30 ml',
    scadenza: now + 14 * day,
  })

  const produzioneKg = [6, 7, 6, 7, 6, 6]
  produzioneKg.forEach((kg, i) => {
    void createProduzione({
      arniaId: arnia12.id,
      kg,
      tipo: 'miele',
      data: now - (5 - i) * 30 * day,
    })
  })

  await fotoRepository.create({
    arniaId: arnia12.id,
    path: DEMO_FOTO,
    data: now - 10 * day,
  })

  await fotoRepository.create({
    arniaId: arnia12.id,
    path: DEMO_FOTO,
    data: now - 5 * day,
  })

  if (bosco) {
    await createArnia({
      apiarioId: bosco.id,
      numero: '7',
      modelloId: 'langstroth',
      stato: 'debole',
      forzaFamiglia: 68,
      note: 'Colonia da rinforzare.',
    })
  }

  const arniaIds: Record<string, string> = { '12': arnia12.id }

  for (let i = 1; i <= 28; i++) {
    if (String(i) === '12') continue
    const arnia = await createArnia({
      apiarioId: acquacalda.id,
      numero: String(i),
      modelloId: i % 5 === 0 ? 'dadant_blatt_12' : 'dadant_blatt_10',
      qrCode: `MELI-ACQ-${String(i).padStart(2, '0')}`,
      stato: i % 3 === 0 ? 'debole' : 'attiva',
      forzaFamiglia: i % 3 === 0 ? 70 : 88,
    })
    arniaIds[String(i)] = arnia.id
  }

  const demoVisite: { num: string; daysAgo: number; note: string; reginaVista?: boolean }[] = [
    { num: '1', daysAgo: 5, note: 'Controllo routine, tutto regolare.' },
    { num: '2', daysAgo: 7, note: 'Scorte leggermente basse, da monitorare.', reginaVista: false },
    { num: '3', daysAgo: 3, note: 'Regina vista, covata compatta.' },
    { num: '4', daysAgo: 10, note: 'Famiglia forte, nessun trattamento in corso.' },
  ]

  for (const demo of demoVisite) {
    const arniaId = arniaIds[demo.num]
    if (!arniaId) continue
    const reginaVista = demo.reginaVista ?? true
    await createVisita({
      arniaId,
      data: now - demo.daysAgo * day,
      meteo: 'Soleggiato',
      temperatura: 22,
      covata: reginaVista ? 'Covata compatta' : 'Non controllata',
      scorte: reginaVista ? 'Scorte abbondanti' : 'Non controllate',
      forza: reginaVista ? 8 : 5,
      reginaVista,
      comportamento: reginaVista ? 'Docile' : undefined,
      note: demo.note,
    })
  }

  const arnia2Id = arniaIds['2']
  if (arnia2Id) {
    await createTrattamento({
      arniaId: arnia2Id,
      data: now - 3 * day,
      prodotto: 'Varroa',
      dose: '2 strisce',
      scadenza: now + 10 * day,
    })
  }
}
