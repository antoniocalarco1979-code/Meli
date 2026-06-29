# MELI — Future Ideas

**Status:** backlog esplorativo — **non** in roadmap attiva  
**Piano ufficiale:** [ROADMAP.md](./ROADMAP.md)  
**Processo:** ogni idea va valutata in sprint planning prima di entrare in TODO  
**Ultimo aggiornamento:** giugno 2026

---

## Come usare questo documento

Le idee qui sotto nascono da osservazione sul campo, feedback apicoltori pilota e analisi competitor. Sono ordinate per area, non per priorità.

**Prima di implementare:**
1. Verificare che non duplichi scope già in ROADMAP Fase 2–4.
2. Stimare impatto schema DB (serve v6+?).
3. Validare con ≥ 1 apicoltore pilota.
4. Spostare in [ROADMAP.md](./ROADMAP.md) solo se approvata.

---

## 1. UX campo

### Modalità sole / alto contrasto

**Problema:** sotto luce diretta calabrese, glassmorphism e crema riducono leggibilità.  
**Idea:** toggle "Modalità campo" — sfondo bianco pieno, testo nero-marrone, bordi spessi, zero blur.  
**Dipendenze:** token CSS alternativi in `tokens.css`, preferenza in store impostazioni.  
**Effort:** S

### Haptic feedback (Capacitor)

**Problema:** con guanti, feedback visivo solo può non bastare.  
**Idea:** vibrazione leggera su salvataggio visita, errore, completamento giro.  
**Dipendenze:** Capacitor Haptics, integrazione nativa.  
**Effort:** S (post-Capacitor)

### Widget iPad / iOS

**Problema:** apicoltore vuole vedere "3 arnie da visitare" senza aprire app.  
**Idea:** widget home screen con contatore arnie warning + shortcut "Inizia Giornata".  
**Dipendenze:** Capacitor widget extension, background refresh.  
**Effort:** L

### Percorso GPS tra arnie

**Problema:** apiari grandi con arnie distanti — difficile ottimizzare passeggiata.  
**Idea:** mappa con path suggerito tra arnie geolocalizzate (`lat/lng` su Arnia — campo rimosso in v5, da reintrodurre).  
**Dipendenze:** schema v6 campo posizione arnia, map library.  
**Effort:** L

---

## 2. Intelligenza operativa

### Predizione sciamatura

**Problema:** sciamatura non prevista = perdita colonia.  
**Idea:** score rischio basato su: spazio covata, stagione, forza colonia, storico anno precedente.  
**Dipendenze:** dati visita strutturati, possibile ML rule-based iniziale.  
**Effort:** L

### Alert regina automatici

**Problema:** regina non vista in 2 visite consecutive.  
**Idea:** notifica push + badge arnia "Regina da verificare".  
**Dipendenze:** modulo Regine Fase 2, notificationService.  
**Effort:** M (overlap ROADMAP)

### OCR etichette regina

**Problema:** marcatura regina colorata difficile da tracciare manualmente.  
**Idea:** foto regina → OCR colore/anno → pre-compila `Regina.colore`.  
**Dipendenze:** ML on-device o API cloud (conflitto offline-first).  
**Effort:** XL

---

## 3. Hardware e IoT

### Bilancia Bluetooth

**Problema:** pesatura telai manuale e lenta.  
**Idea:** import peso da bilancia BLE compatibile → stima produzione per arnia.  
**Dipendenze:** Capacitor BLE plugin, nuova entità `pesata`.  
**Effort:** XL

### Sensori alveare (umidità, temperatura)

**Problema:** ispezione invasiva frequente stressa colonia.  
**Idea:** dashboard arnia con grafico sensori + alert soglia.  
**Dipendenze:** hardware partner, backend MQTT, conflitto offline.  
**Effort:** XL

---

## 4. Export e reporting

### PDF giro apiario

**Problema:** export `.txt` attuale non è presentabile a cooperative.  
**Idea:** PDF branded MELI/RANU con logo, stats, firma digitale opzionale.  
**Dipendenze:** libreria PDF client-side (jsPDF) o server render.  
**Effort:** M

