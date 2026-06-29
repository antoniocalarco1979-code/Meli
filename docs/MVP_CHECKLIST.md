# MELI — MVP Checklist

**Documento:** review CTO — stato prodotto pre v0.1  
**Data:** 26 giugno 2026  
**Versione codice:** `package.json` → `0.0.0` (pre-release)  
**Build verificata:** `npm run build` ✅ · `npm run lint` ✅ (1 warning non bloccante)

---

## Legenda stato

| Simbolo | Significato |
|---------|-------------|
| ✅ | Completato e utilizzabile in produzione interna |
| 🟡 | Parziale — funziona ma incompleto o con dati mock |
| ❌ | Mancante o non implementato |
| 🐛 | Bug o comportamento errato noto |

---

## 1. Funzionalità già completate

### 1.1 Fondamenta applicative

| Area | Dettaglio | Riferimenti |
|------|-----------|-------------|
| Stack | React 19, TypeScript 6, Vite 8, Dexie 4, React Router 7 | `package.json` |
| Entry point | `main.tsx` → `app/App.tsx` → `app/router/AppRouter.tsx` | `src/app/` |
| Layout responsive | Sidebar desktop, bottom nav mobile (≤1024px), safe-area | `components/layout/` |
| Lazy loading | Route secondarie con `Suspense` + `LoadingScreen` | `AppRouter.tsx` |
| Error handling | Error Boundary root, pagina 404, `PageQueryState`, toast | `components/ui/`, `components/common/` |
| Tema centralizzato | Token CSS, spacing, icone barrel, glass UI | `theme/tokens.css`, `theme/icons.ts` |

### 1.2 Database offline (IndexedDB v5)

| Area | Dettaglio | Riferimenti |
|------|-----------|-------------|
| Schema v5 | 7 store: apiari, arnie, regine, visite, foto, produzione, trattamenti | `database/schema.ts` |
| Migrazioni | v1 → v5 con normalizzazione campi legacy | `database/database.ts` |
| Layer dati | Repositories + services + tipi TypeScript | `database/repositories/`, `database/services/` |
| Seed demo | 3 apiari, 29 arnie, dati ricchi su arnia 12 | `seedApiari.ts`, `seedArnie.ts` |
| Live query | Aggiornamento reattivo UI su cambi DB | `hooks/useLiveQuery.ts` |
| Errori Dexie | `parseDexieError`, handler `blocked`/`versionchange` | `database/errors.ts`, `setupDexieHandlers.ts` |

### 1.3 Modulo Apiari ✅

| Funzione | Stato |
|----------|-------|
| Lista apiari con card | ✅ |
| Creazione / modifica (modal + form GPS/foto) | ✅ |
| Eliminazione con conferma dialog | ✅ |
| Dettaglio apiario + gestione admin | ✅ |
| **Giro visite sequenziale** | ✅ |
| Resume giro dopo salvataggio visita | ✅ |
| Schermata giro completato + export `.txt` | ✅ |
| Empty state lista vuota | ✅ |

**File chiave:** `ApiariPage`, `ApiarioDetailPage`, `ApiarioVisiteFlow`, `useApiarioGiroFlow`, `giroReportService`

### 1.4 Modulo Arnie ✅ (lettura + visita)

| Funzione | Stato |
|----------|-------|
| Griglia arnie arricchite (salute, ultima visita) | ✅ |
| Scheda premium 8 sezioni (foto, stato, regina, ultima visita, produzione, galleria, timeline) | ✅ |
| Nuova visita (CTA + wizard fullscreen) | ✅ |
| Indice salute 0–100 ricalcolato a ogni visita | ✅ |
| Timeline visite per arnia | ✅ |
| Navigazione da dashboard / mappa / giro | ✅ |

**File chiave:** `ArniePage`, `ArniaDetailPage`, `ArniaDetail`, `arniaDetailService`, `saluteScore.ts`

### 1.5 Motore visite ✅

| Funzione | Stato |
|----------|-------|
| Wizard 8 step (foto → regina → covata → forza → scorte → trattamenti → note → salva) | ✅ |
| Navigazione swipe + validazione step | ✅ |
| Salvataggio atomico (visita + trattamento + foto + forzaFamiglia) | ✅ |
| Integrazione GPS nelle note | ✅ |
| Toast conferma salvataggio | ✅ |
| Flusso giro (state `giroReturn` / `giroResume`) | ✅ |

**File chiave:** `VisitWizard`, `useVisitWizard`, `visitSaveService`, `visitWizardMapper`

