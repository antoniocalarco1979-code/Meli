# MELI — Database

**Motore:** Dexie.js 4 su IndexedDB  
**Nome database:** `MeliDatabase`  
**Versione schema:** **5**  
**Definizione:** `src/database/schema.ts`  
**Istanza:** `src/database/database.ts`  
**Ultimo aggiornamento:** giugno 2026

---

## 1. Filosofia dati

MELI adotta un modello **offline-first locale**:

- Ogni entità di dominio ha una tabella IndexedDB dedicata.
- Le query reattive usano Dexie `liveQuery` (dashboard, liste arnie, giro apiario).
- Non esiste backend o sync cloud nella versione attuale.
- I campi denormalizzati (`numeroArnie`, `forzaFamiglia`) sono accettati per performance UI su iPad.

**Regola per sviluppatori:** le pages non accedono a `db.*` direttamente. Usare `src/database/services/` o `src/features/*/services/`.

---

## 2. Diagramma relazioni

```
┌──────────┐  1:N   ┌──────────┐  1:N   ┌──────────┐  1:N   ┌──────────┐
│  Apiario │───────▶│   Arnia  │───────▶│  Visita  │───────▶│   Foto   │
└────┬─────┘        └────┬─────┘        └──────────┘        └──────────┘
     │                   │
     │ fotoCopertina     ├── 1:N ──▶ Produzione
     │ (inline)          ├── 1:N ──▶ Trattamento
                         └── FK ──▶ Regina (reginaAttualeId)
                              │
                              └── N Regine storiche per arnia
```

**Cascade delete:**
- `deleteApiario(id)` — elimina apiario + tutte le arnie correlate + dati figli.
- `deleteArniaWithRelations(id)` — elimina arnia + visite, foto, produzione, trattamenti, regine.

Implementazione: `src/database/services/apiariService.ts`, `arnieService.ts`.

---

## 3. Store e indici Dexie

Definiti in `STORE_SCHEMA`:

| Store | Indici indicizzati |
|-------|-------------------|
| `apiari` | `id, nome, localita, createdAt, updatedAt` |
| `arnie` | `id, apiarioId, numero, stato, reginaAttualeId, [apiarioId+numero], createdAt, updatedAt` |
| `regine` | `id, arniaId, anno, [arniaId+anno]` |
| `visite` | `id, arniaId, data, [arniaId+data]` |
| `foto` | `id, visitaId, arniaId, apiarioId, data` |
| `produzione` | `id, arniaId, data, tipo, [arniaId+data]` |
| `trattamenti` | `id, arniaId, data, scadenza, [arniaId+data]` |

### Indici composti — perché esistono

| Indice | Query tipica |
|--------|--------------|
| `[apiarioId+numero]` | Lista arnie ordinate in giro apiario |
| `[arniaId+data]` | Ultima visita, timeline, salute |
| `[arniaId+anno]` | Storico regine per arnia |

---

## 4. Entità e campi

Tipi TypeScript: `src/database/types/entities.ts`  
DTO input create/update: `src/database/types/inputs.ts`

### 4.1 Apiario

Sito apistico fisico.

| Campo | Tipo | Obbligatorio | Note |
|-------|------|:------------:|------|
| `id` | string | ✅ | UUID generato (`generateId()`) |
| `nome` | string | ✅ | Es. "Apiario Acquacalda" |
| `descrizione` | string | | Note descrittive (ex `note` in v4) |
| `localita` | string | ✅ | Es. "San Roberto (RC)" |
| `latitudine` | number | | WGS84 |
| `longitudine` | number | | WGS84 |
| `quota` | number | | Metri s.l.m. |
| `fotoCopertina` | string | | Data URL o path (ex `foto[]` in v3) |
| `numeroArnie` | number | ✅ | Contatore denormalizzato |
| `createdAt` | number | ✅ | Unix ms |
| `updatedAt` | number | ✅ | Unix ms |

### 4.2 Arnia

Singola colonia.

| Campo | Tipo | Obbligatorio | Note |
|-------|------|:------------:|------|
| `id` | string | ✅ | |
| `apiarioId` | string | ✅ | FK → `apiari.id` |
| `numero` | string | ✅ | Identificativo campo (ex `codice`) |
| `nome` | string | | Alias opzionale |
| `qrCode` | string | | Per scanner futuro |
| `stato` | `ArniaStato` | ✅ | Vedi enum sotto |
| `forzaFamiglia` | number | | Indice salute 0–100 |
| `reginaAttualeId` | string | | FK → `regine.id` (ex `reginaAttivaId`) |
| `fotoCopertina` | string | | Ultima foto visita o manuale |
| `note` | string | | |
| `createdAt` | number | ✅ | |
| `updatedAt` | number | ✅ | |

