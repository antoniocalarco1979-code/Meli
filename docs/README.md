# MELI — Documentazione

Applicazione professionale per la **gestione apiari** (Aspromonte / Calabria). Ottimizzata **iPad**, offline-first con IndexedDB.

---

## Indice

### Struttura e architettura

| Documento | Contenuto |
|-----------|-----------|
| [Struttura progetto](./structure.md) | Cartelle `docs`, `src`, `public`, `assets` |
| [Architettura](./architecture.md) | Layer, routing, database v5, estensione |
| [Design system](./design-system.md) | Colori, tipografia, componenti UI |
| [Device services](./device-services.md) | Camera, GPS, notifiche — Capacitor-ready |

### Moduli implementati

| Modulo | Contenuto |
|--------|-----------|
| [Apiari](./modules/apiari.md) | Dettaglio sito, percorso visite sequenziale |
| [Arnie](./modules/arnie.md) | Lista, scheda premium, semaforo salute |
| [Visite](./modules/visite.md) | Modal guidato, checklist, salvataggio |

---

## Documentazione root

| File | Contenuto |
|------|-----------|
| [ROADMAP.md](../ROADMAP.md) | Piano rilasci e fasi |
| [TODO.md](../TODO.md) | Backlog operativo |
| [CHANGELOG.md](../CHANGELOG.md) | Storico versioni |
| [DATABASE.md](../DATABASE.md) | Schema IndexedDB (Dexie) |
| [ARCHITETTURA.md](../ARCHITETTURA.md) | Architettura completa |
| [MELI_PRODUCT_SPEC.md](../MELI_PRODUCT_SPEC.md) | Specifica prodotto (visione, moduli, journey) |
| [STYLE_GUIDE.md](../STYLE_GUIDE.md) | Guida visiva e UX |

---

## Avvio rapido

```bash
npm install
npm run dev
npm run build
```

## Stack

- React 19 + TypeScript
- Vite 8
- React Router 7
- Framer Motion
- Dexie 4 (IndexedDB v5)
- Lucide React

---

## Sprint recenti (riferimento)

| Sprint | Deliverable |
|--------|-------------|
| 4 | Database Dexie v5, seed Acquacalda, repositories |
| 5 | Modulo Arnie, `NuovaVisitaModal`, timeline |
| 6 | Scheda premium (Health, Queen, Production, Timeline, Gallery) |
| 7 | `ArniaCard` touch, device services, flusso apiario sequenziale |
