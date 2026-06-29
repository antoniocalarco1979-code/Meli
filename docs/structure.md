# Struttura progetto

```
src/
├── app/                     Shell applicazione (App, router)
├── database/                Dexie v5, repositories, services
├── features/
│   ├── dashboard/           pages, components, hooks, services
│   ├── apiari/
│   ├── arnie/
│   ├── visite/
│   ├── regine/
│   ├── produzione/
│   ├── trattamenti/
│   └── report/
├── components/              ui/, layout/, common/
├── services/                device/ (camera, GPS, platform, …)
├── hooks/                   useLiveQuery
├── utils/                   dateFormatters, salute/
├── types/                   route, entità condivise
└── theme/                   token CSS, stili globali
```

## Layer e responsabilità

| Layer | Contenuto | Regola |
|-------|-----------|--------|
| `app/` | Routing, bootstrap React | Nessuna logica di dominio |
| `database/` | Persistenza IndexedDB | Features usano `database/services`, non repositories diretti |
| `features/*/services` | Orchestrazione dominio per modulo | Un modulo = un bounded context |
| `utils/` | Logica condivisa (date, salute) | Nessun import da `features/` |
| `services/device/` | Web API + stub Capacitor | Unico punto per camera, GPS, platform |
| `components/` | UI riutilizzabile | Nessun accesso al database |

Documentazione prodotto: cartella `docs/` alla root.

---

*Ultimo aggiornamento: giugno 2026*
