# MELI — User Flow

**Audience:** product, design, sviluppo frontend  
**Contesto:** apicoltore professionale in apiario, iPad o smartphone, spesso offline  
**Ultimo aggiornamento:** giugno 2026

---

## 1. Panoramica navigazione

### 1.1 Route map

Configurazione: `src/router/AppRouter.tsx`, `src/router/config.ts`.

| Path | Pagina | Stato | Note |
|------|--------|-------|------|
| `/` | `DashboardPage` | ✅ | Entry point app |
| `/apiari` | `ApiariPage` | ✅ | Lista + CRUD |
| `/apiari/:id` | `ApiarioDetailPage` | ✅ | Giro visite |
| `/arnie` | `ArniePage` | ✅ | Griglia colonie |
| `/arnie/:id` | `ArniaDetailPage` | ✅ | Scheda premium |
| `/visite` | `VisitePage` | 🔲 | Placeholder — redirect consigliato |
| `/visite/nuova` | — | ↪ | Redirect → `/arnie` |
| `/regine` | `ReginePage` | 🔲 | Placeholder |
| `/trattamenti` | `TrattamentiPage` | 🔲 | Placeholder |
| `/produzione` | `ProduzionePage` | 🔲 | Placeholder |
| `/magazzino` | `MagazzinoPage` | 🔲 | Placeholder |
| `/report` | `ReportPage` | 🔲 | Placeholder |
| `*` | — | ↪ | Redirect → `/` |

**Sidebar:** 9 voci generate da `appRoutes`. Moduli secondari lazy-loaded con `React.lazy` + `Suspense`.

### 1.2 Layout persistente

Tutte le route (eccetto modali) usano `MainLayout`:
- **Sidebar** sinistra (256 px desktop, 76 px collapsed ≥ 1024 px, orizzontale < 768 px),
- **Header** con titolo da `routeMeta`,
- **Main** scrollabile con safe-area iOS.

---

## 2. Flusso A — Inizio giornata (Dashboard → Apiario)

**Obiettivo:** l'apicoltore apre l'app al mattino e va direttamente al sito di lavoro.

```
Dashboard
  └─ [INIZIA GIORNATA]  (StartDayButton)
       └─ /apiari/{primaryApiarioId}
            └─ ApiarioDetailPage
                 └─ ApiarioGiroHero
```

### Passi

1. L'utente vede KPI (parzialmente live), meteo mock, mappa arnie mock.
2. Tap **INIZIA GIORNATA** (`StartDayButton`).
3. `useDashboardFlow` risolve l'apiario primario:
   - preferisce nome contenente **"Acquacalda"**,
   - fallback: primo apiario in DB.
4. Navigazione a `/apiari/{id}` con hero apiario visibile.

### Decisioni prodotto

- Il pulsante centrale è l'**azione primaria** della dashboard — non seppellirlo in menu.
- In futuro: apiario selezionato persistito (Zustand + `localStorage`, vedi TODO).

---

## 3. Flusso B — Giro apiario sequenziale

**Obiettivo:** visitare tutte le arnie di un sito in ordine, senza saltare o perdere il filo.

**Componenti:** `ApiarioGiroHero` → `ApiarioVisiteFlow` → `ApiarioVisitaCard` / `ApiarioVisitaRow` → `ApiarioGiroCompletato`.

### 3.1 Stati del giro

```
[IDLE] ──[Inizia Giro]──▶ [GIRO_ATTIVO]
                              │
                    per ogni arnia in ordine:
                              │
                    [STEP_APERTO] ──[Salva visita]──▶ [STEP_COMPLETATO]
                              │                           │
                              │                    auto-advance 400ms
                              │                           │
                              └───────────────────────────┘
                              │
                    tutte completate ──▶ [GIRO_COMPLETATO]
```

### 3.2 Passo per passo

| Step | Azione utente | Sistema |
|------|---------------|---------|
| 1 | Apre dettaglio apiario | Carica arnie via `liveQuery`, ordine numerico |
| 2 | Tap **Inizia Giro** | `giroActive = true`, reset `GiroSessionStats`, apre arnia index 0 |
| 3 | Vede card espansa `🐝 ARNIA N` | Stato semaforo, ultima visita, bottone **[VISITA]** |
| 4 | Tap **VISITA** | Apre `NuovaVisitaModal` fullscreen |
| 5 | Completa checklist e salva | `saveNuovaVisita()` → aggiorna DB, stats sessione |
| 6 | Toast successo | Modal chiude, step marcato ✓, avanza al successivo |
| 7 | Ripete 3–6 | Righe compatte per step completati (`ApiarioVisitaRow`) |
| 8 | Ultima arnia salvata | Mostra `ApiarioGiroCompletato` |

