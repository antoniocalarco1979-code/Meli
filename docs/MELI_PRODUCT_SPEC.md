# MELI — Product Specification

**Versione documento:** 1.0  
**Stato prodotto:** Sprint Core Apiario (pre-release)  
**Stack:** React 19 · TypeScript · Vite 8 · Dexie 4 · IndexedDB  
**Ultimo aggiornamento:** giugno 2026

---

## 1. Executive summary

MELI è un'applicazione professionale per apicoltori che gestiscono uno o più apiari sul territorio calabrese (Aspromonte, Reggio Calabria). Il prodotto è progettato **offline-first** e **iPad-first**: l'apicoltore lavora in campo con guanti, sotto il sole, e deve registrare visite in meno di 30 secondi senza dipendere dalla rete.

Il differenziatore rispetto a fogli Excel o app generiche è la **continuità operativa**: ogni arnia ha una scheda viva (salute 0–100, regina, trattamenti, produzione, timeline) alimentata dalle visite sul campo, con un **giro apiario sequenziale** che guida l'ispezione di tutte le arnie in ordine.

Partner territoriale di riferimento: **RANU / Aspromonte** (identità visiva e dati demo locali).

---

## 2. Problema e utente target

### Problema

Gli apicoltori professionali con 50–200 arnie distribuite su più siti perdono tempo e coerenza tra:
- appunti cartacei o WhatsApp,
- memoria personale su quali arnie sono state visitate,
- assenza di uno storico strutturato per regina, trattamenti e produzione.

### Persona primaria

**Antonio** — apicoltore professionale, 3 apiari in provincia di Reggio Calabria, ~40 arnie attive. Usa iPad in apiario, smartphone per consultazioni rapide. Vuole aprire l'app, premere **Inizia Giornata**, completare il giro e avere un report alla fine.

### Vincoli operativi

| Vincolo | Implicazione prodotto |
|---------|----------------------|
| Offline in collina | Nessuna chiamata API obbligatoria; persistenza IndexedDB |
| Guanti / sole | Touch target ≥ 50 px, contrasto alto, modal fullscreen |
| Tempo limitato per arnia | Checklist guidata a 6 step, salvataggio atomico |
| Più apiari | Navigazione per sito, contatori denormalizzati |

---

## 3. Obiettivi misurabili

| Obiettivo | Target | Stato attuale |
|-----------|--------|---------------|
| Tempo registrazione visita | < 30 s | ✅ Flusso guidato implementato |
| Completezza giro apiario | ≥ 80% arnie visitate/sessione | ✅ Giro sequenziale + stats |
| Retention operativa | ≥ 3 giorni/settimana in stagione | 🔲 Da misurare post-lancio |
| Perdita dati | 0 (backup locale) | 🔲 Export JSON in roadmap Fase 4 |

---

## 4. Piattaforme

| Canale | Stato | Note |
|--------|-------|------|
| Browser desktop/tablet | ✅ Attivo | Deploy Vite SPA |
| iPad (Safari) | ✅ Target primario | Layout 768–1024 px ottimizzato |
| PWA offline | 🔲 Pianificato | `vite-plugin-pwa` in devDependencies, non configurato |
| Capacitor (iOS/Android) | 🔲 Pianificato | Device services già astratti |

**Regola architetturale:** tutta la logica core deve funzionare in browser con IndexedDB. Capacitor è un adapter, non un requisito.

---

## 5. Moduli prodotto

### 5.1 Matrice implementazione

| Modulo | Route | Stato | Implementazione |
|--------|-------|-------|-----------------|
| **Dashboard** | `/` | ✅ Parziale | KPI live + mock meteo/mappa/attività |
| **Apiari** | `/apiari`, `/apiari/:id` | ✅ Core | CRUD, dettaglio, giro visite |
| **Arnie** | `/arnie`, `/arnie/:id` | ✅ Core | Griglia, scheda premium 8 sezioni |
| **Visite** | `/visite` | 🔲 Placeholder | UX reale in Apiari + Arnie |
| **Regine** | `/regine` | 🔲 Placeholder | Dati in DB, UI assente |
| **Trattamenti** | `/trattamenti` | 🔲 Placeholder | Creati da visita, lista assente |
| **Produzione** | `/produzione` | 🔲 Placeholder | Seed demo, UI assente |
| **Magazzino** | `/magazzino` | 🔲 Placeholder | — |
| **Report** | `/report` | 🔲 Placeholder | Export `.txt` giro implementato |
| **Impostazioni** | — | 🔲 Assente | Store `impostazioni` rimosso in v5 |

### 5.2 Dashboard

