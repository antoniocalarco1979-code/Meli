# Changelog

Tutte le modifiche rilevanti al progetto MELI sono documentate in questo file.

Formato basato su [Keep a Changelog](https://keepachangelog.com/it/1.1.0/).

---

## [Unreleased]

### Pianificato

- PWA offline (`vite-plugin-pwa`)
- CRUD completo apiari / modifica arnia
- Modulo Regine, Trattamenti, Produzione (UI oltre placeholder)
- Capacitor (camera/GPS nativi)

### Aggiunto

- Database Dexie v5: apiari, arnie, regine, visite, foto, produzione, trattamenti
- Modulo Arnie: lista `ArniaCard`, scheda premium (9 sezioni)
- `NuovaVisitaModal` fullscreen con checklist guidata
- `ApiarioVisiteFlow` — percorso visite sequenziale in apiario
- Device services (`src/services/device/`) — Capacitor-ready
- Dashboard KPI live da IndexedDB (`useDashboardLiveStats`)
- Seed demo Apiario Acquacalda (12 arnie)

---

## [0.4.0] — 2025-06-25

### Aggiunto

- Architettura scalabile: `features/`, `router/`, `theme/`, `components/ui/`
- MainLayout con Header e Sidebar
- 9 route: Dashboard + 8 moduli (placeholder)
- Componenti UI: Button, Card, Section, Input, Textarea, Badge, Modal, FAB, PageTitle, EmptyState, Loading
- Layer `services/`, `database/`, `hooks/`, `types/`
- Cartelle `docs/`, `assets/`, documentazione root
- Alias Vite `@` e `@assets`

### Modificato

- Dashboard spostata in `features/dashboard/pages/`
- Tema centralizzato in `src/theme/`

### Rimosso

- Template Vite iniziale
- `src/assets/` (spostato in `assets/brand/`)

---

## [0.3.0] — 2025-06-25

### Aggiunto

- Dashboard Sprint 3: glassmorphism avanzato, timeline attività, KPI con sparkline
- Pulsante **INIZIA GIORNATA** centrale
- Meteo card con cielo animato
- Watermark RANU elegante

### Modificato

- Raffinate ombre, hover Framer Motion, tipografia iPadOS
- Sidebar e icone ingrandite

---

## [0.2.0] — 2025-06-25

### Aggiunto

- Dashboard Sprint 2: selettore apiario, 5 KPI, mappa arnie colorata
- Attività di oggi e azioni rapide
- Dati mock `Apiario Acquacalda`

---

## [0.1.0] — 2025-06-25

### Aggiunto

- Prima dashboard MELI (miele, crema, oro)
- Sidebar, card Apiari / Arnie / Visite / Produzione
- Progetto Vite + React + TypeScript

---

[Unreleased]: #
[0.4.0]: #
[0.3.0]: #
[0.2.0]: #
[0.1.0]: #
