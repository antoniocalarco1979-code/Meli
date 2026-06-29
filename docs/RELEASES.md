# MELI — Releases

**Formato:** [Keep a Changelog](https://keepachangelog.com/it/1.1.0/)  
**Changelog tecnico completo:** [../CHANGELOG.md](../CHANGELOG.md)  
**Ultimo aggiornamento:** giugno 2026

---

## Stato corrente

| Campo | Valore |
|-------|--------|
| **Branch** | `main` |
| **Versione package.json** | `0.0.0` (da allineare) |
| **Ultima release taggata** | 0.4.0 (2025-06-25) |
| **Lavoro in corso** | Sprint Core Apiario — [Unreleased] |
| **Prossima milestone** | v0.5.0-alpha (chiusura Fase 1) |

---

## [Unreleased] — Sprint Core Apiario

**Focus:** trasformare MELI da dashboard demo a strumento operativo offline per visite in apiario.

### Aggiunto

| Area | Dettaglio |
|------|-----------|
| **Database v5** | Schema definitivo: 7 store (`apiari`, `arnie`, `regine`, `visite`, `foto`, `produzione`, `trattamenti`). Migrazioni v1→v5. Rimosso store `impostazioni`. |
| **Modulo Arnie** | Griglia `ArniaCard`, scheda premium 8 sezioni (`HealthCard`, `QueenCard`, `ProductionCard`, `UltimaVisitaCard`, `TimelineCard`, `PhotoGallery`, `TrattamentiCard`). |
| **Indice salute** | Modello 0–100 con 7 parametri pesati (`saluteScore.ts`). Aggiornamento `forzaFamiglia` ad ogni visita. |
| **NuovaVisitaModal** | Modal fullscreen, checklist 6 step, GPS, camera, trattamento opzionale. |
| **ApiarioVisiteFlow** | Giro sequenziale: hero → card espansa → auto-advance → completamento. |
| **Export giro** | Report `.txt` con stats sessione (`giroReportService.ts`). |
| **Device services** | `cameraService`, `gpsService`, `notificationService`, `storageService` — astrazione Capacitor-ready. |
| **Dashboard live** | KPI parziali da IndexedDB: conteggi, ultima visita, indice salute medio. |
| **Seed demo** | 3 apiari calabresi, 28 arnie Acquacalda, dataset ricco arnia 12. |
| **CRUD Apiari** | `ApiarioModal` + form create/edit/delete con cascade. |

### Modificato

- Architettura dati: rename campi v5 (`codice`→`numero`, `quantita`→`kg`, ecc.).
- Dashboard: mix KPI live + mock (meteo, mappa, attività).
- Documentazione spostata in `docs/` (8 documenti prodotto).

### Pianificato (non incluso in questo unreleased)

- PWA (`vite-plugin-pwa` configurazione)
- UI modifica arnia / sostituzione regina
- Moduli Regine, Trattamenti, Produzione (oltre placeholder)
- Capacitor iOS/Android

### Breaking changes

- **Schema v5:** upgrade automatico da v4 via Dexie migration. Campi legacy rinominati — verificare eventuali script esterni.

### Note deploy

```bash
npm install
npm run build    # tsc + vite build
npm run preview  # anteprima produzione
```

Nessun backend richiesto — deploy statico (Netlify, Vercel, S3, etc.).

---

## [0.4.0] — 2025-06-25

**Nome:** Architettura scalabile

### Aggiunto

- Struttura `features/`, `router/`, `theme/`, `components/ui/`.
- `MainLayout` con Header e Sidebar responsive.
- 9 route (Dashboard + 8 moduli placeholder).
- UI kit: Button, Card, Section, Input, Textarea, Badge, Modal, FAB, PageTitle, EmptyState, Loading.
- Layer `services/`, `database/`, `hooks/`, `types/`.
- Cartelle `docs/`, `assets/`, documentazione root.
- Alias Vite `@` e `@assets`.

### Modificato

- Dashboard spostata in `features/dashboard/pages/`.
- Tema centralizzato in `src/theme/`.

### Rimosso

- Template Vite iniziale.
- `src/assets/` → `assets/brand/`.

---

## [0.3.0] — 2025-06-25

**Nome:** Dashboard Sprint 3 — Premium UI

### Aggiunto

- Glassmorphism avanzato, timeline attività, KPI con sparkline.
- Pulsante **INIZIA GIORNATA** centrale.
- Meteo card con cielo animato.
- Watermark RANU elegante.

### Modificato

- Ombre, hover Framer Motion, tipografia iPadOS.
- Sidebar e icone ingrandite.

---

## [0.2.0] — 2025-06-25

**Nome:** Dashboard Sprint 2 — Operatività mock

### Aggiunto

- Selettore apiario, 5 KPI, mappa arnie colorata.
- Attività di oggi e azioni rapide.
- Dati mock Apiario Acquacalda.

---

## [0.1.0] — 2025-06-25

**Nome:** First light

### Aggiunto

- Prima dashboard MELI (palette miele, crema, oro).
- Sidebar, card Apiari / Arnie / Visite / Produzione.
- Progetto Vite + React + TypeScript.

---

## Timeline visuale

```
2025-06-25  v0.1 ──▶ v0.2 ──▶ v0.3 ──▶ v0.4
                                      │
2025-06 → 2026                        ▼
                              [Unreleased]
                              Core Apiario
                                      │
                              (target v0.5α)
```

---

## Criteri versionamento

| Tipo bump | Quando |
|-----------|--------|
| **MAJOR** | Breaking API dati, migrazione non automatica, redesign incompatible |
| **MINOR** | Nuovo modulo funzionante, feature significativa |
| **PATCH** | Bugfix, polish UI, doc-only |

**Prossimi tag previsti:**

| Tag | Contenuto |
|-----|-----------|
| `v0.5.0-alpha` | Chiusura Fase 1 + PWA base |
| `v0.5.0-beta` | Fase 2 moduli sanitaria/produzione |
| `v1.0.0` | Store + sync + backup |

---

## Checklist release

Prima di ogni tag Git:

- [ ] `npm run build` verde
- [ ] Test manuale giro + visita su iPad
- [ ] CHANGELOG.md aggiornato
- [ ] Questo file aggiornato
- [ ] `package.json` version allineata
- [ ] Migrazione DB testata fresh + upgrade
- [ ] `docs/ROADMAP.md` fase aggiornata

---

## Git history (repository)

| Commit | Descrizione |
|--------|-------------|
| Inizializzazione progetto React MELI | Bootstrap |
| Sprint 1 - Fondamenta progetto | Layout, router, design system |
| Descrizione dello sprint | Core apiario: DB v5, arnie, visita, giro |

---

*Per piano futuro: [ROADMAP.md](./ROADMAP.md). Per idee non schedulate: [FUTURE_IDEAS.md](./FUTURE_IDEAS.md).*