### 3.3 Statistiche sessione

Accumulate in `GiroSessionStats` (`giroReportService.ts`):

| Metrica | Incremento |
|---------|------------|
| `arnieVisitate` | +1 per ogni salvataggio |
| `trattamenti` | +1 se visita include trattamento |
| `foto` | +N foto allegate |
| `regineDaControllare` | +1 se `reginaVista === false` |

### 3.4 Export report giro

Schermata completamento → **Esporta Report**:
- genera file `.txt` locale,
- nome: `meli-giro-{apiario}-{timestamp}.txt`,
- contenuto: apiario, data, 4 metriche sessione.

**Limite attuale:** export testuale, non PDF né CSV strutturato.

### 3.5 Wireframe logico

```
┌─────────────────────────────────────┐
│  🐝  APIARIO ACQUACALDA             │
│  28 arnie                           │
│  [ Inizia Giro ]                    │
├─────────────────────────────────────┤
│  ✓ 🐝 ARNIA 1    visitata oggi      │
│  ✓ 🐝 ARNIA 2    visitata oggi      │
│  ┌───────────────────────────────┐  │
│  │ 🐝 ARNIA 3                    │  │
│  │ 🟡 Stato: Attenzione          │  │
│  │ Ultima visita: 12 giorni fa   │  │
│  │ [ VISITA ]                    │  │
│  └───────────────────────────────┘  │
│  ○ 🐝 ARNIA 4                       │
│  ○ 🐝 ARNIA 5                       │
└─────────────────────────────────────┘
```

---

## 4. Flusso C — Nuova visita (modal guidata)

**Entry points:**
- Giro apiario → **[VISITA]** su card arnia,
- Scheda arnia → FAB **Nuova Visita**,
- Dashboard azione rapida → `/arnie/{id}` con `state.openVisita: true`.

**Componente:** `NuovaVisitaModal` (variant `fullscreen`).

### 4.1 Step guidati

Definiti in `visitaGuidataSteps.ts`:

