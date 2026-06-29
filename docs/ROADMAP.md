# MELI — Roadmap

**Owner:** product / engineering  
**Orizzonte:** 12 mesi  
**Stato attuale:** fine Fase 1 (Core Apiario) — pre-release  
**Ultimo aggiornamento:** giugno 2026

---

## 1. Visione rilasci

| Milestone | Nome | Obiettivo business |
|-----------|------|-------------------|
| **v0.1 Alpha** | Core Apiario | Validare flusso visita + giro offline su iPad |
| **v0.5 Beta** | Operatività completa | Coprire stagione apistica intera (produzione, sanitaria, report) |
| **v1.0** | Produzione | App Store / Play Store, backup, notifiche, QR |

`package.json` riporta ancora `0.0.0` — allineare a CHANGELOG alla prossima tag release.

---

## 2. Fasi di sviluppo

### Fase 0 — Fondamenta ✅ Completata

**Periodo:** giugno 2025  
**Release:** 0.1.0 → 0.4.0

| Deliverable | Stato |
|-------------|-------|
| Progetto Vite + React 19 + TypeScript | ✅ |
| Design system (token, glass, UI kit) | ✅ |
| MainLayout + Sidebar + Header | ✅ |
| Router 9 moduli + lazy loading | ✅ |
| Layer database Dexie + repositories | ✅ |
| Dashboard premium (Sprint 2–3) | ✅ |
| Documentazione `docs/` + ARCHITETTURA | ✅ |

---

### Fase 1 — Core Apiario 🔄 Quasi completa

**Periodo:** giugno 2025 – giugno 2026  
**Release:** [Unreleased] → target **v0.5.0-alpha**

| Deliverable | Stato | File chiave |
|-------------|-------|-------------|
| Schema Dexie v5 definitivo | ✅ | `database/schema.ts` |
| Seed Apiario Acquacalda (28 arnie) | ✅ | `seedApiari.ts`, `seedArnie.ts` |
| Modulo Arnie — lista + scheda premium | ✅ | `ArniePage`, `ArniaDetail` |
| Indice salute 0–100 | ✅ | `saluteScore.ts`, `HealthCard` |
| NuovaVisitaModal fullscreen guidata | ✅ | `NuovaVisitaModal`, `visitaSaveService` |
| ApiarioVisiteFlow sequenziale | ✅ | `ApiarioVisiteFlow`, `ApiarioGiroCompletato` |
| Export report giro `.txt` | ✅ | `giroReportService.ts` |
| Device services Capacitor-ready | ✅ | `services/device/` |
| Dashboard KPI live (parziale) | ✅ | `useDashboardLiveStats` |
| CRUD Apiari | ✅ | `ApiarioModal`, `apiariService` |
| Modifica arnia / sostituzione regina UI | 🔲 | `onEdit` placeholder in `ArniaDetailPage` |
| Pagina Visite autonoma | 🔲 | `VisitePage` placeholder |
| PWA offline | 🔲 | `vite-plugin-pwa` non configurato |

**Exit criteria Fase 1:**
- [x] Giro 28 arnie completabile offline end-to-end
- [x] Salute ricalcolata ad ogni visita
- [ ] Modifica arnia e regina da UI
- [ ] PWA installabile con cache asset

---

### Fase 2 — Produzione e Sanitaria 📋 Pianificata

**Target:** v0.5 Beta  
**Dipende da:** Fase 1 chiusa

| Deliverable | Priorità | Descrizione |
|-------------|----------|-------------|
| Modulo **Regine** | Alta | Lista, alert sostituzione, storico per arnia |
| Modulo **Trattamenti** | Alta | Scadenze, promemoria, lista filtrabile |
| Modulo **Produzione** | Alta | Registrazione kg, totali stagione, grafico |
| Modulo **Report** | Media | KPI annuali, export CSV/PDF |
| Header notifiche | Media | Trattamenti in scadenza, regine da controllare |
| Impostazioni | Media | Preferenze, apiario default, unità |

**Note tecniche:**
- Dati già in DB (`regine`, `trattamenti`, `produzione`) — serve solo UI + service orchestration.
- Trattamenti già creati da `NuovaVisitaModal` — modulo lista è read + edit + scadenze.
- Integrare KPI dashboard mock (produzione kg, trattamenti scadenza) con query reali.

---

### Fase 3 — Magazzino e Operatività 📋 Pianificata

**Target:** v0.6 – v0.7

| Deliverable | Descrizione |
|-------------|-------------|
| Modulo **Magazzino** | Telai, melari, attrezzatura — nuova entità DB v6 |
| QR scanner arnia | `arnia.qrCode` + camera nativa |
| Note vocali | Attach audio a visita |
| Promemoria locali | `notificationService` + scadenze trattamento |
| Store Zustand | Apiario selezionato, preferenze sessione |