### Export CSV strutturato

**Problema:** apicoltore vuole Excel per commercialista / DOP.  
**Idea:** export CSV visite, produzione, trattamenti per apiario/stagione.  
**Dipendenze:** overlap ROADMAP Fase 2 Report.  
**Effort:** M

### Report annuale automatico

**Idea:** generazione a fine stagione: kg totali, indice salute medio, trattamenti eseguiti, confronto anno precedente.  
**Dipendenze:** dati storici multi-anno, modulo Report.  
**Effort:** L

---

## 5. Voce e media

### Nota vocale in visita

**Problema:** scrivere note con guanti è impossibile.  
**Idea:** registrazione audio 30s allegata a visita, trascrizione opzionale offline.  
**Dipendenze:** Capacitor Voice Recorder, storage audio, possibile Whisper on-device.  
**Effort:** L

### Gallery foto con annotazioni

**Idea:** disegnare su foto telaio (cerchio covata, freccia cells) prima del salvataggio.  
**Dipendenze:** canvas overlay in step foto visita.  
**Effort:** M

---

## 6. Multi-utente e B2B

### Tenant cooperativa

**Idea:** admin cooperativa vede tutti gli apiari dei soci, report aggregato, permessi ruolo (admin, apicoltore, viewer).  
**Dipendenze:** auth, backend sync, ROADMAP Fase 4.  
**Effort:** XL

### Tracciabilità lotto miele DOP

**Idea:** collegare `Produzione` → lotto commerciale → QR etichetta jar per consumer scan.  
**Dipendenze:** entità `Lotto`, integrazione RANU/DOP, backend.  
**Effort:** XL

### White-label RANU

**Idea:** cooperative vende "App Apiario RANU powered by MELI" con colori/logo custom.  
**Dipendenze:** tier Team BUSINESS_MODEL, theme override.  
**Effort:** L

---

## 7. Tecnologia

### Tema scuro

**Idea:** dark mode per uso serale in casa (non in apiario).  
**Dipendenze:** token CSS dark, preferenza utente.  
**Effort:** M (in TODO bassa priorità)

### Test E2E Playwright

**Idea:** test automatico flusso giro completo + salvataggio visita su CI.  
**Dipendenze:** setup Playwright, IndexedDB mock.  
**Effort:** M

### CI/CD pipeline

**Idea:** GitHub Actions — lint, build, deploy preview su PR.  
**Dipendenze:** hosting configurato.  
**Effort:** S

### i18n IT/EN

**Idea:** mercato apicoltori EU oltre Calabria.  
**Dipendenze:** react-i18next, traduzione copy UI.  
**Effort:** L

---

## 8. Matrice priorità esplorativa

| Idea | Valore utente | Effort | Offline OK | Raccomandazione |
|------|:-------------:|:------:|:----------:|-----------------|
| Modalità sole | Alto | S | ✅ | **Promuovere a TODO** post-PWA |
| PDF giro | Alto | M | ✅ | Promuovere Fase 2 Report |
| Nota vocale | Alto | L | ✅ | Pilota dopo Capacitor |
| CSV export | Medio | M | ✅ | Promuovere Fase 2 |
| GPS path arnie | Medio | L | ✅ | Richiede schema v6 |
| Predizione sciamatura | Alto | L | ✅ | Ricerca + pilota |
| IoT sensori | Medio | XL | ❌ | Dopo v1.0 |
| OCR regina | Basso | XL | ❌ | Backlog lungo |
| Multi-tenant | Alto B2B | XL | ❌ | Fase 4+ |
| Tema scuro | Basso | M | ✅ | Nice-to-have |

---

## 9. Idee scartate (per memoria)

| Idea | Motivo scarto |
|------|---------------|
| Social feed apicoltori | Fuori scope B2B operativo |
| Marketplace miele in-app | Non core competency |
| Blockchain tracciabilità | Over-engineering vs QR + DB |
| Tailwind CSS | Decisione architetturale: token CSS custom |

---

*Quando un'idea entra in roadmap, rimuoverla da qui o marcarla "→ ROADMAP Fase N" per evitare duplicazione.*
