import Dexie, { type EntityTable, type Transaction } from 'dexie'
import { DEFAULT_ARNIA_MODELLO_ID, resolveArniaModello } from '../features/arnie/models/arniaModelli'
import { DATABASE_NAME, DATABASE_VERSION, STORE_SCHEMA } from './schema'
import { setupDexieErrorHandlers } from './setupDexieHandlers'
import type { Apiario, Arnia, Foto, Produzione, Regina, Trattamento, Visita, GiroApiario } from './types'

/** Record legacy pre-migrazione v5 (campi deprecati). */
type LegacyApiario = Apiario & { note?: string; foto?: string }
type LegacyArnia = Arnia & { codice?: string; reginaAttivaId?: string; posizioneX?: number; posizioneY?: number }
type LegacyRegina = Regina & {
  identificativo?: string
  dataInsediamento?: number
  attiva?: boolean
  dataFine?: number
}
type LegacyVisita = Visita & { tipo?: string; esito?: string; createdAt?: number; updatedAt?: number }
type LegacyFoto = Foto & { dataUrl?: string; didascalia?: string; createdAt?: number }
type LegacyProduzione = Produzione & {
  quantita?: number
  unita?: string
  dataRaccolta?: number
  note?: string
  createdAt?: number
  updatedAt?: number
}
type LegacyTrattamento = Trattamento & {
  visitaId?: string
  tipo?: string
  dataProgrammata?: number
  dataEsecuzione?: number
  stato?: string
  note?: string
  createdAt?: number
  updatedAt?: number
}

/**
 * Database MELI — singleton Dexie su IndexedDB.
 * Gestisce migrazioni incrementali da v1 a v6.
 */
class MeliDatabase extends Dexie {
  apiari!: EntityTable<Apiario, 'id'>
  arnie!: EntityTable<Arnia, 'id'>
  regine!: EntityTable<Regina, 'id'>
  visite!: EntityTable<Visita, 'id'>
  foto!: EntityTable<Foto, 'id'>
  produzione!: EntityTable<Produzione, 'id'>
  trattamenti!: EntityTable<Trattamento, 'id'>
  giri!: EntityTable<GiroApiario, 'id'>

  constructor(dbName: string = DATABASE_NAME) {
    super(dbName)

    this.version(1).stores({})

    this.version(2).stores({
      apiari: STORE_SCHEMA.apiari,
    })

    this.version(3)
      .stores({ apiari: STORE_SCHEMA.apiari })
      .upgrade((tx) =>
        tx.table('apiari').toCollection().modify((row: LegacyApiario & { foto?: string | string[] }) => {
          if (Array.isArray(row.foto)) {
            row.fotoCopertina = row.foto[0]
            delete row.foto
          }
        }),
      )

    this.version(4).stores({
      apiari: STORE_SCHEMA.apiari,
      arnie: STORE_SCHEMA.arnie,
      regine: STORE_SCHEMA.regine,
      visite: STORE_SCHEMA.visite,
      foto: STORE_SCHEMA.foto,
      produzione: STORE_SCHEMA.produzione,
      trattamenti: STORE_SCHEMA.trattamenti,
      impostazioni: 'id, updatedAt',
    })

    this.version(5)
      .stores(STORE_SCHEMA)
      .upgrade(async (tx) => {
        await migrateApiariV5(tx)
        await migrateArnieV5(tx)
        await migrateRegineV5(tx)
        await migrateVisiteV5(tx)
        await migrateFotoV5(tx)
        await migrateProduzioneV5(tx)
        await migrateTrattamentiV5(tx)
      })

    this.version(6)
      .stores(STORE_SCHEMA)
      .upgrade(async (tx) => {
        await migrateArnieV6(tx)
      })

    this.version(7).stores(STORE_SCHEMA)

    this.version(8).stores(STORE_SCHEMA)

    this.version(9).stores(STORE_SCHEMA)

    this.version(10)
      .stores(STORE_SCHEMA)
      .upgrade(async (tx) => {
        await migrateArnieV10(tx)
      })

    this.version(11).stores(STORE_SCHEMA)

    this.version(12)
      .stores(STORE_SCHEMA)
      .upgrade(async (tx) => {
        await migrateArnieV12(tx)
      })

    this.version(13)
      .stores(STORE_SCHEMA)
      .upgrade(async (tx) => {
        await migrateArnieV13(tx)
      })

    this.version(14)
      .stores(STORE_SCHEMA)
      .upgrade(async (tx) => {
        await migrateRegineV14(tx)
      })

    this.version(15)
      .stores(STORE_SCHEMA)
      .upgrade(async (tx) => {
        await migrateTrattamentiV15(tx)
      })

    this.version(DATABASE_VERSION)
      .stores(STORE_SCHEMA)
      .upgrade(async (tx) => {
        await migrateProduzioneV16(tx)
      })
  }
}

