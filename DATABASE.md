# MELI — Database

Persistenza locale con **Dexie.js** (IndexedDB).  
Implementazione attuale: `src/database/index.ts` (schema vuoto v1).

---

## Principi

- **Offline-first** — funziona senza connessione in apiario
- **iPad** — volumi moderati, query veloci
- **Migrabile** — versioni Dexie incrementali (`version(n).stores()`)
- **Tipizzato** — modelli TypeScript allineati alle tabelle

---

## Schema pianificato (v2)

### `apiari`

| Campo | Tipo | Note |
|-------|------|------|
| `id` | string (UUID) | PK |
| `nome` | string | es. "Apiario Acquacalda" |
| `localita` | string | |
| `lat` | number? | |
| `lng` | number? | |
| `note` | string? | |
| `createdAt` | number | timestamp |
| `updatedAt` | number | |

**Indici:** `id`, `nome`

---

### `arnie`

| Campo | Tipo | Note |
|-------|------|------|
| `id` | string | PK |
| `apiarioId` | string | FK → apiari |
| `numero` | string | es. "12", "7B" |
| `stato` | enum | `healthy` \| `warning` \| `critical` \| `inactive` |
| `reginaId` | string? | FK → regine |
| `qrCode` | string? | |
| `posizioneX` | number? | % mappa |
| `posizioneY` | number? | |
| `updatedAt` | number | |

**Indici:** `id`, `apiarioId`, `[apiarioId+numero]`

---

### `visite`

| Campo | Tipo | Note |
|-------|------|------|
| `id` | string | PK |
| `apiarioId` | string | |
| `arniaId` | string? | |
| `data` | number | timestamp visita |
| `tipo` | string | ispezione, controllo, smielatura… |
| `note` | string? | |
| `fotoIds` | string[] | riferimenti blob/storage |
| `createdAt` | number | |

**Indici:** `id`, `apiarioId`, `data`

---

### `regine`

| Campo | Tipo | Note |
|-------|------|------|
| `id` | string | PK |
| `arniaId` | string? | |
| `anno` | number | anno regina |
| `origine` | string? | |
| `daSostituire` | boolean | |
| `note` | string? | |

**Indici:** `id`, `arniaId`, `daSostituire`

---

### `trattamenti`

| Campo | Tipo | Note |
|-------|------|------|
| `id` | string | PK |
| `apiarioId` | string | |
| `tipo` | string | varroa, nosema… |
| `prodotto` | string | |
| `data` | number | |
| `scadenza` | number? | |
| `note` | string? | |

**Indici:** `id`, `apiarioId`, `scadenza`

---

### `produzione`

| Campo | Tipo | Note |
|-------|------|------|
| `id` | string | PK |
| `apiarioId` | string | |
| `data` | number | |
| `kg` | number | |
| `tipoMiele` | string? | millefiori, castagno… |
| `note` | string? | |

**Indici:** `id`, `apiarioId`, `data`

---

### `magazzino`

| Campo | Tipo | Note |
|-------|------|------|
| `id` | string | PK |
| `nome` | string | |
| `categoria` | string | telai, melari, attrezzi… |
| `quantita` | number | |
| `unita` | string | |
| `updatedAt` | number | |

**Indici:** `id`, `categoria`

---

## Esempio migrazione Dexie

```typescript
// src/database/index.ts (futuro v2)
this.version(2).stores({
  apiari: 'id, nome',
  arnie: 'id, apiarioId, [apiarioId+numero]',
  visite: 'id, apiarioId, data',
  regine: 'id, arniaId, daSostituire',
  trattamenti: 'id, apiarioId, scadenza',
  produzione: 'id, apiarioId, data',
  magazzino: 'id, categoria',
})
```

---

## Accesso dati

```
UI (features)
    ↓
services/     ← query, validazione, regole business
    ↓
database/     ← Dexie, transazioni
    ↓
IndexedDB
```

I servizi per dominio andranno in `src/services/` (es. `apiariService.ts`).

---

## Backup

Futuro: export JSON da IndexedDB + import restore (Fase 4 roadmap).

---

*Ultimo aggiornamento: giugno 2025*
