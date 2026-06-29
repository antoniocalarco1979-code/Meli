# MELI — Documentazione

Documentazione prodotto e tecnica del progetto MELI (gestione apiari professionale, offline-first, iPad-first).

---

## Documenti prodotto

| Documento | Contenuto | Audience |
|-----------|-----------|----------|
| [MELI_PRODUCT_SPEC.md](./MELI_PRODUCT_SPEC.md) | Visione, moduli, architettura, entità, indice salute | Product, engineering |
| [USER_FLOW.md](./USER_FLOW.md) | Flussi operativi sul campo (giro, visita, dashboard) | Product, design, frontend |
| [UI_GUIDELINES.md](./UI_GUIDELINES.md) | Design system, token, componenti, pattern schermata | Design, frontend |
| [DATABASE.md](./DATABASE.md) | Schema IndexedDB v5, migrazioni, query pattern | Backend, frontend |
| [ROADMAP.md](./ROADMAP.md) | Fasi di sviluppo e priorità sprint | Product, engineering |
| [MVP_CHECKLIST.md](./MVP_CHECKLIST.md) | Stato MVP: completato / parziale / mancante, bug, priorità v0.1 | CTO, product, engineering |
| [TECH_DEBT.md](./TECH_DEBT.md) | Registro debito tecnico prioritizzato | Engineering |
| [NEXT_SPRINT.md](./NEXT_SPRINT.md) | Piano dettagliato prossimi 10 sprint | Product, engineering |
| [BUSINESS_MODEL.md](./BUSINESS_MODEL.md) | Segmenti, revenue, metriche, partnership RANU | Founder, product |
| [RELEASES.md](./RELEASES.md) | Storico versioni e checklist release | Engineering, ops |
| [FUTURE_IDEAS.md](./FUTURE_IDEAS.md) | Backlog idee non ancora in roadmap | Product |

### Decisioni (ADR)

| Cartella | Contenuto |
|----------|-----------|
| [decisions/](./decisions/) | Architecture / product decision records (protocollo visita, telai, UI) |

---

## Documenti tecnici supplementari

| Documento | Contenuto |
|-----------|-----------|
| [../CHANGELOG.md](../CHANGELOG.md) | Changelog tecnico dettagliato |
| [architecture.md](./architecture.md) | Sintesi architettura |
| [device-services.md](./device-services.md) | Camera, GPS, notifiche |
| [structure.md](./structure.md) | Struttura cartelle progetto |
| [design-system.md](./design-system.md) | Riferimento rapido token |
| [modules/](./modules/) | Documentazione per modulo (apiari, arnie, visite) |

---

## Quick start

```bash
npm install
npm run dev      # sviluppo locale
npm run build    # build produzione
```

**Stack:** React 19 · TypeScript · Vite 8 · Dexie 4 · Framer Motion · React Router 7

---

*Ultimo aggiornamento: giugno 2026*