async function migrateApiariV5(tx: Transaction): Promise<void> {
  await tx.table('apiari').toCollection().modify((row: LegacyApiario) => {
    if (row.note && !row.descrizione) {
      row.descrizione = row.note
      delete row.note
    }
    if (row.foto && !row.fotoCopertina) {
      row.fotoCopertina = row.foto
      delete row.foto
    }
  })
}

async function migrateArnieV5(tx: Transaction): Promise<void> {
  await tx.table('arnie').toCollection().modify((row: LegacyArnia) => {
    if (row.codice && !row.numero) {
      row.numero = row.codice
      delete row.codice
    }
    if (row.reginaAttivaId && !row.reginaAttualeId) {
      row.reginaAttualeId = row.reginaAttivaId
      delete row.reginaAttivaId
    }
    delete row.posizioneX
    delete row.posizioneY
  })
}

async function migrateRegineV5(tx: Transaction): Promise<void> {
  await tx.table('regine').toCollection().modify((row: LegacyRegina) => {
    if (!row.anno && row.identificativo) {
      const parsed = parseInt(row.identificativo, 10)
      if (!Number.isNaN(parsed)) row.anno = parsed
    }
    delete row.identificativo
    delete row.dataInsediamento
    delete row.attiva
    delete row.dataFine
  })
}

async function migrateVisiteV5(tx: Transaction): Promise<void> {
  await tx.table('visite').toCollection().modify((row: LegacyVisita) => {
    delete row.tipo
    delete row.esito
    delete row.createdAt
    delete row.updatedAt
  })
}

async function migrateFotoV5(tx: Transaction): Promise<void> {
  await tx.table('foto').toCollection().modify((row: LegacyFoto) => {
    if (row.dataUrl && !row.path) {
      row.path = row.dataUrl
      delete row.dataUrl
    }
    if (!row.data) {
      row.data = row.createdAt ?? Date.now()
    }
    delete row.didascalia
    delete row.createdAt
  })
}

async function migrateProduzioneV5(tx: Transaction): Promise<void> {
  await tx.table('produzione').toCollection().modify((row: LegacyProduzione) => {
    if (row.quantita !== undefined && row.kg === undefined) {
      row.kg = row.quantita
    }
    if (row.dataRaccolta && !row.data) {
      row.data = row.dataRaccolta
    }
    delete row.quantita
    delete row.unita
    delete row.dataRaccolta
    delete row.note
    delete row.createdAt
    delete row.updatedAt
  })
}

async function migrateTrattamentiV5(tx: Transaction): Promise<void> {
  await tx.table('trattamenti').toCollection().modify((row: LegacyTrattamento) => {
    if (row.dataProgrammata && !row.data) {
      row.data = row.dataProgrammata
    }
    if (row.dataProgrammata && !row.scadenza) {
      row.scadenza = row.dataProgrammata
    }
    if (row.tipo && !row.prodotto) {
      row.prodotto = row.tipo
    }
    delete row.visitaId
    delete row.tipo
    delete row.dataProgrammata
    delete row.dataEsecuzione
    delete row.stato
    delete row.note
  })
}

