# Architettura

## Layer

```
UI (components/ui)
    ↓
Layout (MainLayout, Header, Sidebar)
    ↓
Features (dashboard, apiari, arnie, visite, regine, trattamenti, produzione, magazzino, report)
    ↓
Services / Database / Hooks
```

## Routing

React Router con `MainLayout` come shell e lazy loading per le feature secondarie.

| Route | Feature |
|-------|---------|
| `/` | Dashboard |
| `/apiari` | Apiari |
| `/arnie` | Arnie |
| `/visite` | Visite |
| `/regine` | Regine |
| `/trattamenti` | Trattamenti |
| `/produzione` | Produzione |
| `/magazzino` | Magazzino |
| `/report` | Report |

## Feature module

Ogni feature in `src/features/<nome>/`:

```
pages/       Pagine route
components/  UI specifica del dominio
data/        Mock e adapter (fase iniziale)
types.ts     Tipi del dominio
index.ts     Export pubblico
```

## Scalabilità

- Nuove feature: cartella in `features/`, rotta in `router/config.ts` e `AppRouter.tsx`.
- Componenti condivisi: `components/ui` o `components/common`.
- Persistenza: estendere schema in `database/index.ts`.