| # | Step ID | Label UI | Cosa fa l'utente |
|---|---------|----------|------------------|
| 1 | `posizione` | Posizione | Conferma GPS (auto-fetch all'apertura) |
| 2 | `regina` | Regina | Verifica presenza regina (sì/no) |
| 3 | `covata` | Covata | Conferma controllo covata |
| 4 | `scorte` | Scorte | Conferma controllo scorte |
| 5 | `foto` | Foto telaio | Scatta foto via `cameraService` |
| 6 | `concluso` | Conclusione | Note, trattamento opzionale, salva |

### 4.2 Checklist state

```typescript
{
  reginaVerificata: boolean | null,  // null = non ancora risposto
  covataControllata: boolean,
  scorteControllate: boolean,
  telaioFotografato: boolean,
}
```

La checklist alimenta `buildSaluteFlagsFromChecklist()` al salvataggio.

### 4.3 Side effects al salvataggio

`visitaSaveService.saveNuovaVisita()` esegue in sequenza:

1. **Crea `Visita`** con campi form + GPS in `note`.
2. **Crea `Trattamento`** se campo trattamento compilato.
3. **Recupera trattamento recente** se non creato (per flag salute).
4. **Calcola `forzaFamiglia`** (0–100) da checklist o visita.
5. **Aggiorna `Arnia`** — `forzaFamiglia`, `fotoCopertina` se foto presente.
6. **Crea N `Foto`** collegate a visita e arnia.
7. **Ritorna summary** — `{ fotoCount, hadTrattamento, reginaNonVista }`.

### 4.4 Feedback

- `SuccessToast` breve post-salvataggio.
- Modal si chiude → callback `onSaved(summary)` al parent (giro o scheda).
- `liveQuery` aggiorna automaticamente liste e KPI dashboard.

### 4.5 Tempo target

Flusso ottimizzato per **< 30 secondi** con checklist positiva e zero note:
- GPS in background all'apertura,
- tap binari su regina/covata/scorte,
- foto opzionale ma incentivata,
- un solo tap **Salva** finale.

---

## 5. Flusso D — Consultazione scheda arnia

**Route:** `/arnie/:id`  
**Service:** `getArniaDetailView(id)` in `arniaDetailService.ts`.

### 5.1 Sezioni scheda

Ordine verticale in `ArniaDetail`:

| # | Componente | Dati mostrati |
|---|------------|---------------|
| 1 | `ArniaHeader` | Numero, apiario, stato, copertina, edit (placeholder) |
| 2 | `HealthCard` | Score 0–100, breakdown 7 parametri, semaforo |
| 3 | `QueenCard` | Regina attuale: razza, anno, colore, marcatura |
| 4 | `ProductionCard` | Totale kg stagione |
| 5 | `UltimaVisitaCard` | Data, covata, scorte, forza |
| 6 | `TimelineCard` | Ultime 12 voci miste (visite/trattamenti/produzione) |
| 7 | `PhotoGallery` | Foto da visite e scheda |
| 8 | `TrattamentiCard` | Storico trattamenti |

FAB fisso in basso: **Nuova Visita**.

### 5.2 Deep link con visita aperta

```typescript
navigate(`/arnie/${arniaId}`, { state: { openVisita: true } })
```

`ArniaDetailPage` legge `location.state` e apre `NuovaVisitaModal` al mount.

---

## 6. Flusso E — Gestione apiari (CRUD)

**Route:** `/apiari`

| Azione | UI | Service |
|--------|-----|---------|
| Lista | Card apiario con N arnie, località | `liveQuery` + seed |
| Crea | `ApiarioModal` → `ApiarioForm` | `createApiario()` |
| Modifica | Tap card → modal edit | `updateApiario()` |
| Elimina | Confirm dialog | `deleteApiario()` + cascade |

**Attenzione:** delete apiario elimina **tutte** le arnie e dati correlati — conferma obbligatoria.

---

## 7. Flussi secondari (mock o placeholder)

### 7.1 Mappa dashboard

Tap su marker arnia (dati mock) → navigazione `/arnie/{id}` per numero hive.

### 7.2 Azioni rapide dashboard

| Azione | Stato | Comportamento attuale |
|--------|-------|----------------------|
| Nuova visita | ✅ Parziale | Deep link arnia 12 + modal |
| Scatta foto | 🔲 | Nessun handler |
| Nota vocale | 🔲 | Nessun handler |
| Scansiona QR | 🔲 | Nessun handler |
| Promemoria | 🔲 | Nessun handler |

### 7.3 Moduli sidebar placeholder

Pagine `FeaturePage` con `EmptyState` "Sezione in sviluppo".  
I dati sottostanti (regine, trattamenti, produzione) **esistono in DB** ma non hanno UI lista dedicata.

---

## 8. Flussi errori e edge case

| Scenario | Comportamento attuale | Miglioramento futuro |
|----------|----------------------|---------------------|
| GPS negato | Visita salvabile senza coordinate | Banner soft "posizione non disponibile" |
| Camera negata | Step foto saltabile | Messaggio guida permessi |
| IndexedDB pieno | Errore Dexie non gestito UI | Catch + messaggio + suggerimento export |
| Giro interrotto | Stato perso al refresh pagina | Persist sessione giro in sessionStorage |
| Arnia senza visite | Salute da fallback `stato` | Badge "Mai visitata" |
| Regina non vista | Contatore giro + score basso | Alert post-giro "N regine da controllare" |

---

## 9. Persona walkthrough — giornata tipo

**06:30** — Antonio apre MELI su iPad. Dashboard mostra indice salute medio 72, ultima visita "3 giorni fa".

**06:31** — Tap **INIZIA GIORNATA** → Apiario Acquacalda, 28 arnie.

**06:32** — Tap **Inizia Giro**. Si apre ARNIA 1.

**06:33–09:00** — Per ogni arnia: VISITA → checklist → Salva. Il giro avanza automaticamente. 2 arnie con regina non vista incrementano il contatore.

**09:01** — Schermata **Giro completato**: 28 arnie, 3 trattamenti, 15 foto, 2 regine da controllare. Export report `.txt` per archivio.

**09:05** — Tap su arnia 12 dalla lista per approfondire: vede breakdown salute, timeline, foto storiche.

---

## 10. Metriche UX da monitorare (post-lancio)

| Metrica | Definizione | Target |
|---------|-------------|--------|
| Time-to-save visit | Apertura modal → salvataggio | < 30 s |
| Giro completion rate | Arnie visitate / arnie totali per sessione | ≥ 80% |
| Drop-off step | Step con più abbandoni nel modal | Identificare attrito |
| Foto attach rate | Visite con ≥ 1 foto | ≥ 40% |
| Return same-day | Riapertura app stesso giorno | Segnale utilità |

---

*Indice salute e regole dati: [MELI_PRODUCT_SPEC.md](./MELI_PRODUCT_SPEC.md). Schema: [DATABASE.md](./DATABASE.md). UI: [UI_GUIDELINES.md](./UI_GUIDELINES.md).*
