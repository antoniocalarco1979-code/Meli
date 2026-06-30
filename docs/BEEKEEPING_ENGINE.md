# MELI — Beekeeping Engine

**Documento:** motore decisionale di MELI  
**Versione catalogo:** 1.0  
**Stato:** viva — registro regole apistiche  
**Audience:** product, apicoltori referenti, engineering

---

## 1. Scopo

Il **Beekeeping Engine** è il catalogo ufficiale delle **regole operative e decisionali** che guidano MELI.

Non descrive implementazione software: definisce **cosa** MELI deve consigliare, **quando** e **con quale urgenza**, in coerenza con la pratica apistica sul campo.

Il motore alimenta, o alimenterà in futuro:

| Layer MELI | Ruolo |
|------------|-------|
| **Wizard visita / giro apiario** | Sequenza operativa e checklist sul campo |
| **MELI Intelligence** | Suggerimenti prioritizzati in dashboard e scheda arnia |
| **Assistente MELI** | Risposte contestuali e coaching |
| **Report e KPI** | Alert derivati da regole aggregate |

**Principio guida:** *Prima si lavora. Poi si registra. MAI il contrario.*  
Le regole del Beekeeping Engine rispettano il **rituale fisico** dell’apicultore, non lo invertono.

---

## 2. Architettura concettuale

```
┌─────────────────────────────────────────────────────────────┐
│                    BEEKEEPING ENGINE                        │
│              (catalogo regole — questo documento)           │
└──────────────────────────┬──────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
   Visit Engine     MELI Intelligence   Assistente MELI
   (sequenza)        (suggerimenti)      (dialogo)
         │                 │                 │
         └─────────────────┴─────────────────┘
                           │
                    Contesto arnia
              (visite, telai, melario, …)
```

Ogni regola è **indipendente**, **versionabile** e **referenziabile** tramite codice stabile (`BE-XXX`).

---

## 3. Schema di una regola

Ogni voce del catalogo deve rispettare i campi obbligatori seguenti.

| Campo | Descrizione |
|-------|-------------|
| **Codice** | Identificativo univoco e immutabile (`BE-001` … `BE-999`) |
| **Titolo** | Nome breve, comprensibile sul campo |
| **Descrizione** | Spiegazione operativa e razionale apistico |
| **Condizione** | Quando la regola si applica (contesto, dati, fase del giro) |
| **Azione suggerita** | Cosa fare concretamente; testo mostrato all’utente |
| **Priorità** | Urgenza del suggerimento (vedi § 5) |

### Metadati consigliati (per regole future)

| Metadato | Uso |
|----------|-----|
| **Categoria** | Raggruppamento funzionale (§ 4) |
| **Fase** | `pre-ispezione` · `ispezione` · `post-ispezione` · `pianificazione` |
| **Scope** | `arnia` · `apiario` · `telaino` · `melario` · `vassoio` |
| **Stato regola** | `bozza` · `validata` · `deprecata` |
| **Versione** | Revisione semantica del testo (`1.0`, `1.1`, …) |
| **Dipendenze** | Altri codici `BE-XXX` collegati |
| **Riferimenti** | ADR, normative, letteratura |

---

## 4. Tassonomia categorie

Per scalare a **centinaia di regole**, ogni codice appartiene a una categoria.  
Range riservati (espandibili oltre 999 con suffisso dominio, es. `BE-MEL-012`).

| Prefisso range | Categoria | Contenuto tipico |
|----------------|-----------|------------------|
| `BE-001` – `BE-099` | **PRE** — Pre-ispezione | DPI, affumicatore, vassoio, attrezzatura, meteo |
| `BE-100` – `BE-199` | **SEQ** — Sequenza ispezione | Ordine telai, melario vs nido, estrazione |
| `BE-200` – `BE-299` | **TEL** — Telaino | Ispezione singola, stelle, tipi, cronologia |
| `BE-300` – `BE-399` | **MEL** — Melario / produzione | Riempimento, opercolatura, smielatura, aggiunta melario |
| `BE-400` – `BE-499` | **NID** — Nido / covata | Forza, scorte, spazio, opercolazione |
| `BE-500` – `BE-599` | **REG** — Regina | Presenza, marcatura, sostituzione, fecondazione |
| `BE-600` – `BE-699` | **SAN** — Sanitaria | Varroa, trattamenti, vassoio diagnostico |
| `BE-700` – `BE-799` | **NUT** — Nutrizione | Sciroppo, pasta, integratori |
| `BE-800` – `BE-899` | **PIA** — Pianificazione | Calendario visite, stagionalità, meteo |
| `BE-900` – `BE-999` | **SYS** — Sistema / meta | Regole su come applicare altre regole, fallback |