async function migrateArnieV6(tx: Transaction): Promise<void> {
  await tx.table('arnie').toCollection().modify((row: LegacyArnia & Partial<Arnia>) => {
    if (row.modelloId) return

    const resolved = resolveArniaModello(DEFAULT_ARNIA_MODELLO_ID)
    row.modelloId = resolved.modelloId
    row.numeroTelai = resolved.numeroTelai
    row.hasMelario = resolved.hasMelario
    row.hasVassoioAntivarroa = resolved.hasVassoioAntivarroa
  })
}

async function migrateArnieV10(tx: Transaction): Promise<void> {
  const { buildArniaQrPayload } = await import('../features/arnie/services/arniaQrService')
  const { generateId } = await import('./repositories/utils')

  await tx.table('arnie').toCollection().modify((row: Arnia & { qrCode?: string }) => {
    if (row.publicUuid && row.qrCode) return

    row.publicUuid = row.publicUuid || generateId()
    row.qrCode = row.qrCode || buildArniaQrPayload(row.publicUuid)
  })
}

async function migrateArnieV12(tx: Transaction): Promise<void> {
  const { buildArniaQrPayload, generateQrImageDataUrl, parseArniaQrPayload } = await import(
    '../features/arnie/services/arniaQrService'
  )
  const { generateId } = await import('./repositories/utils')

  const rows = await tx.table('arnie').toArray()
  for (const row of rows) {
    let publicUuid = row.publicUuid?.trim()
    if (!publicUuid) {
      publicUuid = generateId()
    }

    const parsedFromQr = row.qrCode ? parseArniaQrPayload(row.qrCode) : null
    if (parsedFromQr && parsedFromQr !== publicUuid) {
      publicUuid = parsedFromQr
    }

    const qrCode = buildArniaQrPayload(publicUuid)
    const qrImageDataUrl = await generateQrImageDataUrl(qrCode)

    await tx.table('arnie').update(row.id, {
      publicUuid,
      qrCode,
      qrImageDataUrl,
    })
  }
}

async function migrateProduzioneV16(tx: Transaction): Promise<void> {
  const timestamp = Date.now()

  await tx.table('produzione').toCollection().modify((row: LegacyProduzione) => {
    if (!row.createdAt) row.createdAt = row.data ?? timestamp
    if (!row.updatedAt) row.updatedAt = row.createdAt

    if (!row.tipo?.trim()) {
      row.tipo = row.apiarioId ? 'smielatura' : 'miele'
    }
  })

  const smielature = (await tx.table('produzione').toArray()) as Produzione[]
  const apiarioIds = [
    ...new Set(smielature.filter((row) => row.apiarioId).map((row) => row.apiarioId!)),
  ]

  const now = new Date()
  const yearStart = new Date(now.getFullYear(), 0, 1).getTime()
  const yearEnd = new Date(now.getFullYear() + 1, 0, 1).getTime()

  for (const apiarioId of apiarioIds) {
    const rows = smielature.filter(
      (row) => row.apiarioId === apiarioId && row.tipo === 'smielatura',
    )
    const kgTotale = rows.reduce((sum, row) => sum + (row.kg ?? 0), 0)
    const kgAnno = rows
      .filter((row) => row.data >= yearStart && row.data < yearEnd)
      .reduce((sum, row) => sum + (row.kg ?? 0), 0)

    await tx.table('apiari').update(apiarioId, {
      kgProduzioneTotale: kgTotale,
      kgProduzioneAnno: kgAnno,
      updatedAt: timestamp,
    })
  }
}

