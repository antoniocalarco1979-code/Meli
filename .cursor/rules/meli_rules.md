---
description: Regole ufficiali di sviluppo MELI — qualità, UI, architettura, UX, database, Capacitor
alwaysApply: true
---

# MELI — Regole di sviluppo

**Ruolo:** sviluppatore ufficiale del progetto MELI.  
**Prima di modificare qualsiasi file**, rispettare sempre queste regole.

MELI non è una demo. È un prodotto destinato a **Play Store** e **App Store**. Ogni modifica deve essere di qualità professionale.

**Docs di riferimento:** `docs/MELI_PRODUCT_SPEC.md` · `docs/DATABASE.md` · `docs/USER_FLOW.md` · `docs/UI_GUIDELINES.md`

---

## Filosofia

- Offline-first: nessuna funzione core dipende da Internet.
- Prodotto pubblicabile, non prototipo usa-e-getta.
- Diff minimi: non refactorare codice non correlato al task.
- Non creare file markdown non richiesti. Non commit/push senza richiesta esplicita.

---

## Qualità codice

- **Mai codice duplicato** — estrarre in componenti, hook o service condivisi.
- **Preferire componenti riutilizzabili** — prima controllare `src/components/ui/` e pattern esistenti nella feature.
- **Nessun `any` in TypeScript** — usare tipi in `database/types/` o `features/*/types.ts`.
- **Commentare solo codice complesso** — migrazioni Dexie, parsing salute, side effect visita.
- **Codice leggibile** — nomi espliciti, funzioni brevi, niente cleverness inutile.

**Stack vincolato:** React 19 · Vite 8 · React Router 7 · Dexie 4 · Framer Motion · Lucide · CSS + token.

**Vietato:** Tailwind, Bootstrap, librerie UI esterne, web font custom, hex hardcoded nei componenti feature.

---

## UI

Ottimizzato per **touch**, **Android**, **iPhone**, **iPad** e **browser**.

| Requisito | Implementazione |
|-----------|-----------------|
| Pulsanti grandi | Touch target ≥ `--meli-touch-min` (50px) |
| Contrasto elevato | Testo `--meli-brown` su `--meli-cream`, mai `#000` puro |
| Utilizzabile al sole | Semafori saturi (`--meli-hive-*`), no glass eccessivo su CTA critiche |
| Utilizzabile con guanti | No gesture obbligatorie, tap binari, modal **fullscreen** in campo |
| Multi-device | Breakpoint 768–1024 (iPad), safe-area `env(safe-area-inset-*)`, `100dvh` |

- Componenti UI: solo `@/components/ui` (Button, Card, Modal, …).
- Stili: token in `src/theme/tokens.css`, glass `.meli-glass`.
- Motion: max 450ms; no animazioni pesanti su liste 20+ item.
- Dettaglio: `docs/UI_GUIDELINES.md`.

---

## Architettura

Seguire **sempre** questa struttura. Mai creare file disordinati.

```
src/
├── features/       # Moduli dominio (pages, components, services, hooks, data)
├── components/     # ui/ · layout/ · common/
├── services/       # device/ (Capacitor-ready)
├── database/       # schema, repositories, services Dexie
├── hooks/          # Hook globali
├── theme/          # tokens.css, global.css
├── types/          # Tipi globali
└── router/         # config + AppRouter
```

### Layer dati

```
Pages → Feature components/hooks → Feature services → Database services/repositories → Dexie
```

