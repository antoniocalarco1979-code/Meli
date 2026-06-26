# MELI — Product Specification

Documento di riferimento prodotto. Dettagli tecnici: [ARCHITETTURA.md](./ARCHITETTURA.md), [DATABASE.md](./DATABASE.md), [docs/](./docs/).

---

## Visione

MELI è una piattaforma professionale per la gestione di apiari, progettata per funzionare su:

* Android
* iPhone
* iPad
* Browser (PWA)

L'app deve funzionare anche **offline**.

L'esperienza utente deve essere ottimizzata per l'utilizzo in apiario, anche con **guanti** e sotto la **luce del sole**.

---

## Obiettivi

* Registrare una visita in **meno di 30 secondi**.
* Ridurre gli errori durante le visite.
* Conservare tutta la storia di ogni arnia.
* Offrire un'interfaccia moderna e semplice.

---

## Moduli

| Modulo | Descrizione |
|--------|-------------|
| **Dashboard** | Riepilogo giornaliero, KPI, avvio giornata in apiario |
| **Apiari** | Siti apistici, percorso visite sequenziale |
| **Arnie** | Inventario colonie, scheda salute/regina/produzione |
| **Visite** | Checklist guidata sul campo (modal fullscreen) |
| **Regine** | Anagrafica, ciclo vitale, sostituzioni |
| **Produzione** | Smielature, kg per stagione |
| **Trattamenti** | Storico sanitario, scadenze |
| **Magazzino** | Telai, melari, attrezzatura |
| **Report** | KPI annuali, export |
| **Impostazioni** | Preferenze app, backup, account |

---

## Entità principali

| Entità | Ruolo |
|--------|-------|
| **Apiario** | Sito fisico con più arnie (nome, località, GPS) |
| **Arnia** | Singola colonia (numero, stato, salute 0–100, QR) |
| **Visita** | Ispezione sul campo (checklist, meteo, note) |
| **Regina** | Anagrafica regina collegata all'arnia |
| **Foto** | Allegati da visite o schede (telaio, copertina) |
| **Produzione** | Raccolta miele (data, kg, tipo) |
| **Trattamento** | Intervento sanitario (prodotto, dose, scadenza) |
| **Utente** | Apicoltore / operatore (futuro multi-utente) |
| **Impostazioni** | Configurazione locale e preferenze sessione |

Relazioni: `Apiario` → N `Arnia` → N `Visita` | `Produzione` | `Trattamento`; `Visita` → N `Foto`; `Arnia` → 1 `Regina` attuale.

---

## Principi UX

* Massimo **3 tocchi** per ogni operazione frequente.
* **Pulsanti grandi** (target touch ≥ 50 px).
* **Modalità guanti** — controlli spaziati, contrasto alto, niente gesture complesse.
* Ottimizzazione **tablet e smartphone** (layout adattivo).
* **Design premium** — palette calda (miele, crema, oro), tipografia di sistema, animazioni sobrie.

Vedi [STYLE_GUIDE.md](./STYLE_GUIDE.md).

---

## Regole

* **Nessuna funzione dipende dalla connessione Internet** — tutte le operazioni core devono completarsi offline.
* **Tutti i dati vengono salvati localmente** — IndexedDB (Dexie) come fonte di verità.
* **La sincronizzazione cloud sarà opzionale** — export/import e sync non obbligatori in v1.

---

## Roadmap

### v0.1 Alpha

| Modulo | Scope |
|--------|-------|
| Dashboard | KPI live, azioni rapide, avvio giornata |
| Apiari | Lista, dettaglio, flusso visite sequenziale |
| Arnie | Lista touch-friendly, scheda premium |
| Visite | Modal guidato, foto, GPS, persistenza locale |

**Stato attuale:** in sviluppo avanzato (database v5, device layer Capacitor-ready, build produzione OK).

---

### v0.5 Beta

| Modulo | Scope |
|--------|-------|
| Produzione | Registro smielature, totali stagione |
| Trattamenti | Scadenze, storico, collegamento visite |
| Regine | Sostituzione, alert, marcatura |
| Report | Riepiloghi e export base |

---

### v1.0

| Feature | Scope |
|---------|-------|
| Backup Cloud | Sync opzionale, restore |
| QR Code | Scanner nativo identificazione arnia |
| Notifiche | Promemoria trattamenti e visite |
| Play Store | Distribuzione Android |
| App Store | Distribuzione iOS / iPadOS |

---

## Riferimenti

| Documento | Contenuto |
|-----------|-----------|
| [ROADMAP.md](./ROADMAP.md) | Piano fasi di sviluppo |
| [TODO.md](./TODO.md) | Backlog operativo |
| [CHANGELOG.md](./CHANGELOG.md) | Storico versioni |
| [docs/modules/](./docs/modules/) | Specifiche moduli implementati |

---

*Ultimo aggiornamento: giugno 2025*
