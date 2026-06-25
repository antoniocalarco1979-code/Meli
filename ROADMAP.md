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

## Fase 1 — Core Apiario

**Obiettivo:** gestione operativa quotidiana sul campo (iPad).

| Modulo | Deliverable |
|--------|-------------|
| Apiari | CRUD siti, geolocalizzazione, mappa |
| Arnie | Inventario colonie, stato, QR code |
| Visite | Checklist ispezione, note, foto |
| Dashboard | Dati reali da IndexedDB |

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

1. Schema database Dexie (vedi `DATABASE.md`)
2. Modulo **Apiari** (primo CRUD reale)
3. Collegamento Dashboard → dati persistenti
4. PWA base

---

*Ultimo aggiornamento: giugno 2025*