**Live da IndexedDB** (`useDashboardLiveStats` → `getDashboardLiveMetrics`):
- conteggio apiari e arnie,
- etichetta ultima visita,
- indice salute medio (media `forzaFamiglia`).

**Ancora mock** (`mockDashboard.ts`):
- meteo e attività del giorno,
- mappa arnie colorata,
- azioni rapide (camera, voce, QR, promemoria),
- KPI produzione kg e trattamenti in scadenza,
- nome utente "Antonio".

**Entry point operativi:**
- **INIZIA GIORNATA** → `/apiari/{id}` (preferisce apiario "Acquacalda"),
- azione rapida visita → `/arnie/{id}?openVisita` (default arnia 12).

### 5.3 Apiari

- Lista con card glass, contatore arnie, località.
- CRUD via `ApiarioModal` + `ApiarioForm` (`createApiario`, `updateApiario`, `deleteApiario`).
- Dettaglio con `ApiarioGiroHero` + `ApiarioVisiteFlow`:
  - hero: nome, N arnie, **[Inizia Giro]**,
  - lista ordinata per `numero` arnia,
  - una card espansa alla volta,
  - auto-avanzamento post-salvataggio (400 ms),
  - schermata **Giro completato** con export report.

### 5.4 Arnie

- Lista griglia `ArniaCard` con semaforo salute e ultima visita.
- Scheda premium (`ArniaDetail`) con 8 blocchi:
  1. `ArniaHeader` — numero, apiario, copertina, edit (placeholder),
  2. `HealthCard` — indice 0–100 con breakdown parametri,
  3. `QueenCard` — regina attuale,
  4. `ProductionCard` — kg stagione,
  5. `UltimaVisitaCard`,
  6. `TimelineCard` — ultime 12 voci (visite + trattamenti + produzione),
  7. `PhotoGallery`,
  8. `TrattamentiCard`.
- FAB **Nuova Visita** → `NuovaVisitaModal` fullscreen.

### 5.5 Visite (UX distribuita)

Non esiste ancora una pagina Visite autonoma. Il flusso visita è centralizzato in:

```
NuovaVisitaModal
  → visitaGuidataSteps (6 step)
  → visitaSaveService.saveNuovaVisita()
  → saluteScore + update Arnia.forzaFamiglia
```

Step guidati: Posizione → Regina → Covata → Scorte → Foto telaio → Conclusione.

Side effects al salvataggio:
- creazione record `Visita`,
- opzionale `Trattamento` se compilato,
- N record `Foto` (data URL locale),
- aggiornamento `forzaFamiglia` e `fotoCopertina`,
- GPS concatenato in `visita.note`.

---

## 6. Modello dati (sintesi)

Sette entità persistite in Dexie v5. Dettaglio completo in [DATABASE.md](./DATABASE.md).

```
Apiario ──1:N──▶ Arnia ──1:N──▶ Visita ──1:N──▶ Foto
                   ├── 1:N ──▶ Produzione
                   ├── 1:N ──▶ Trattamento
                   └── FK ──▶ Regina (reginaAttualeId)
```

**Campi denormalizzati intenzionali:**
- `Apiario.numeroArnie` — aggiornato da `syncApiarioArnieCount()` su create/delete arnia,
- `Arnia.forzaFamiglia` — ricalcolato ad ogni visita da `saluteScore.ts`.

**Entità non ancora modellate:** `Utente`, `Impostazioni` (rimossa in migrazione v5).

---

## 7. Indice salute colonia (0–100)

Modello a punteggio additivo. Implementazione: `src/features/arnie/utils/saluteScore.ts`.

| Parametro | Peso | Logica |
|-----------|-----:|--------|
| Regina presente | +20 | `reginaVista === true` o checklist `reginaVerificata === true` |
| Covata compatta | +20 | Testo contiene "compatta", "opercolata", "controllata" |
| Colonia forte | +15 | `forza >= 7` oppure regina + covata + scorte tutti positivi |
| Scorte abbondanti | +15 | Testo contiene "abbondant", "controllat", "adeguat" |
| Nessun sintomo | +10 | No regina assente, no "non controll", no "aggress"/"malattia" |
| Ultima visita < 10 gg | +10 | `VISITA_RECENTE_GIORNI = 10` |
| Trattamenti eseguiti | +10 | Trattamento negli ultimi 90 giorni |

**Soglie UI** (`getSaluteLevel`):
- ≥ 70 → verde "Buona",
- ≥ 40 → giallo "Attenzione",
- < 40 → rosso "Critica".