1. **Pages** — composizione UI; no Dexie diretto (ok `liveQuery` solo in hook dedicati).
2. **Feature services** — orchestrazione (es. `visitaSaveService`, `arniaDetailService`).
3. **Database layer** — CRUD, migrazioni, cascade delete.
4. **components/ui/** — presentazionale, zero logica di dominio.
5. **Device** — solo `src/services/device/`. Non usare `src/platform/` (deprecated).

### Nuova feature

1. `src/features/<nome>/` con `pages/`, `services/`, `index.ts`
2. Rotta in `router/config.ts` + lazy in `AppRouter.tsx`
3. Schema + migrazione Dexie se serve → aggiornare `docs/DATABASE.md`

---

## UX

- **Minimo numero di tocchi** per ogni operazione importante (target: visita in < 30 s).
- **Schermate veloci** — lazy loading moduli, niente fetch inutili, feedback immediato (`SuccessToast`).
- **Mai chiedere informazioni inutili** — default intelligenti, campi opzionali collassati, GPS in background.
- Flussi campo: giro sequenziale (`ApiarioVisiteFlow`), visita guidata 6 step (`NuovaVisitaModal` fullscreen).
- Dettaglio flussi: `docs/USER_FLOW.md`.

---

## Database

- **Ogni modifica compatibile con Dexie** — migrazioni versionate, mai breaking silent.
- Database: `MeliDatabase`, schema **v5** (`src/database/schema.ts`).
- Store: `apiari`, `arnie`, `regine`, `visite`, `foto`, `produzione`, `trattamenti`.

### Campi obbligatori per entità

Ogni entità **deve** avere:

```typescript
id: string
createdAt: number   // Unix ms
updatedAt: number   // Unix ms
```

Nuove entità e migrazioni devono rispettare questo contratto. Entità v5 senza timestamps (es. `Visita`, `Regina`) vanno allineate in prossima migrazione v6+.

**Procedure breaking change:**
1. Aggiornare `entities.ts` / `inputs.ts`
2. Incrementare `DATABASE_VERSION`
3. Scrivere `.upgrade()` in `database.ts`
4. Aggiornare `docs/DATABASE.md` e `docs/RELEASES.md`

**Indice salute 0–100:** solo `src/features/arnie/utils/saluteScore.ts` → aggiorna `Arnia.forzaFamiglia` in `visitaSaveService`.

---

## Compatibilità Capacitor

Preparare **sempre** il codice per Capacitor. Mai usare API che impediscano pubblicazione su Android o iPhone.

| Capability | Usare | Evitare |
|------------|-------|---------|
| Camera | `cameraService.capturePhoto()` | `<input>` sparsi nelle feature |
| GPS | `gpsService.getCurrentPosition()` | `navigator.geolocation` diretto |
| Storage prefs | `storageService` | `localStorage` sparso |
| Notifiche | `notificationService` | API web non astratte |
| Foto | path/data URL astratto | Assumere solo browser APIs |

- No dipendenze solo-web senza fallback o adapter.
- No `window`-only hacks senza guard Capacitor.
- PWA + Capacitor: stesso codebase React, device layer sostituibile.

---

## Dominio — riferimenti rapidi

| Concetto | File |
|----------|------|
| Salute colonia | `features/arnie/utils/saluteScore.ts` |
| Salvataggio visita | `features/arnie/services/visitaSaveService.ts` |
| Giro apiario | `features/apiari/components/ApiarioVisiteFlow.tsx` |
| Export giro | `features/apiari/services/giroReportService.ts` |
| Entità DB | `database/types/entities.ts` |

---

## Checklist prima di ogni modifica

- [ ] Riutilizzo componenti/service esistenti (no duplicazione)
- [ ] Zero `any`
- [ ] Touch ≥ 50px, contrasto ok, testato mentalmente su iPad + phone
- [ ] File nel folder corretto (`features/`, `components/`, …)
- [ ] UX: meno tocchi possibile, niente campi superflui
- [ ] Dexie: migrazione se schema cambia; `id` + timestamps su entità
- [ ] Capacitor-ready: device via `services/device/`
- [ ] `npm run build` verde
- [ ] Qualità prodotto store, non demo

---

## Moduli — stato attuale

| Modulo | Stato |
|--------|-------|
| Dashboard, Apiari, Arnie | ✅ Core |
| Visite (pagina) | 🔲 Placeholder — UX in Apiari/Arnie |
| Regine, Trattamenti, Produzione, Magazzino, Report | 🔲 Placeholder |

Implementare moduli placeholder solo con qualità production-ready e docs aggiornati.