> **Nota:** Le prime cinque regole (`BE-001` – `BE-005`) sono state introdotte nella fondazione del catalogo e occupano il range PRE / SEQ / TEL / MEL per priorità operativa immediata.

---

## 5. Scala priorità

| Priorità | Significato | Comportamento atteso in UI |
|----------|-------------|----------------------------|
| **Critica** | Rischio immediato per colonia, operatore o conformità | Blocco soft o alert persistente; in cima a ogni lista |
| **Alta** | Deviazione forte dalla pratica corretta o dal protocollo MELI | Suggerimento evidente; evidenziato nel giro |
| **Media** | Miglioramento consigliato; non blocca il flusso | Card o hint secondario |
| **Bassa** | Promemoria, best practice opzionale | Nota collassabile o suggerimento in background |
| **Pianificazione** | Azione da programmare nel tempo | Integrazione calendario / agenda |

---

## 6. Ciclo di vita di una regola

1. **Proposta** — Bozza redatta da apicoltore referente o product.
2. **Validazione** — Revisione tecnica e coerenza con ADR / flussi visita.
3. **Pubblicata** — Inserita in questo documento con stato `validata`.
4. **Implementata** — (fase engineering) mappata su motore runtime; tracciata in changelog codice.
5. **Deprecata** — Sostituita da nuovo codice; mantenuta per storico visite.

Ogni modifica al testo di una regola **pubblicata** incrementa la **Versione** metadato senza cambiare il **Codice**.

---

## 7. Registro regole — Fondazione (v1.0)

### 7.1 PRE — Pre-ispezione

---

#### BE-001

| Campo | Valore |
|-------|--------|
| **Codice** | `BE-001` |
| **Titolo** | Controllo vassoio prima dell'apertura dell'arnia |
| **Descrizione** | Prima di sollevare il tetto o aprire il corpo dell'arnia, l'apicultore deve ispezionare il vassoio di fondo (se presente). Il vassoio è la prima fonte di informazioni passive: caduti, resti di opercolatura, tracce di varroa, segni di morbo o predazione. Ignorarlo compromette la sicurezza della valutazione e spesso anticipa problemi visibili solo dopo aver già disturbato la colonia. |
| **Condizione** | L'apicultore avvia un'ispezione su un'arnia equipaggiata con vassoio di fondo (standard o diagnostico), fase **pre-ispezione**, prima di qualsiasi apertura del corpo o del melario. |
| **Azione suggerita** | Controllare il vassoio: osservare api morte, resti di puppe, varroa cadute, macchie o anomalie. Registrare l'esito prima di procedere all'apertura. |
| **Priorità** | **Alta** |

**Metadati:** Categoria `PRE` · Fase `pre-ispezione` · Scope `vassoio` · Stato `validata` · Versione `1.0`

---

#### BE-003

| Campo | Valore |
|-------|--------|
| **Codice** | `BE-003` |
| **Titolo** | Affumicatore prima del melario e del nido |
| **Descrizione** | L'affumicazione calma le api e riduce la difesa durante l'ispezione. Va applicata con metodo uniforme **prima** di ispezionare il melario e **prima** di accedere al nido, non solo una volta all'inizio generico del giro se l'intervallo tra le due fasi è lungo o la colonia si è già agitata. |
| **Condizione** | Fase **ispezione** con melario presente e/o accesso al corpo nido; operatore posizionato per estrarre telai o aprire melario. |
| **Azione suggerita** | Utilizzare l'affumicatore con passate leggere e costanti immediatamente prima di ispezionare il melario; ripetere prima di ispezionare il nido se necessario. |
| **Priorità** | **Alta** |