**Fallback senza visita:** usa `forzaFamiglia` se presente, altrimenti base per `stato`: attiva 70, debole 45, senza_regina 30, morta 0, inattiva 25.

---

## 8. Architettura software

### 8.1 Layer

```
Pages (features/*/pages)
  ↓
Feature components + hooks
  ↓
Feature services (orchestrazione dominio)
  ↓
Database services + repositories
  ↓
Dexie / IndexedDB (MeliDatabase v5)
```

**Regole:**
1. Le pages non chiamano Dexie direttamente (eccezione accettata: `liveQuery` in hook dedicati).
2. I componenti UI in `src/components/ui/` sono presentazionali.
3. Ogni feature espone API pubblica via `index.ts`.
4. Device capabilities passano da `src/services/device/` (Capacitor-ready).

Documentazione tecnica estesa: [../ARCHITETTURA.md](../ARCHITETTURA.md).

### 8.2 Stack tecnologico

| Layer | Tecnologia |
|-------|------------|
| UI | React 19, Framer Motion, Lucide |
| Routing | React Router 7, lazy loading moduli |
| Stato globale | Zustand (dipendenza presente, **non ancora usato**) |
| Persistenza | Dexie 4 → IndexedDB |
| Build | Vite 8, alias `@` e `@assets` |
| Lint | oxlint |

### 8.3 Device services

| Servizio | Web oggi | Futuro Capacitor |
|----------|----------|------------------|
| `cameraService` | `<input capture>` + FileReader | `@capacitor/camera` |
| `gpsService` | `navigator.geolocation` | `@capacitor/geolocation` |
| `notificationService` | Web Notification API | `@capacitor/local-notifications` |
| `storageService` | `localStorage` prefisso `meli:` | `@capacitor/preferences` |

---

## 9. Dati demo (seed)

Popolati automaticamente al primo accesso se tabelle vuote.

**Apiari (3):**

| Nome | Località | Arnie |
|------|----------|------:|
| Apiario Acquacalda | San Roberto (RC) | 28 |
| Apiario Bosco | Santo Stefano in Aspromonte (RC) | 16* |
| Apiario Valle | Calanna (RC) | 12* |

\*contatore apiario vs arnie seedate: solo Acquacalda ha 28 arnie complete; Bosco ha 1 arnia demo (n. 7).

**Arnia 12 (MELI-ACQ-12):** dataset ricco per demo — regina Ligustica 2025, visita 5 gg fa, trattamento oxalico, 6 record produzione, 2 foto.

File seed: `src/features/apiari/data/seedApiari.ts`, `src/features/arnie/data/seedArnie.ts`.

---

## 10. Principi UX non negoziabili

1. **Massimo 3 tocchi** per operazioni frequenti (apri arnia → visita → salva).
2. **Touch target ≥ 50 px** (`--meli-touch-min`).
3. **Modal fullscreen** per visite in campo.
4. **Feedback immediato** — `SuccessToast` post-salvataggio, animazioni leggere.
5. **Offline silenzioso** — nessun banner "sei offline" invasivo; i dati restano locali.
6. **Design premium caldo** — palette miele/crema/oro, glassmorphism, watermark RANU non invasivo.

Dettaglio visivo: [UI_GUIDELINES.md](./UI_GUIDELINES.md).  
Flussi operativi: [USER_FLOW.md](./USER_FLOW.md).

---

## 11. Roadmap prodotto (sintesi)

| Versione | Scope |
|----------|-------|
| **v0.1 Alpha** (attuale) | Dashboard, Apiari giro, Arnie scheda, visita guidata, DB v5 |
| **v0.5 Beta** | Regine, Trattamenti, Produzione UI, Report, PWA |
| **v1.0** | Backup cloud, QR scanner, notifiche, App Store / Play Store |

Dettaglio fasi: [ROADMAP.md](./ROADMAP.md).

---

## 12. Documenti correlati

| Documento | Contenuto |
|-----------|-----------|
| [USER_FLOW.md](./USER_FLOW.md) | Flussi operativi sul campo |
| [UI_GUIDELINES.md](./UI_GUIDELINES.md) | Design system |
| [DATABASE.md](./DATABASE.md) | Schema IndexedDB |
| [ROADMAP.md](./ROADMAP.md) | Piano di sviluppo |
| [BUSINESS_MODEL.md](./BUSINESS_MODEL.md) | Modello di business |
| [RELEASES.md](./RELEASES.md) | Storico rilasci |
| [FUTURE_IDEAS.md](./FUTURE_IDEAS.md) | Backlog idee |

---

*Documento mantenuto dal team prodotto MELI. Aggiornare ad ogni sprint che modifica scope o architettura.*
