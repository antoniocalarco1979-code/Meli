# MELI — Business Model

**Prodotto:** MELI — gestione apiari professionale  
**Mercato iniziale:** Calabria, Aspromonte, Reggio Calabria  
**Partner territoriale:** RANU (brand watermark, identità locale)  
**Ultimo aggiornamento:** giugno 2026

---

## 1. Proposta di valore

MELI risolve un problema operativo concreto: **l'apicoltore professionale perde traccia di cosa ha visto, trattato e prodotto** quando gestisce decine di arnie su più siti in condizioni di campo difficili (offline, guanti, sole).

### Valore per l'apicoltore

| Pain point | Soluzione MELI |
|------------|----------------|
| "Non ricordo quali arnie ho visitato oggi" | Giro apiario sequenziale con completamento e report |
| "Non ho storico strutturato per arnia" | Scheda premium: salute, regina, timeline, foto |
| "Registro visite troppo lento" | Checklist guidata < 30 secondi, offline |
| "Dati sparsi su carta e WhatsApp" | IndexedDB locale, export (evoluzione cloud) |

### Valore per il partner territoriale (RANU / Aspromonte)

- Strumento digitale **ancorato al territorio** (seed demo San Roberto, Aspromonte, Calanna).
- Visibilità brand non invasiva (watermark dashboard).
- Base per servizi B2B futuri (cooperative, tracciabilità lotto miele).

---

## 2. Segmenti clienti

### 2.1 Primario — Apicoltore professionale

| Attributo | Profilo |
|-----------|---------|
| Dimensione | 1–5 apiari, **50–200 arnie** |
| Geografia | Calabria, in espansione Sud Italia |
| Device | iPad in apiario, smartphone per consultazione |
| Digital literacy | Media — preferisce semplicità a feature avanzate |
| Willingness to pay | Media per strumento che risparmia tempo stagionale |

**Persona:** Antonio — 3 apiari in RC, ~40 arnie attive, usa iPad al mattino in Acquacalda.

### 2.2 Secondario — Cooperativa / consorzio apistico

| Attributo | Profilo |
|-----------|---------|
| Dimensione | 10+ apicoltori, 500+ arnie aggregate |
| Bisogno | Standardizzazione visite, report aggregati, tracciabilità |
| Canale | B2B contratto annuale (Fase 4–5) |

### 2.3 Terziario — Apicoltore hobbista

Non target v1.0 — UX e pricing orientati al professionista. Possibile tier free limitato in futuro.

---

## 3. Modello di revenue (pianificato)

**Stato attuale:** nessun monetizzazione implementata. App gratuita in sviluppo.

### 3.1 Tier proposti

| Tier | Prezzo indicativo | Include | Target |
|------|-------------------|---------|--------|
| **Core** | Gratuito | 1 apiario, 30 arnie, visite, giro, scheda salute | Prova / hobbista pro |
| **Pro** | €9–15/mese o €89/anno | Apiari illimitati, export PDF/CSV, backup cloud, report stagione | Apicoltore professionale |
| **Team** | €49+/mese | Multi-utente, dashboard cooperativa, white-label RANU | Consorzi, cooperative |

### 3.2 Revenue aggiuntivo (lunga durata)

| Stream | Descrizione | Fase |
|--------|-------------|------|
| Hardware bundle | iPad pre-configurato + MELI Pro | Fase 5 |
| Integrazione IoT | Sensori peso/umidità + subscription | Fase 5 |
| Tracciabilità lotto | Certificazione origine Aspromonte | Fase 5 |
| Formazione | Workshop digitale apicoltura | Partner RANU |

---

## 4. Go-to-market

### 4.1 Fase alpha (attuale)

| Canale | Azione |
|--------|--------|
| Partner RANU | Demo su apiario Acquacalda con dati reali anonimizzati |
| Word of mouth | 3–5 apicoltori pilota in provincia RC |
| Feedback loop | Sessioni osservazione giro + visita in campo |

**Obiettivo alpha:** validare che il giro sequenziale viene completato ≥ 80% delle volte.

### 4.2 Fase beta (v0.5)

| Canale | Azione |
|--------|--------|
| PWA installabile | Distribuzione link diretto, no store |
| Gruppi apicoltori | Presentazioni CONAPI locali / associazioni calabresi |
| Case study | "28 arnie in 3 ore con report" — metriche reali pilota |