**Metadati:** Categoria `PRE` · Fase `pre-ispezione` / `ispezione` · Scope `arnia` · Stato `validata` · Versione `1.0` · Dipendenze `BE-002`

---

### 7.2 SEQ — Sequenza ispezione

---

#### BE-002

| Campo | Valore |
|-------|--------|
| **Codice** | `BE-002` |
| **Titolo** | Ispezionare il melario prima del nido |
| **Descrizione** | Quando è montato almeno un melario, la sua ispezione deve precedere quella del nido. Permette di valutare produzione, opercolatura e necessità di smielatura o aggiunta telai senza disturbare prima l'area di covata. Riduce il tempo con il nido aperto e allinea il flusso al lavoro reale sul campo. |
| **Condizione** | Arnia con **melario presente** (uno o più telai sopra il corpo o in configurazione equivalente); fase **ispezione** dopo il controllo vassoio (`BE-001`) e l'affumicazione iniziale. |
| **Azione suggerita** | Completare l'ispezione del melario (stato telai, riempimento, opercolatura) prima di estrarre o ispezionare i telai del nido. |
| **Priorità** | **Alta** |

**Metadati:** Categoria `SEQ` · Fase `ispezione` · Scope `melario`, `nido` · Stato `validata` · Versione `1.0` · Dipendenze `BE-001`, `BE-003`

---

### 7.3 TEL — Telaino

---

#### BE-005

| Campo | Valore |
|-------|--------|
| **Codice** | `BE-005` |
| **Titolo** | Ispezione singola per ogni telaino |
| **Descrizione** | In ispezione professionale ogni telaio (melario o nido) deve poter essere valutato **individualmente**: estrazione, osservazione, annotazione, eventuale foto, poi reintegro. Non è sufficiente una valutazione globale dell'arnia se non si discrimina telaio per telaio. Questo principio guida tracciabilità, cronologia e decisioni successive (regina, covata, produzione). |
| **Condizione** | Qualsiasi ispezione che prevede l'apertura del corpo o del melario con telai estraibili; contesto **telaino** attivo nel flusso visita. |
| **Azione suggerita** | Selezionare un telaino alla volta; registrarne tipo (covata, miele, polline, regina vista), valutazione e note; passare al telaino successivo solo dopo aver chiuso quello corrente. |
| **Priorità** | **Alta** |

**Metadati:** Categoria `TEL` · Fase `ispezione` · Scope `telaino` · Stato `validata` · Versione `1.0` · Riferimenti [ADR 002 — Ispezione per telaio](./decisions/002-telai-inspection.md)

---

### 7.4 MEL — Melario / produzione

---

#### BE-004

| Campo | Valore |
|-------|--------|
| **Codice** | `BE-004` |
| **Titolo** | Aggiungere melario oltre l'80% di riempimento |
| **Descrizione** | Un melario molto pieno segnala produzione attiva e rischio di ingorgo o sciamatura se non si offre spazio adeguato. La soglia indicativa **~80%** di celle opercolate o occupazione visiva del telaio melario è un trigger per pianificare l'aggiunta di un nuovo melario o la smielatura, in base alla stagione e alla forza della colonia. |
| **Condizione** | Durante ispezione melario: almeno un telaio melario con **occupazione ≥ ~80%** (stima visiva o da valutazione telai registrata). |
| **Azione suggerita** | Consigliare l'aggiunta di un nuovo melario (o la smielatura se opercolatura e stagione lo consentono); registrare l'azione pianificata o eseguita. |
| **Priorità** | **Media** |

**Metadati:** Categoria `MEL` · Fase `ispezione` / `pianificazione` · Scope `melario` · Stato `validata` · Versione `1.0` · Dipendenze `BE-002`

---

## 8. Indice master (v1.0)

Tabella di riferimento rapido — da estendere con una riga per ogni nuova regola.

