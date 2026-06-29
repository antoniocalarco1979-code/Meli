# MELI — Technical Debt Register

**Documento:** registro debito tecnico CTO  
**Data:** 26 giugno 2026  
**Stato build:** `npm run build` ✅ · `npm run lint` ✅ (1 warning)

> Regola: ogni item ha **impatto**, **sforzo stimato** (S/M/L), **priorità** (P0–P3).  
> Non aggiungere funzionalità finché P0 non è chiuso per la milestone corrente.

---

## Legenda

| Sforzo | Giorni dev (stima) |
|--------|-------------------|
| S | ≤ 1 |
| M | 2–4 |
| L | 5+ |

| Priorità | Significato |
|----------|-------------|
| P0 | Blocca release v0.1 |
| P1 | Degradazione UX o rischio dati |
| P2 | Manutenibilità / velocità team |
| P3 | Nice-to-have |

---

## TD-01 — Architettura e struttura

| ID | Descrizione | Impatto | Sforzo | Priorità | Azione consigliata |
|----|-------------|---------|--------|----------|-------------------|
| TD-01.1 | Documentazione cita `src/router/` — codice attivo in `src/app/router/` | Confusione onboarding | S | P2 | Aggiornare `USER_FLOW.md`, `architecture.md`, `CHANGELOG.md` |
| TD-01.2 | Alias `@/` definito in Vite ma non adottato negli import | Inconsistenza path | M | P3 | Migrare gradualmente o rimuovere alias |
| TD-01.3 | Feature stub (regine, trattamenti, …) sen barrel `index.ts` | Import inconsistenti | S | P3 | Aggiungere barrel minimali |
| TD-01.4 | `useMediaQuery` esiste ma non esportato da `hooks/index.ts` | Hook nascosto | S | P3 | Esportare o rimuovere se unused |
| TD-01.5 | Nessun layer `features/*/pages` separato da `components` per stub modules | OK per MVP | — | P3 | Mantenere fino a implementazione moduli |

---

## TD-02 — Database e persistenza

| ID | Descrizione | Impatto | Sforzo | Priorità | File |
|----|-------------|---------|--------|----------|------|
| TD-02.1 | `visitSaveService` non aggiorna `arnia.stato` / `reginaAttualeId` | **Dati incoerenti** | M | **P0** | `visitSaveService.ts` |
| TD-02.2 | `numeroArnie` apiario stale dopo seed | KPI errati | S | P1 | Chiamare `syncApiarioArnieCount` in bootstrap seed |
| TD-02.3 | Migrazioni v1–v5 in un unico file (~200 righe) | Leggibilità | S | P2 | Estrarre fn migrazione in `database/migrations/` |
| TD-02.4 | Foto salvate come data URL in IndexedDB | Quota IndexedDB | M | P1 | Compressione / blob store / Capacitor Filesystem |
| TD-02.5 | Nessun backup/export JSON utente | Perdita dati dispositivo | M | P1 | Service export/import (Fase 4 roadmap) |
| TD-02.6 | Store `impostazioni` rimosso in v5 senza sostituto | Impostazioni assenti | M | P2 | Nuovo store o localStorage tipizzato |
| TD-02.7 | Magazzino non modellato | Modulo impossibile | L | P3 | Design schema prima di UI |

---

## TD-03 — Routing e navigazione

| ID | Descrizione | Impatto | Sforzo | Priorità | File |
|----|-------------|---------|--------|----------|------|
| TD-03.1 | `/visite` e `/visite/nuova` stub/redirect | Navigazione fuorviante | M | P2 | Lista visite o rimuovere route sidebar |
| TD-03.2 | `routeMeta` senza path dinamici (`/apiari/:id`) | Header generico su detail | S | P2 | Estendere `resolveRouteMeta` |
| TD-03.3 | Altro → Impostazioni: bottone morto | UX rotta | S | P2 | Route `/impostazioni` o disabilitare CTA |

