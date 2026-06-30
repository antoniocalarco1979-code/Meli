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
  createdAt?: number
  updatedAt?: number
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

    this.version(DATABASE_VERSION).stores(STORE_SCHEMA)
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
    delete row.createdAt
    delete row.updatedAt
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
    delete row.createdAt
    delete row.updatedAt
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
  const { buildArniaQrAssets, buildArniaQrPayload } = await import(
    '../features/arnie/services/arniaQrService'
  )

  const rows = await tx.table('arnie').toArray()
  for (const row of rows as Array<Arnia & { qrCode?: string }>) {
    const publicUuid = row.publicUuid || row.id
    const qrCode = buildArniaQrPayload(publicUuid)
    const { qrImageDataUrl } = await buildArniaQrAssets(publicUuid)
    await tx.table('arnie').update(row.id, { publicUuid, qrCode, qrImageDataUrl })
  }
}

export const db = new MeliDatabase(DATABASE_NAME)
export const demoDb = new MeliDatabase('MeliDemoDatabase')

setupDexieErrorHandlers(db)
setupDexieErrorHandlers(demoDb)