**Enum `ArniaStato`:**

```typescript
'attiva' | 'debole' | 'senza_regina' | 'morta' | 'inattiva'
```

Usato per fallback salute e colorazione mappa dashboard (mock).

### 4.3 Regina

Anagrafica regina. Storico multiplo per arnia; una sola attiva via `Arnia.reginaAttualeId`.

| Campo | Tipo | Note |
|-------|------|------|
| `id` | string | |
| `arniaId` | string | FK |
| `anno` | number | Anno nascita / marcatura |
| `colore` | string | Es. "bianca", "gialla" |
| `razza` | string | Es. "Ligustica" |
| `origine` | string | |
| `marcata` | boolean | |
| `note` | string | |

**Rimossi in v5:** `identificativo`, `dataInsediamento`, `attiva`, `dataFine`, timestamps.

### 4.4 Visita

Ispezione sul campo. Record centrale del flusso operativo.

| Campo | Tipo | Note |
|-------|------|------|
| `id` | string | |
| `arniaId` | string | FK |
| `data` | number | Unix ms, indicizzato |
| `meteo` | string | |
| `temperatura` | number | °C |
| `covata` | string | Testo libero; parsato per salute |
| `scorte` | string | Testo libero; parsato per salute |
| `forza` | number | Scala 1–10 |
| `reginaVista` | boolean | `false` = allarme regina |
| `comportamento` | string | Aggressività, malattie |
| `note` | string | Include GPS se catturato |

**Rimossi in v5:** `tipo`, `esito`, timestamps.

### 4.5 Foto

Allegato multimediale. FK multipli opzionali per flessibilità futura.

| Campo | Tipo | Note |
|-------|------|------|
| `id` | string | |
| `visitaId` | string | FK opzionale |
| `arniaId` | string | FK opzionale |
| `apiarioId` | string | FK opzionale |
| `path` | string | Data URL o path file (ex `dataUrl`) |
| `thumbnail` | string | Preview ridotta |
| `data` | number | Timestamp scatto |

**Web oggi:** foto salvate come data URL in IndexedDB. **Capacitor futuro:** `path` punterà al filesystem nativo.

### 4.6 Produzione

Raccolta miele per arnia.

| Campo | Tipo | Note |
|-------|------|------|
| `id` | string | |
| `arniaId` | string | FK |
| `data` | number | Data raccolta (ex `dataRaccolta`) |
| `kg` | number | Quantità (ex `quantita`) |
| `tipo` | string | Es. "miele", "polline" |

### 4.7 Trattamento

Intervento sanitario.

| Campo | Tipo | Note |
|-------|------|------|
| `id` | string | |
| `arniaId` | string | FK |
| `data` | number | Data esecuzione (ex `dataProgrammata`) |
| `prodotto` | string | Es. "Acido ossalico" (ex `tipo`) |
| `dose` | string | Es. "30 ml" |
| `scadenza` | number | Promemoria futuro |

**Finestra salute:** trattamento negli ultimi **90 giorni** conta per parametro "Trattamenti eseguiti" (+10).

---

## 5. Migrazioni schema

Incrementare `DATABASE_VERSION` e aggiungere blocco `.upgrade()` in `database.ts` ad ogni breaking change.

| Versione | Modifiche principali |
|----------|---------------------|
| **v1** | Store vuoti iniziali |
| **v2** | Introduce tabella `apiari` |
| **v3** | Migra `apiari.foto[]` → `fotoCopertina` singolo |
| **v4** | Tutte e 7 le tabelle dominio + store `impostazioni` |
| **v5** | **Schema definitivo Sprint 4** — rimuove `impostazioni`, rinomina campi su tutte le entità |

### v5 — mappa rename (legacy → attuale)

| Entità | Prima | Dopo |
|--------|-------|------|
| Apiario | `note` | `descrizione` |
| Apiario | `foto` | `fotoCopertina` |
| Arnia | `codice` | `numero` |
| Arnia | `reginaAttivaId` | `reginaAttualeId` |
| Arnia | — | rimossi `posizioneX`, `posizioneY` |
| Regina | — | rimossi campi ciclo vitale e timestamps |
| Visita | — | rimossi `tipo`, `esito`, timestamps |
| Foto | `dataUrl` | `path` + aggiunto `data` |
| Produzione | `quantita` | `kg` |
| Produzione | `dataRaccolta` | `data` |
| Trattamento | `tipo` | `prodotto` |
| Trattamento | `dataProgrammata` | `data` / `scadenza` |

