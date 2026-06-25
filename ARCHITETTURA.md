# MELI — Architettura

Documento di riferimento per lo sviluppo frontend.

---

## Visione

**MELI** è un'applicazione web progressiva per apicoltori professionali, ottimizzata per **iPad**, con UX premium stile Apple e persistenza offline.

---

## Stack tecnologico

| Layer | Tecnologia |
|-------|------------|
| UI | React 19, TypeScript |
| Build | Vite 8 |
| Routing | React Router 7 |
| Stato | Zustand (globale), React state (locale) |
| Animazioni | Framer Motion |
| Icone | Lucide React |
| DB locale | Dexie 4 (IndexedDB) |
| Stili | CSS modulare + design tokens |

---

## Struttura repository

```
MELI/
├── docs/              Documentazione dettagliata
├── assets/            Brand e immagini sorgente
├── public/            Asset statici runtime
├── src/
│   ├── components/
│   │   ├── ui/        Design system (Button, Card, …)
│   │   ├── layout/    MainLayout, Header, Sidebar
│   │   └── common/    FeaturePage, utility condivise
│   ├── features/      Moduli di dominio
│   ├── router/        Config rotte + AppRouter
│   ├── theme/         tokens.css, global.css
│   ├── services/      Business logic
│   ├── database/      Dexie
│   ├── hooks/         Custom hooks
│   └── types/         Tipi globali
├── ROADMAP.md
├── TODO.md
├── CHANGELOG.md
├── DATABASE.md
├── ARCHITETTURA.md
└── STYLE_GUIDE.md
```

---

## Architettura a layer

```
┌─────────────────────────────────────────┐
│  Pages (features/*/pages)             │
├─────────────────────────────────────────┤
│  Feature components                     │
├─────────────────────────────────────────┤
│  Layout + UI components                 │
├─────────────────────────────────────────┤
│  Services (regole, orchestrazione)      │
├─────────────────────────────────────────┤
│  Database (Dexie / IndexedDB)           │
└─────────────────────────────────────────┘
```

### Regole

1. Le **pages** non accedono direttamente a Dexie — usano i **services**.
2. I **componenti UI** sono presentazionali, senza logica di dominio.
3. Ogni **feature** espone solo ciò che serve via `index.ts`.
4. Configurazione rotte centralizzata in `router/config.ts`.

---

## Routing

`MainLayout` wrappa tutte le route e fornisce Sidebar + Header + `<Outlet />`.

| Path | Componente | Stato |
|------|------------|-------|
| `/` | DashboardPage | ✅ Completa (mock) |
| `/apiari` | ApiariPage | 🔲 Placeholder |
| `/arnie` | ArniePage | 🔲 Placeholder |
| `/visite` | VisitePage | 🔲 Placeholder |
| `/regine` | ReginePage | 🔲 Placeholder |
| `/trattamenti` | TrattamentiPage | 🔲 Placeholder |
| `/produzione` | ProduzionePage | 🔲 Placeholder |
| `/magazzino` | MagazzinoPage | 🔲 Placeholder |
| `/report` | ReportPage | 🔲 Placeholder |

Le feature secondarie usano **lazy loading** (`React.lazy` + `Suspense`).

---

## Feature module

Template per ogni dominio:

```
features/<nome>/
├── pages/
│   └── <Nome>Page.tsx
├── components/       (opzionale)
├── data/               (mock → services)
├── types.ts
└── index.ts
```

---

## Layout responsive

| Breakpoint | Comportamento |
|------------|---------------|
| ≥ 1025px | Sidebar 256px, layout completo |
| 768–1024px | Sidebar compatta 76px (solo icone) |
| < 768px | Sidebar orizzontale / stack mobile |

Safe area iOS: `env(safe-area-inset-*)` nel MainLayout.

---

## Alias import

```typescript
import { Button } from '@/components/ui'
import logo from '@assets/brand/meli-logo.svg'
```

Configurati in `vite.config.ts`.

---

## Estensione

### Nuova feature

1. Creare `src/features/<nome>/pages/<Nome>Page.tsx`
2. Aggiungere rotta in `router/config.ts` e `AppRouter.tsx`
3. Aggiungere voce sidebar (automatica da `appRoutes`)
4. Definire schema DB in `DATABASE.md` + migrazione Dexie
5. Implementare `services/<nome>Service.ts`

---

## Documenti correlati

- [DATABASE.md](./DATABASE.md) — schema dati
- [STYLE_GUIDE.md](./STYLE_GUIDE.md) — UI e design
- [ROADMAP.md](./ROADMAP.md) — piano rilasci
- [docs/architecture.md](./docs/architecture.md) — versione sintetica

---

*Ultimo aggiornamento: giugno 2025*