---

## TD-04 — UI / componenti

| ID | Descrizione | Impatto | Sforzo | Priorità | File |
|----|-------------|---------|--------|----------|------|
| TD-04.1 | `TrattamentiCard` non montata in `ArniaDetail` | Feature nascosta | S | **P0** | `ArniaDetail.tsx` |
| TD-04.2 | `ArniaDetailPage.onEdit` placeholder vuoto | Modifica impossibile | M | **P0** | `ArniaDetailPage.tsx` + form |
| TD-04.3 | `ArniePage` senza empty state | UX lista vuota | S | P1 | `ArniePage.tsx` |
| TD-04.4 | Empty state inline duplicati nelle card (`__empty` CSS) vs `EmptyState` | Duplicazione CSS/copy | M | P2 | Componente `InlineEmpty` condiviso |
| TD-04.5 | Photo placeholder CSS duplicato (4 componenti) | Duplicazione | M | P2 | `PhotoPlaceholder` condiviso |
| TD-04.6 | Colori hardcoded residui in CSS feature (WeatherCard, ApiaryMap, Button danger) | Drift design system | M | P2 | Migrare a token |
| TD-04.7 | Lucide import diretti in ~30 file vs `theme/icons.ts` | Icone non centralizzate | M | P2 | Estendere barrel icone |
| TD-04.8 | `SuccessToast` rimosso — verificare nessun import residuo | — | S | P3 | ✅ Già rimosso |

---

## TD-05 — Visit engine e giro

| ID | Descrizione | Impatto | Sforzo | Priorità | File |
|----|-------------|---------|--------|----------|------|
| TD-05.1 | Giro non filtra arnie `inattiva`/`morta` | Visite inutili | S | P1 | `useApiarioGiroFlow.ts` |
| TD-05.2 | Doppio toast su salvataggio visita standalone | UX ridondante | S | P2 | Solo parent o solo wizard |
| TD-05.3 | `visit-engine.css` ~344 righe | Manutenibilità | M | P2 | Split per step/componente |
| TD-05.4 | Meteo/temperatura nel form visita non raccolti in wizard attuale | Campi DB vuoti | S | P2 | Step meteo opzionale o rimuovere da schema visita |
| TD-05.5 | `ApiarioForm` catch re-throw `'save failed'` per chiudere modal | Pattern fragile | S | P2 | Result type esplicito |

---

## TD-06 — Dashboard e mock data

| ID | Descrizione | Impatto | Sforzo | Priorità | File |
|----|-------------|---------|--------|----------|------|
| TD-06.1 | `mockDashboard.ts` mescola dati demo e config UI | Confusione live vs mock | M | P1 | Separare `dashboardConfig.ts` e `dashboardMock.ts` |
| TD-06.2 | KPI produzione kg sempre mock | Metrica falsa | M | P2 | Query `produzioneService` aggregata |
| TD-06.3 | ApiaryMap marker statici | Mappa non operativa | L | P3 | Posizioni GPS apiari/arnie |
| TD-06.4 | WeatherCard dati statici | Accettabile MVP | L | P3 | API meteo o input manuale |

---

## TD-07 — Device, PWA, Capacitor

| ID | Descrizione | Impatto | Sforzo | Priorità | File |
|----|-------------|---------|--------|----------|------|
| TD-07.1 | `vite-plugin-pwa` installato ma non configurato | Dep inutile | M | **P0** | `vite.config.ts` + manifest |
| TD-07.2 | 5 TODO Capacitor in device services | Nativo non pronto | L | P2 | Spike Capacitor sprint dedicato |
| TD-07.3 | `cameraService` web usa input file — OK browser, limitato iOS PWA | Foto campo | M | P1 | Capacitor Camera |
| TD-07.4 | `notificationService` stub | Promemoria trattamenti impossibili | L | P3 | Post v0.5 |
| TD-07.5 | Nessun test permessi GPS/camera negati | UX errore generica | S | P2 | Messaggi utente dedicati |