| Codice | Titolo | Categoria | Priorità | Stato |
|--------|--------|-----------|----------|-------|
| BE-001 | Controllo vassoio prima dell'apertura dell'arnia | PRE | Alta | validata |
| BE-002 | Ispezionare il melario prima del nido | SEQ | Alta | validata |
| BE-003 | Affumicatore prima del melario e del nido | PRE | Alta | validata |
| BE-004 | Aggiungere melario oltre l'80% di riempimento | MEL | Media | validata |
| BE-005 | Ispezione singola per ogni telaino | TEL | Alta | validata |

**Prossimo codice disponibile:** `BE-006`

---

## 9. Sequenza operativa di riferimento (fondazione)

Ordine consigliato quando tutte le regole fondative si applicano allo stesso giro:

```
1. BE-001  Controllo vassoio
2. BE-003  Affumicatore (pre-melario)
3. BE-002  Ispezione melario
4. BE-004  Valutazione riempimento melario (se applicabile)
5. BE-003  Affumicatore (pre-nido)
6. BE-005  Ispezione telaino per telaino (nido)
```

Questa sequenza non sostituisce il wizard visita: ne definisce la **spina dorsale decisionale**.

---

## 10. Estensione del catalogo

### 10.1 Aggiungere una nuova regola

1. Assegnare il prossimo **Codice** libero nel range di categoria appropriato (§ 4).
2. Compilare tutti i campi obbligatori (§ 3) con testo operativo, non generico.
3. Aggiornare l'**Indice master** (§ 8).
4. Inserire la regola nella sezione di categoria corrispondente (§ 7.x o nuova sottosezione).
5. Documentare **Dipendenze** e **Sequenza** se interagisce con regole esistenti.
6. Segnare stato `bozza` fino a validazione apicoltore referente.

### 10.2 Template copia-incolla

```markdown
#### BE-XXX

| Campo | Valore |
|-------|--------|
| **Codice** | `BE-XXX` |
| **Titolo** | |
| **Descrizione** | |
| **Condizione** | |
| **Azione suggerita** | |
| **Priorità** | **Critica** / **Alta** / **Media** / **Bassa** / **Pianificazione** |

**Metadati:** Categoria `` · Fase `` · Scope `` · Stato `bozza` · Versione `1.0`
```

### 10.3 Capacità prevista

| Obiettivo | Target |
|-----------|--------|
| Regole catalogate | 100+ (v2), 300+ (v3) |
| Regole attive in runtime | Sottoinsieme implementato per release |
| Regole per categoria | Nessun limite rigido entro il range riservato |

Quando una categoria supera il range numerico, introdurre sottodominio documentale (es. `BE-MEL-100`) mantenendo retrocompatibilità dell'indice.

---

## 11. Relazioni con altri documenti

| Documento | Relazione |
|-----------|-----------|
| [MELI_PRODUCT_BIBLE.md](./MELI_PRODUCT_BIBLE.md) | Filosofia prodotto e priorità UX |
| [USER_FLOW.md](./USER_FLOW.md) | Flussi giro apiario e visita |
| [decisions/001-visit-engine-field-protocol.md](./decisions/001-visit-engine-field-protocol.md) | Protocollo fisico pre-ispezione |
| [decisions/002-telai-inspection.md](./decisions/002-telai-inspection.md) | Implementazione `BE-005` a livello telaino |
| [decisions/004-azione-step.md](./decisions/004-azione-step.md) | Azioni post-ispezione (es. aggiunta melario) |
| [MELI_PRODUCT_SPEC.md](./MELI_PRODUCT_SPEC.md) | Entità dati e indice salute |

> **Nota implementativa:** il modulo runtime `MELI Intelligence` (`src/features/intelligence/`) oggi usa regole tecniche separate (`visita-scaduta`, `regina-non-vista`, …). Il Beekeeping Engine è la **fonte di verità di dominio**; la convergenza tra codici `BE-XXX` e regole runtime avverrà in fasi engineering future, senza duplicare significati in conflitto.

---

## 12. Changelog catalogo

| Versione | Data | Modifiche |
|----------|------|-----------|
| **1.0** | 2026-06 | Creazione documento; regole BE-001 – BE-005 |

---

*Documento mantenuto in `docs/BEEKEEPING_ENGINE.md`. Per proposte di nuove regole: aprire revisione product con codice provvisorio e categoria target.*