async function migrateTrattamentiV15(tx: Transaction): Promise<void> {
  const { buildTrattamentoCalendarioPromemoria } = await import(
    '../features/trattamenti/services/trattamentoReminderService'
  )
  const { generateId } = await import('./repositories/utils')
  const timestamp = Date.now()

  await tx.table('trattamenti').toCollection().modify((row: Trattamento & { prodotto?: string }) => {
    if (!row.createdAt) row.createdAt = row.data ?? timestamp
    if (!row.updatedAt) row.updatedAt = row.createdAt

    if (row.prodotto?.trim() && !row.principioAttivo?.trim()) {
      row.principioAttivo = row.prodotto.trim()
    }

    if (!row.tipo?.trim() && row.principioAttivo) {
      const lower = row.principioAttivo.toLowerCase()
      if (lower.includes('varroa') || lower.includes('apivar') || lower.includes('oxalico')) {
        row.tipo = 'varroa'
      } else if (lower.includes('nutriz') || lower.includes('scirop')) {
        row.tipo = 'nutrizione'
      } else {
        row.tipo = 'altro'
      }
    }

    if (row.scadenza && !row.promemoriaCalendario) {
      row.promemoriaCalendario = buildTrattamentoCalendarioPromemoria(
        { ...row, id: row.id, createdAt: row.createdAt, updatedAt: row.updatedAt },
        generateId,
      )
    }
  })
}

async function migrateRegineV14(tx: Transaction): Promise<void> {
  const timestamp = Date.now()

  await tx.table('regine').toCollection().modify((row: LegacyRegina & Partial<Regina>) => {
    if (!row.createdAt) row.createdAt = timestamp
    if (!row.updatedAt) row.updatedAt = timestamp

    if (!row.numero?.trim()) {
      if (row.identificativo?.trim()) {
        row.numero = row.identificativo.trim()
      } else if (row.anno) {
        row.numero = String(row.anno)
      } else {
        row.numero = row.id.slice(0, 8).toUpperCase()
      }
    }

    if (row.origine?.trim() && !row.provenienza?.trim()) {
      row.provenienza = row.origine.trim()
    }

    if (row.dataInsediamento && !row.dataInserimento) {
      row.dataInserimento = row.dataInsediamento
    }

    if (row.dataFine && !row.dataSostituzione) {
      row.dataSostituzione = row.dataFine
    }

    if (!row.stato) {
      if (row.dataSostituzione || row.dataFine) {
        row.stato = 'persa'
      } else if (row.attiva === false) {
        row.stato = 'da_sostituire'
      } else {
        row.stato = 'fecondata'
      }
    }

    if (row.colore?.trim()) {
      row.colore = row.colore.trim().toLowerCase()
    }

    delete row.identificativo
    delete row.dataInsediamento
    delete row.attiva
    delete row.dataFine
  })
}

async function migrateArnieV13(tx: Transaction): Promise<void> {
  const { buildArniaQrPayload, generateQrImageDataUrl, parseArniaQrPayload } = await import(
    '../features/arnie/services/arniaQrService'
  )
  const { generateId } = await import('./repositories/utils')

  const rows = await tx.table('arnie').toArray()
  for (const row of rows) {
    let publicUuid = row.publicUuid?.trim()
    if (!publicUuid) {
      publicUuid = generateId()
    }

    const parsedFromQr = row.qrCode ? parseArniaQrPayload(row.qrCode) : null
    if (parsedFromQr && parsedFromQr !== publicUuid) {
      publicUuid = parsedFromQr
    }

    const qrCode = buildArniaQrPayload(publicUuid)
    const needsImage =
      row.qrCode !== qrCode || !row.qrImageDataUrl || row.publicUuid !== publicUuid

    if (!needsImage) continue

    const qrImageDataUrl = await generateQrImageDataUrl(qrCode)

    await tx.table('arnie').update(row.id, {
      publicUuid,
      qrCode,
      qrImageDataUrl,
    })
  }
}

export const db = new MeliDatabase(DATABASE_NAME)
export const demoDb = new MeliDatabase('MeliDemoDatabase')

setupDexieErrorHandlers(db)
setupDexieErrorHandlers(demoDb)
