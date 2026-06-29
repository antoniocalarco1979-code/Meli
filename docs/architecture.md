# Architettura

Stato aggiornato dopo Sprint 4–7 (database, arnie, visite, device layer).

---

## Layer

```
UI (components/ui)
    ↓
Layout (MainLayout, Header, Sidebar)
    ↓
Features (dashboard, apiari, arnie, visite, …)
    ↓
Feature services (arniaDetailService, visitSaveService, …)
    ↓
Database layer (repositories, Dexie services)
    ↓
Device services (camera, GPS, notifications, storage)
    ↓
IndexedDB / Web APIs
```

---

## Routing

React Router 7 con `MainLayout` e lazy loading.

| Route | Feature | Stato |
|-------|---------|-------|
| `/` | Dashboard | KPI live da IndexedDB |
| `/apiari/*` | Apiari | Lista + dettaglio + flusso visite |
| `/arnie/*` | Arnie | Lista + scheda premium |
| `/visite/*` | Visite | Placeholder (visita = modal) |
| `/regine` | Regine | Placeholder |
| `/trattamenti` | Trattamenti | Placeholder |
| `/produzione` | Produzione | Placeholder |
| `/magazzino` | Magazzino | Placeholder |
| `/report` | Report | Placeholder |

Config: `src/router/AppRouter.tsx`

---

## Feature module

```
src/features/<nome>/
  pages/        Route components
  components/   UI dominio
  services/     Logica feature (query arricchite, save)
  data/         Seed e mock
  types.ts
  index.ts
```

Moduli documentati:

- [Apiari](./modules/apiari.md)
- [Arnie](./modules/arnie.md)
- [Visite](./modules/visite.md)

---

## Database

Dexie **v5** — `src/database/`

| Tabella | Relazioni |
|---------|-----------|
| `apiari` | 1:N arnie |
| `arnie` | FK apiario, regina attuale, visite, produzione, trattamenti |
| `regine` | Storico per arnia |
| `visite` | FK arnia, 1:N foto |
| `foto` | Blob path / data URL |
| `produzione` | Per arnia e stagione |
| `trattamenti` | Per arnia, scadenze |

Dettaglio schema: [DATABASE.md](../DATABASE.md) e `src/database/schema.ts`.

Reactive UI: `liveQuery()` da Dexie (liste arnie, dashboard stats).

---

## Device e PWA

- Device layer: [device-services.md](./device-services.md)
- PWA: pianificata (Fase 4 roadmap) — `vite-plugin-pwa` in devDependencies

---

## Estendere il progetto

1. **Nuova feature** — cartella in `features/`, rotta in `AppRouter.tsx`
2. **Nuova tabella** — incrementare `DATABASE_VERSION`, migrazione in `database.ts`
3. **Nuovo sensore nativo** — aggiungere servizio in `services/device/`, non nella UI