### 1.6 Dashboard / Oggi 🟡→✅ (core operativo)

| Funzione | Stato |
|----------|-------|
| KPI live: conteggio apiari/arnie, ultima visita, indice salute | ✅ |
| Morning briefing operativo (arnie da controllare, trattamenti, regine) | ✅ |
| CTA "Inizia giornata" → apiario primario | ✅ |
| Pagina Oggi (briefing mobile) | ✅ |
| Pagina Altro (hub moduli secondari) | ✅ |

---

## 2. Funzionalità parziali

| Modulo / area | Cosa funziona | Cosa manca |
|---------------|---------------|------------|
| **Dashboard** | KPI live da IndexedDB | Meteo, mappa, attività giorno, quick actions (camera/voce/QR), KPI produzione kg — tutti mock in `mockDashboard.ts` |
| **Arnie** | Lista + scheda + visita | CRUD arnia (create/edit/delete), empty state lista, pulsante Modifica è placeholder |
| **Visite** (`/visite`) | Wizard completo usato da apiario/arnia | Pagina lista visite assente; route reindirizza a `/arnie` |
| **Trattamenti** | Creati al salvataggio visita; conteggio dashboard | Pagina `/trattamenti` stub; `TrattamentiCard` esiste ma non è montata in scheda arnia |
| **Produzione** | Dati seed + `ProductionCard` in scheda arnia | Pagina `/produzione` stub; nessuna UI registrazione kg |
| **Regine** | Entità DB + seed + card regina in scheda | Pagina `/regine` stub; visita "da sostituire" non aggiorna entità regina |
| **Report** | Export testo giro apiario | Pagina `/report` stub; nessun report stagionale/CSV/PDF |
| **Oggi** | Briefing live | Attività del giorno mock |
| **Altro** | Griglia moduli | Pulsante Impostazioni non collegato |
| **Device services** | Interfacce web (camera data URL, geolocation browser) | Capacitor non installato; tutti i servizi sono stub con TODO |
| **PWA** | Meta tag iOS in `index.html` | `vite-plugin-pwa` in deps ma non configurato; nessun manifest/SW |

---

## 3. Funzionalità mancanti

### 3.1 Core operativo (bloccanti per v0.1)

| # | Funzione | Impatto |
|---|----------|---------|
| 1 | **Modifica arnia** (nome, numero, stato, apiario) | Apicoltore non può correggere dati colonia |
| 2 | **Creazione arnia** da UI | Nuove colonie solo via seed/codice |
| 3 | **Eliminazione arnia** con conferma | Service esiste, UI assente |
| 4 | **Sincronizzazione visita → regina** (`da_sostituire` → `arnia.stato` / record regina) | Dati incoerenti tra visita e scheda |
| 5 | **PWA installabile** offline | Requisito iPad in campo senza rete stabile |

### 3.2 Moduli prodotto (post v0.1, pre v0.5)

| Modulo | Funzionalità attese |
|--------|---------------------|
| Regine | Lista, storico, sostituzione, alert |
| Trattamenti | Lista filtrabile, scadenze, promemoria |
| Produzione | Registrazione raccolta, totali stagione |
| Report | KPI, export CSV/PDF |
| Magazzino | Inventario attrezzatura — **nessun modello dati** |
| Visite | Storico globale cross-arnia |
| Impostazioni | Backup JSON, export/import, preferenze |

### 3.3 Infrastruttura e qualità

| # | Funzione |
|---|----------|
| 1 | Test automatizzati (unit + e2e) — **zero coverage** |
| 2 | CI/CD pipeline |
| 3 | Capacitor iOS/Android |
| 4 | Backup/restore dati utente |
| 5 | Autenticazione / multi-dispositivo sync |

---

## 4. Bug individuati

| ID | Severità | Descrizione | Dove |
|----|----------|-------------|------|
| B01 | **Alta** | Visita con regina `da_sostituire` non aggiorna `arnia.stato` né crea/aggiorna record `Regina` | `visitSaveService.ts` |
| B02 | **Media** | Giro apiario include arnie `inattiva`/`morta` — nessun filtro in `ApiarioVisiteFlow` | `useApiarioGiroFlow.ts` |
| B03 | **Media** | `numeroArnie` su card apiario può divergere dal conteggio reale post-seed | `syncApiarioArnieCount` non chiamato al bootstrap seed |
| B04 | **Bassa** | Doppio toast visita: wizard mostra conferma, poi `ArniaDetailPage` mostra secondo toast (flusso standalone) | `VisitWizard` + `ArniaDetailPage` |
| B05 | **Bassa** | KPI dashboard produzione (id `3`) sempre `428 kg` mock indipendentemente dal DB | `mockDashboard.ts` |
| B06 | **Bassa** | `TrattamentiCard` implementata ma non renderizzata — trattamenti invisibili in scheda arnia | `ArniaDetail.tsx` |
| B07 | **Info** | Warning lint `react-hooks/exhaustive-deps` in `useLiveQuery.ts` | Non bloccante build |

