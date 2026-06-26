# Struttura progetto

```
MELI/
├── docs/              Documentazione tecnica e moduli
│   ├── modules/       Apiari, Arnie, Visite
│   ├── architecture.md
│   ├── device-services.md
│   ├── design-system.md
│   └── structure.md
├── assets/            Asset sorgente (brand, immagini)
│   ├── brand/         Logo MELI, RANU
│   └── images/
├── public/            Statici Vite (favicon, logo runtime)
└── src/
    ├── components/    ui/, layout/, common/
    ├── features/      Moduli dominio
    │   ├── dashboard/
    │   ├── apiari/
    │   ├── arnie/
    │   └── visite/
    ├── router/
    ├── theme/
    ├── services/
    │   └── device/    camera, GPS, notifications, storage
    ├── platform/      Re-export deprecati (compatibilità)
    ├── database/      Dexie v5, repositories, services
    ├── hooks/
    └── types/
```

Documentazione root (collegata da `docs/README.md`):

```
ROADMAP.md  TODO.md  CHANGELOG.md
DATABASE.md  ARCHITETTURA.md  STYLE_GUIDE.md
```

---

## Convenzioni

- **`assets/`** — master design; copiare in `public/` per URL runtime (`/ranu-logo.svg`).
- **`public/`** — percorsi assoluti, non passano dal bundler.
- **`src/services/device/`** — unico punto per API device (web o Capacitor).
- **`src/features/*/services/`** — logica di dominio legata alla feature, usa il database layer.
- **`src/database/`** — schema, migrazioni, repository; nessuna UI.

---

## Alias Vite

| Alias | Percorso |
|-------|----------|
| `@` | `src/` |
| `@assets` | `assets/` |
