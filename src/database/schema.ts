/**
 * MELI — Schema Dexie (IndexedDB) — Sprint 4 definitivo
 *
 * Diagramma relazioni:
 *
 *   ┌──────────┐  1:N   ┌──────────┐  1:N   ┌──────────┐  1:N   ┌──────────┐
 *   │  Apiario │───────▶│   Arnia  │───────▶│  Visita  │───────▶│   Foto   │
 *   └────┬─────┘        └────┬─────┘        └──────────┘        └──────────┘
 *        │                   │
 *        │ 1:N (copertina)   ├── 1:N ──▶ Produzione
 *        ▼                   ├── 1:N ──▶ Trattamento
 *   fotoCopertina            └── 1:1 ──▶ Regina (reginaAttualeId)
 *   (campo inline)               N Regine storiche per arnia
 *
 * Indici composti ottimizzati per query iPad in apiario (offline-first).
 */

export const DATABASE_NAME = 'MeliDatabase'

/** Versione schema — incrementare ad ogni migrazione breaking. */
export const DATABASE_VERSION = 16

/** Definizione store Dexie: tabella → indici indicizzati. */
export const STORE_SCHEMA = {
  apiari: 'id, nome, localita, createdAt, updatedAt',
  arnie: 'id, publicUuid, apiarioId, numero, qrCode, stato, modelloId, reginaAttualeId, [apiarioId+numero], createdAt, updatedAt',
  regine: 'id, arniaId, numero, anno, stato, [arniaId+anno], [arniaId+numero], createdAt, updatedAt',
  visite: 'id, arniaId, data, [arniaId+data]',
  foto: 'id, visitaId, arniaId, apiarioId, reginaId, data',
  produzione: 'id, arniaId, apiarioId, data, tipo, [arniaId+data], [apiarioId+data], createdAt, updatedAt',
  trattamenti: 'id, arniaId, visitaId, data, tipo, scadenza, [arniaId+data], createdAt, updatedAt',
  giri: 'id, apiarioId, stato, startedAt, completedAt, [apiarioId+startedAt], [apiarioId+stato]',
} as const

export type StoreName = keyof typeof STORE_SCHEMA

/** Nomi tabella — allineati alle entità di dominio. */
export const TABLES = {
  APIARI: 'apiari',
  ARNIE: 'arnie',
  REGINE: 'regine',
  VISITE: 'visite',
  FOTO: 'foto',
  PRODUZIONE: 'produzione',
  TRATTAMENTI: 'trattamenti',
  GIRI: 'giri',
} as const