**Schema impact:** introdurrà tabella `magazzino` o simile → migrazione v6.

---

### Fase 4 — PWA e Sync 📋 Pianificata

**Target:** v0.8 – v1.0-rc

| Deliverable | Descrizione |
|-------------|-------------|
| PWA completa | Service worker, manifest, install prompt |
| Export/import JSON | Backup manuale IndexedDB |
| Sync cloud opzionale | Multi-device, conflict resolution |
| Multi-utente | Auth + tenant (cooperative) |
| Capacitor iOS/Android | Camera/GPS nativi, App Store submission |

**Decisioni aperte:**
- Backend sync: Firebase vs Supabase vs custom ASPROMONTE stack.
- Strategia conflict: last-write-wins vs merge per entità.

---

### Fase 5 — Premium e territorio 📋 Visione

**Target:** v1.0+

| Deliverable | Descrizione |
|-------------|-------------|
| Meteo Aspromonte API | Sostituire mock dashboard |
| Branding RANU premium | Temi, white-label cooperative |
| IoT sensori | Umidità alveare, peso bilancia |
| i18n | IT + EN |
| Analytics prodotto | Funnel visita, retention |

---

## 3. Priorità immediate (prossimo sprint)

Allineate a [../TODO.md](../TODO.md):

| # | Task | Impatto | Effort |
|---|------|---------|--------|
| 1 | Configurare PWA (`vite-plugin-pwa`) | Offline reale, install iPad | M |
| 2 | UI modifica arnia + sostituzione regina | Chiude gap Fase 1 | M |
| 3 | Modulo Trattamenti — lista + scadenze | Sostituisce KPI mock | L |
| 4 | Modulo Produzione — registrazione kg | Stagione miele | M |
| 5 | Pagina Impostazioni + apiario default | UX multi-apiario | S |
| 6 | Integrazione Capacitor | Camera/GPS nativi | L |

**Non iniziare** Fase 5 finché Fase 2 non è beta-testata con apicoltori reali.

---

## 4. Matrice modulo × fase

| Modulo | F0 | F1 | F2 | F3 | F4 | F5 |
|--------|:--:|:--:|:--:|:--:|:--:|:--:|
| Dashboard | ✅ | 🔄 | 🔄 | · | · | 🔄 |
| Apiari | · | ✅ | · | · | · | · |
| Arnie | · | ✅ | 🔄 | 🔄 | · | · |
| Visite | · | 🔄 | ✅ | · | · | · |
| Regine | · | · | ✅ | · | · | · |
| Trattamenti | · | 🔄* | ✅ | 🔄 | · | · |
| Produzione | · | 🔄* | ✅ | · | · | · |
| Magazzino | · | · | · | ✅ | · | · |
| Report | · | 🔄* | ✅ | · | · | 🔄 |
| Sync cloud | · | · | · | · | ✅ | ✅ |

\* = dati in DB o export parziale, UI assente

---

## 5. Rischi e mitigazioni

| Rischio | Probabilità | Mitigazione |
|---------|-------------|-------------|
| IndexedDB quota (foto data URL) | Alta | Capacitor Filesystem + compressione |
| Perdita dati clear browser | Media | Export JSON Fase 4, messaging utente |
| Scope creep moduli | Media | Fase gate — no Magazzino prima di F2 |
| ARCHITETTURA.md stale | Bassa | Aggiornare ad ogni fase chiusa |
| Test manuali insufficienti | Media | E2E Playwright su giro + visita (TODO bassa) |

---

## 6. Definition of Done — release

Prima di taggare una versione:

1. `npm run build` senza errori TypeScript.
2. Flusso giro + visita testato su iPad Safari.
3. CHANGELOG + RELEASES.md aggiornati.
4. Migrazioni DB testate (fresh install + upgrade da v precedente).
5. Documentazione `docs/` allineata allo stato reale moduli.

---

## 7. Documenti correlati

| Documento | Contenuto |
|-----------|-----------|
| [MELI_PRODUCT_SPEC.md](./MELI_PRODUCT_SPEC.md) | Scope prodotto |
| [RELEASES.md](./RELEASES.md) | Storico versioni |
| [FUTURE_IDEAS.md](./FUTURE_IDEAS.md) | Idee fuori roadmap attiva |
| [../TODO.md](../TODO.md) | Backlog operativo sprint |
| [../CHANGELOG.md](../CHANGELOG.md) | Changelog tecnico |

---

*Roadmap rivista a ogni sprint planning. Modifiche di scope richiedono aggiornamento di PRODUCT_SPEC e questo documento.*