---

## TD-08 — Qualità codice e tooling

| ID | Descrizione | Impatto | Sforzo | Priorità | File |
|----|-------------|---------|--------|----------|------|
| TD-08.1 | Zero test automatizzati | Regressioni silenti | L | P1 | Vitest + test su save/salute |
| TD-08.2 | Solo `oxlint`, no ESLint TypeScript rules completi | Gap type-aware lint | S | P2 | Valutare eslint flat config |
| TD-08.3 | Warning `react-hooks/exhaustive-deps` in `useLiveQuery` | Possibile re-render | S | P2 | `useLiveQuery.ts` |
| TD-08.4 | Bundle entry ~499 KB gzip 160 KB | Performance iPad | M | P2 | Analisi rollup visualizer |
| TD-08.5 | Nessuna CI (GitHub Actions) | Build non verificata su PR | M | P1 | Pipeline lint + build |
| TD-08.6 | `package.json` version `0.0.0` | Release hygiene | S | P1 | Tag v0.1.0 |

---

## TD-09 — Documentazione

| ID | Descrizione | Impatto | Sforzo | Priorità | File |
|----|-------------|---------|--------|----------|------|
| TD-09.1 | `docs/modules/visite.md` riferisce `NuovaVisitaModal` | Doc falsa | S | P1 | Rewrite modulo visite |
| TD-09.2 | `CHANGELOG.md` non allineato a VisitWizard / refactor architettura | Storico inaffidabile | S | P1 | Entry [Unreleased] |
| TD-09.3 | `README.md` root link a file eliminati | Broken links | S | P1 | Puntare a `docs/` |
| TD-09.4 | `RELEASES.md` cita TrattamentiCard montata | Release note errata | S | P2 | Correggere |
| TD-09.5 | `ROADMAP.md` cita NuovaVisitaModal completato | Roadmap stale | S | P2 | VisitWizard |

---

## TD-10 — Sicurezza e dati (pre-produzione)

| ID | Descrizione | Impatto | Sforzo | Priorità |
|----|-------------|---------|--------|----------|
| TD-10.1 | Nessuna cifratura IndexedDB | Dati in chiaro su device | M | P3 (pre v1.0) |
| TD-10.2 | Foto/data URL senza sanitizzazione dimensione | DoS quota locale | M | P2 |
| TD-10.3 | Nessun rate limit su seed (re-run hooks) | Performance init | S | P3 |

---

## Matrice prioritizzazione (P0 — sprint immediato)

```
TD-02.1  visitSave → regina/stato     [M] ████████░░
TD-04.1  Wire TrattamentiCard       [S] ██████████
TD-04.2  Modifica arnia UI          [M] ████████░░
TD-07.1  PWA config                 [M] ████████░░
TD-09.*  Doc alignment              [S] ██████████
```

---

## Debito accettato (won't fix pre v0.1)

| Item | Motivazione |
|------|-------------|
| Moduli stub completi | Out of scope v0.1 per definizione |
| Capacitor nativo | Browser PWA sufficiente per alpha |
| Magazzino | Nessun requisito business validato |
| Weather API | Mock accettabile per demo RANU |
| Test e2e | Dopo stabilizzazione flusso core |

---

## Processo di governance

1. **Review settimanale** — aggiornare questo file a fine sprint
2. **Regola ingresso** — nessun P3 finché P0 milestone aperta
3. **Definition of Done debito** — item chiuso solo con PR + doc aggiornata se applicabile
4. **Metriche target v0.5:** 0 item P0 · ≤ 3 item P1 aperti · test coverage core ≥ 60%

---

*Collegato a: [MVP_CHECKLIST.md](./MVP_CHECKLIST.md) · [NEXT_SPRINT.md](./NEXT_SPRINT.md)*
