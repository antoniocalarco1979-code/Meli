# Struttura progetto

```
MELI/
├── docs/           Documentazione tecnica e di prodotto
├── assets/         Asset sorgente (brand, immagini) — non compilati direttamente
│   ├── brand/      Logo MELI, RANU, icone brand
│   └── images/     Fotografie, illustrazioni, texture
├── public/         File statici serviti da Vite (favicon, PWA, fallback runtime)
└── src/            Codice applicazione
    ├── components/ ui, layout, common
    ├── features/   Moduli per dominio (dashboard, apiari, arnie…)
    ├── router/     Configurazione rotte
    ├── theme/      Design tokens e stili globali
    ├── services/   Business logic e API
    ├── database/   IndexedDB (Dexie)
    ├── hooks/      React hooks condivisi
    └── types/      Tipi TypeScript globali
```

## Convenzioni

- **`assets/`** — file master per design e brand; copiare in `public/` quando servono a runtime senza bundling.
- **`public/`** — percorsi assoluti (`/favicon.svg`, `/ranu-logo.svg`).
- **`src/`** — solo codice e stili; nessun asset duplicato se evitabile.
