# MELI — Roadmap

Piano di sviluppo per l'applicazione di gestione apiari.

---

## Fase 0 — Fondamenta ✅

- [x] Progetto React + TypeScript + Vite
- [x] Design system (miele, crema, oro, marrone, salvia)
- [x] Layout professionale (MainLayout, Sidebar, Header)
- [x] Router e feature modules
- [x] Componenti UI riutilizzabili
- [x] Dashboard premium (mock data)
- [x] Struttura cartelle (`docs/`, `assets/`, `public/`, `src/`)

---

## Fase 1 — Core Apiario 🔄

**Obiettivo:** gestione operativa quotidiana sul campo (iPad).

| Modulo | Deliverable | Stato |
|--------|-------------|-------|
| Apiari | Lista, dettaglio, flusso visite sequenziale | 🔄 parziale |
| Arnie | Inventario, scheda premium, semaforo salute | ✅ |
| Visite | Modal guidato, foto, GPS, persistenza | ✅ |
| Dashboard | KPI live da IndexedDB | ✅ |
| Database | Dexie v5, seed, migrazioni | ✅ |

---

## Fase 2 — Produzione e Sanitaria

| Modulo | Deliverable |
|--------|-------------|
| Produzione | Smielatura, lotti, kg per stagione |
| Trattamenti | Scadenze varroa, storico trattamenti |
| Regine | Ciclo vitale, sostituzioni, marcatura |
| Report | KPI annuali, export PDF/CSV |

---

## Fase 3 — Magazzino e Operatività

| Modulo | Deliverable |
|--------|-------------|
| Magazzino | Attrezzatura, telai, melari, scorte |
| Promemoria | Notifiche trattamenti e visite |
| Note vocali | Registrazione e trascrizione campo |
| Scanner QR | Identificazione rapida arnia |

---

## Fase 4 — PWA e Sync

- [ ] Progressive Web App (offline-first)
- [ ] Service worker e cache asset
- [ ] Sincronizzazione cloud (opzionale)
- [ ] Backup / restore database locale
- [ ] Multi-utente e permessi

---

## Fase 5 — Premium e Integrazioni

- [ ] Meteo API real-time (Aspromonte)
- [ ] Integrazione bilancia / IoT (futuro)
- [ ] Brand RANU / Farm & Country Bistrot
- [ ] Localizzazione multi-lingua
- [ ] App Store / TestFlight distribution

---

## Priorità corrente

1. PWA base (offline-first)
2. CRUD apiari / modifica arnia e regina
3. Moduli Regine, Trattamenti, Produzione (oltre placeholder)
4. Capacitor iPad (camera, GPS nativi)

Vedi anche [docs/](./docs/) per moduli implementati.

---

*Ultimo aggiornamento: giugno 2025*