### 4.3 Fase v1.0

| Canale | Azione |
|--------|--------|
| App Store / Play Store | Capacitor wrapper, ASO keywords apicoltura |
| Pro subscription | In-app purchase o Stripe |
| B2B outreach | Cooperative miele Aspromonte |

---

## 5. Metriche chiave (North Star e supporting)

### North Star Metric

**Arnie visitate per sessione giro** — proxy di valore operativo consegnato.

### Supporting metrics

| Metrica | Definizione | Target |
|---------|-------------|--------|
| Time-to-save visit | Secondi da apertura modal a salvataggio | < 30 s |
| Giro completion rate | Arnie visitate / totali per sessione | ≥ 80% |
| D7 retention (stagione) | Utenti attivi 7 giorni dopo install | ≥ 40% |
| WAU in stagione | Utenti attivi settimanali mag–set | Crescita m/m |
| Pro conversion | Free → Pro entro 30 gg | ≥ 5% (post-lancio) |
| NPS pilota | Net Promoter Score apicoltori alpha | ≥ 40 |

### Metriche tecniche (salute prodotto)

| Metrica | Soglia |
|---------|--------|
| Crash rate | < 0.1% sessioni |
| Salvataggio visita fallito | < 0.5% |
| Build time CI | < 3 min |

---

## 6. Vantaggio competitivo

| Fattore | MELI | Excel / carta | App generiche agricoltura |
|---------|------|---------------|---------------------------|
| Offline nativo | ✅ IndexedDB | ✅ | Spesso ❌ |
| Giro sequenziale apiario | ✅ | ❌ | Raro |
| Indice salute 0–100 | ✅ | Manuale | Assente |
| UX iPad + guanti | ✅ Design dedicato | N/A | Spesso mobile-only |
| Territorio Aspromonte | ✅ RANU, demo locali | ❌ | ❌ |
| Checklist visita guidata | ✅ 6 step | ❌ | Parziale |

**Moat a medio termine:** dati storici per arnia + integrazione territoriale + trust cooperativa.

---

## 7. Cost structure (startup)

| Voce | Stato attuale | v1.0 |
|------|---------------|------|
| Infrastruttura | €0 (static hosting) | €20–50/mese (hosting + backup cloud) |
| Store fees | €0 | Apple €99/anno, Google €25 una tantum |
| Terze parti | €0 | Meteo API, analytics (opzionale) |
| Sviluppo | Team interno / founder | Mantenimento + supporto pilota |

**Break-even indicativo (Pro):** ~30 abbonati Pro a €10/mese coprono costi infra base.

---

## 8. Partnership RANU

| Aspetto | Dettaglio |
|---------|-----------|
| Brand | Watermark "RANU / Aspromonte" in dashboard |
| Dati demo | Apiari reali territory (San Roberto, Aspromonte, Calanna) |
| Co-marketing | Materiali per cooperative calabresi |
| Futuro | Tier Team white-label RANU, tracciabilità lotto DOP |

**Vincolo brand:** watermark non deve competere con contenuti (`pointer-events: none`, opacità bassa) — già implementato.

---

## 9. Rischi business

| Rischio | Impatto | Mitigazione |
|---------|---------|-------------|
| Adozione lenta apicoltori senior | Alto | UX semplice, onboarding giro guidato, supporto locale |
| Stagionalità (uso mag–set) | Medio | Feature magazzino/off-season, promemoria |
| Concorrenza app EU apicoltura | Medio | Differenziazione territorio + offline + giro |
| Perdita dati utente | Alto | Backup export Fase 4, messaging chiaro |
| Scope tier free troppo generoso | Medio | Limite 30 arnie Core |

---

## 10. Decisioni business pendenti

1. **Pricing Pro** — €9 vs €15/mese da validare con pilota.
2. **Free tier limiti** — 1 apiario / 30 arnie vs time-limited trial.
3. **Backend sync** — build vs buy (Firebase/Supabase).
4. **Entità legale fatturazione** — startup vs partnership RANU.
5. **Open source core** — no decision; codice attualmente privato.

---

*Allineare metriche e tier a ogni milestone in [ROADMAP.md](./ROADMAP.md). Per scope prodotto: [MELI_PRODUCT_SPEC.md](./MELI_PRODUCT_SPEC.md).*