**Procedura per v6+:**
1. Aggiornare `entities.ts` e `inputs.ts`.
2. Incrementare `DATABASE_VERSION`.
3. Scrivere migrazione `.upgrade()` con transform row-by-row.
4. Aggiornare repository e services.
5. Aggiornare questo documento e [RELEASES.md](./RELEASES.md).

---

## 6. Layer di accesso

```
UI / Feature service
        ↓
database/services/     ← normalizzazione, cascade, business rules DB
        ↓
database/repositories/ ← CRUD diretto su tabella Dexie
        ↓
db (Dexie instance)
```

### Repository (`src/database/repositories/`)

Un repository per store: `apiariRepository`, `arnieRepository`, `regineRepository`, `visiteRepository`, `fotoRepository`, `produzioneRepository`, `trattamentiRepository`.

Utility condivise: `generateId()`, `now()` in `repositories/utils.ts`.

### Services (`src/database/services/`)

| Service | Responsabilità |
|---------|----------------|
| `apiariService` | CRUD apiari, cascade delete, sync contatore arnie |
| `arnieService` | CRUD arnie, delete con relazioni |
| `regineService` | CRUD regine |
| `visiteService` | CRUD visite |
| `fotoService` | CRUD foto |
| `produzioneService` | CRUD produzione |
| `trattamentiService` | CRUD trattamenti |

### Feature services (orchestrazione)

| Service | File | Ruolo |
|---------|------|-------|
| `arniaDetailService` | `features/arnie/services/` | Vista arricchita scheda, metriche dashboard |
| `visitaSaveService` | `features/arnie/services/` | Salvataggio visita atomico + ricalcolo salute |
| `giroReportService` | `features/apiari/services/` | Stats sessione giro + export |

---

## 7. Query pattern ricorrenti

### Ultima visita per arnia

```typescript
visiteRepository.getByArniaId(arniaId)
// ordinamento [arniaId+data] → primo elemento = più recente
```

### Metriche dashboard

`getDashboardLiveMetrics()` in `arniaDetailService.ts`:
- conta apiari/arnie,
- media `forzaFamiglia` delle arnie attive,
- data ultima visita globale.

### Giro apiario

`ApiarioVisiteFlow` usa `liveQuery` su arnie filtrate per `apiarioId`, ordinate per `numero` (sort numerico custom in `arniaDetailService`).

### Ricalcolo salute

Ad ogni `saveNuovaVisita()`:
1. `buildSaluteFlagsFromChecklist()` o `buildSaluteFlagsFromVisita()`,
2. `computeSaluteScore()` → clamp 0–100,
3. `updateArnia({ forzaFamiglia })`.

---

## 8. Seed e dati demo

| Trigger | Condizione | File |
|---------|------------|------|
| `seedApiariIfEmpty()` | `db.apiari.count() === 0` | `features/apiari/data/seedApiari.ts` |
| `seedArnieIfEmpty()` | `db.arnie.count() === 0` | `features/arnie/data/seedArnie.ts` |

Chiamati da `useDashboardLiveStats`, `useArnie`, al primo accesso app.

**Dataset demo principale — Apiario Acquacalda:**
- 28 arnie (numeri 1–28),
- visite demo su arnie 1–4,
- arnia 12 con dataset completo (regina, visita, trattamento, 6 produzioni, 2 foto).

**Sync contatore:** `syncApiarioArnieCount(apiarioId)` aggiorna `numeroArnie` dopo create/delete arnia.

---

## 9. Limiti attuali e debito tecnico

| Area | Stato | Impatto |
|------|-------|---------|
| Foto in IndexedDB | Data URL inline | Crescita storage browser; migrare a Capacitor Filesystem |
| Nessun backup | Export solo report giro `.txt` | Rischio perdita dati su clear browser |
| `impostazioni` rimosso | Preferenze non persistite | Serve reintrodurre store o `localStorage` strutturato |
| Multi-utente | Assente | Un solo profilo implicito |
| Validazione input | Minima | Affidamento a UI form |

**Prossimi passi dati (Fase 4 roadmap):** export/import JSON, backup cloud opzionale, reintroduzione `impostazioni` o equivalente Zustand persist.

---

## 10. Viste UI (alias retrocompatibili)

Per non rompere componenti legacy durante migrazione v5:

```typescript
type ApiarioView = Apiario & { foto?: string; note?: string }
type ArniaView = Arnia & { codice?: string; coverFoto?: string }
```

Mapping gestito nei service layer, non duplicare record in DB.

---

*Per regole prodotto sulle entità: [MELI_PRODUCT_SPEC.md](./MELI_PRODUCT_SPEC.md). Per flussi che scrivono dati: [USER_FLOW.md](./USER_FLOW.md).*