---

## 5. Miglioramenti consigliati

### UX / prodotto

1. Empty state dedicato su `ArniePage` quando lista vuota
2. Filtrare giro apiario sulle sole arnie `attiva`/`debole`
3. Quick action "Nuova visita" già funzionante — estendere camera/QR quando Capacitor pronto
4. Unificare feedback toast visita (un solo messaggio per flusso)
5. Pagina Visite: almeno redirect intelligente o lista recente

### Tecnici (non bloccanti v0.1)

1. Allineare documentazione obsoleta (`NuovaVisitaModal`, path `src/router/`)
2. Configurare PWA o rimuovere `vite-plugin-pwa` dalle deps
3. Alias `@/` usato in vite.config ma import prevalentemente relativi
4. Bundle JS ~499 KB — valutare code-splitting dashboard mock
5. Aggiungere `npm test` minimo su `visitSaveService` e `saluteScore`

### Documentazione

1. Aggiornare `CHANGELOG.md`, `docs/modules/visite.md`, `README.md` root
2. Allineare `package.json` version a tag git al release v0.1

---

## 6. Priorità assolute per v0.1 Alpha

> **Obiettivo v0.1:** *"Validare flusso visita + giro offline su iPad"* — `docs/ROADMAP.md`

### Must-have (release blocker)

| Priorità | Task | Motivazione |
|----------|------|-------------|
| P0 | **Modifica arnia** (form minimo: nome, numero, stato) | Exit criteria Fase 1 roadmap |
| P0 | **Visita → sync regina/stato arnia** | Coerenza dati operativi |
| P0 | **PWA base** (manifest + service worker cache asset) | Offline installabile su iPad |
| P0 | **Wire `TrattamentiCard`** in scheda arnia | Dati già in DB, UI già scritta |
| P1 | **Empty state `ArniePage`** | UX lista vuota |
| P1 | **Filtro giro** (escludi inattive/morte) | Evita visite inutili sul campo |
| P1 | **Sync `numeroArnie`** post-seed | Card apiario accurate |
| P1 | **Pass documentazione** allineata a codice | Onboarding team / review |

### Should-have (v0.1.1)

| Priorità | Task |
|----------|------|
| P2 | Creazione arnia da UI |
| P2 | Eliminazione arnia con conferma |
| P2 | Toast visita unificato |
| P2 | KPI produzione live in dashboard |

### Out of scope v0.1

- Moduli Regine / Trattamenti / Produzione / Report / Magazzino completi
- Capacitor nativo
- Backup JSON
- Test e2e
- Sync cloud

### Definition of Done v0.1

```
[ ] Apicoltore completa giro 28 arnie offline su iPad (PWA installata)
[ ] Ogni visita aggiorna salute, timeline, trattamenti visibili in scheda
[ ] Modifica nome/stato arnia funzionante
[ ] Visita "regina da sostituire" riflessa in scheda arnia
[ ] npm run build + lint puliti
[ ] package.json → 0.1.0, CHANGELOG aggiornato
[ ] Demo RANU/Aspromonte testata su iPad Safari
```

---

## Riepilogo maturità moduli

| Modulo | Completamento stimato |
|--------|----------------------|
| Apiari | **90%** |
| Arnie | **70%** |
| Visite (engine) | **85%** |
| Visite (pagina) | **5%** |
| Dashboard | **55%** |
| Oggi / Altro | **60%** |
| Regine | **15%** (solo DB) |
| Trattamenti | **25%** |
| Produzione | **20%** |
| Report | **10%** |
| Magazzino | **0%** |
| PWA / Device | **10%** |
| **MVP complessivo** | **~45%** verso v0.5 Beta · **~75%** verso v0.1 Alpha |

---

*Prossimi passi operativi: vedere [TECH_DEBT.md](./TECH_DEBT.md) e [NEXT_SPRINT.md](./NEXT_SPRINT.md).*
