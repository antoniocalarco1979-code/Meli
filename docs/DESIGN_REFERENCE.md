# MELI — Design Reference

**Documento ufficiale di riferimento grafico e UX**  
**Versione:** 1.0 · giugno 2026  
**Implementazione tecnica:** `src/theme/tokens.css` · `src/theme/global.css` · `src/components/ui/`

> Da questo momento **ogni nuova schermata, componente o iterazione visiva** deve rispettare le linee guida contenute in questo documento. In caso di conflitto con documenti precedenti, **DESIGN_REFERENCE.md prevale**.

---

## 1. Filosofia di design

MELI è un'app da **campo**: si usa con guanti, sotto il sole, con una mano, spesso in piedi accanto all'arnia. L'interfaccia deve essere:

| Principio | Significato operativo |
|-----------|----------------------|
| **Stile Apple** | Gerarchia chiara, motion controllato, tipografia di sistema, superfici pulite, zero rumore visivo |
| **Moderno** | Layout arioso, glass leggero, stati interattivi evidenti, niente estetica “gestionale anni 2000” |
| **Pulito** | Un obiettivo per schermata; informazioni secondarie collassabili o in pannello laterale |
| **Colori miele** | Palette calda (miele, crema, oro, marrone, salvia) — mai grigi freddi dominanti |
| **Grandi spazi** | Respiro tra blocchi; padding generosi; niente densità da foglio Excel |
| **Una mano** | CTA e controlli critici nella **zona pollice** (metà inferiore dello schermo) |
| **Leggibilità al sole** | Contrasto alto, testo scuro su crema, evitare testo chiaro su sfondo chiaro |
| **Tablet + smartphone** | Layout fluido; tablet = lavoro operativo; smartphone = consultazione rapida e azioni essenziali |

**Sensazione da trasmettere:** calore, competenza, tranquillità operativa — come aprire un quaderno di campo ben curato, non un software contabile.

---

## 2. Piattaforme e contesto d'uso

### 2.1 Dispositivi target

| Dispositivo | Ruolo primario | Note layout |
|-------------|----------------|-------------|
| **Tablet Android** (10"–11") | Ispezione, giro apiario, inserimento dati | Layout a due colonne dove possibile; pannello laterale; touch min 50px |
| **Smartphone** | Consultazione, avvio giro, note rapide | Stack verticale; bottom nav; CTA full-width |
| **iPad** (compatibilità) | Stesso trattamento del tablet | Sidebar collassabile; content max 1080px |

### 2.2 Condizioni ambientali

- **Luce solare diretta:** contrasto minimo **4.5:1** per testo body; **7:1** per etichette critiche (numero arnia, stato sanitario).
- **Guanti / dita bagnate:** target touch **minimo 50px** (`--meli-touch-min`); preferire **56–64px** per CTA primarie.
- **Interruzioni:** ogni flusso deve poter essere sospeso e ripreso senza perdita di contesto visivo.

---

## 3. Sistema visivo

### 3.1 Palette — colori miele

Usare **esclusivamente i token CSS** definiti in `src/theme/tokens.css`. Non introdurre hex hardcoded nei componenti.

#### Primari (identità)

| Token | Hex | Uso |
|-------|-----|-----|
| `--meli-honey` | `#e8960c` | CTA primarie, accenti attivi, progress |
| `--meli-honey-light` | `#ffb347` | Gradienti, hover, highlight |
| `--meli-gold` | `#c9a227` | Badge, icone secondarie attive |
| `--meli-cream` | `#fff8e7` | Sfondo app, superfici calde |
| `--meli-brown` | `#3d2c18` | Testo principale, titoli |

#### Supporto (campo e natura)

| Token | Uso |
|-------|-----|
| `--meli-sage` | Stati positivi, conferme, arnie visitate |
| `--meli-hive-healthy` | Salute buona, check completato |
| `--meli-hive-warning` | Attenzione, controllo consigliato |
| `--meli-hive-critical` | Urgenza sanitaria |
| `--meli-hive-inactive` | Arnia inattiva / non ispezionata |

#### Regola sole

- Sfondo: sempre **crema o vetro caldo** — mai bianco puro `#ffffff` a pieno schermo.
- Testo: **marrone scuro** su crema — mai grigio `#999` su crema chiaro.
- Stati colorati: usare **icona + testo**, non solo colore (accessibilità e leggibilità outdoor).

### 3.2 Tipografia

Font di sistema (stile Apple — nessun web font custom):

```css
--meli-font: -apple-system, BlinkMacSystemFont, 'SF Pro Text', …
--meli-font-display: … 'SF Pro Display', …
```

| Livello | Stile | Uso |
|---------|-------|-----|
| **Display** | Display, 800, letter-spacing +0.04–0.06em | Titoli schermata, numero arnia, CTA hero |
| **Title** | Display, 700–800 | Sezioni, card title |
| **Body** | Text, 400–600, 16–18px min | Contenuti, note, descrizioni |
| **Label** | Text, 700, uppercase, 0.03em tracking | Etichette campo, metadata |
| **Caption** | Text, 600, 14px | Timestamp, hint secondari |

**Regola:** corpo testo **≥ 16px** su mobile; **≥ 17px** su tablet.

### 3.3 Spaziatura

Scala ufficiale (non inventare valori intermedi salvo casi documentati):

| Token | Valore | Uso tipico |
|-------|--------|------------|
| `--meli-space-xs` | 0.5rem | Gap interni stretti |
| `--meli-space-sm` | 0.75rem | Gap tra label e input |
| `--meli-space-md` | 1rem | Padding card compatte |
| `--meli-space-lg` | 1.35rem | Padding card standard |
| `--meli-space-xl` | 1.65rem | Separazione sezioni |
| `--meli-space-2xl` | 2rem | Margini schermata |
| `--meli-space-3xl` | 2.5rem | Hero, area respiro superiore |

**Regola “grandi spazi”:** tra sezioni logiche usare almeno `--meli-space-xl`. Mai impilare più di **3 blocchi informativi** senza separatore visivo (linea, glass, o spazio 2xl).

### 3.4 Superfici e profondità

- **Glassmorphism leggero:** classi `.meli-glass`, `.meli-glass--deep` — vetro caldo, non frosted grigio.
- **Border radius:** `--meli-radius-lg` (30px) per card; `--meli-radius-xl` (40px) per pannelli hero; `--meli-radius-pill` per CTA.
- **Ombre:** morbide e calde (`--meli-shadow-md`, `--meli-shadow-button`) — mai ombre nere nette.
- **Bordi:** `--meli-border` sottile; evidenza attiva con `--meli-honey` + glow soft.

### 3.5 Motion e animazioni

Animazioni **leggere, funzionali, mai decorative**:

| Tipo | Durata | Easing | Esempio |
|------|--------|--------|---------|
| Transizione UI | 200–280ms | `--meli-ease-out` | Apertura pannello, cambio step wizard |
| Feedback tap | 150ms | ease | Scale 0.97–0.98 su press |
| Entrata schermata | 350–450ms | `--meli-ease-out` | Fade + slide 12–24px |
| Selezione telaino | 200ms | ease-out | Highlight bordo + leggero lift |

**Vietato:** animazioni loop infinite, parallax pesante, blur animato su grandi superfici (performance outdoor + batteria).

---

## 4. Pattern di interazione

### 4.1 Uso con una mano

```
┌─────────────────────────────┐
│  Header compatto (info)     │  ← zona sicura, non interattiva critica
│                             │
│                             │
│     Area contenuto          │  ← scroll, selezione, visualizzazione
│                             │
│                             │
│  ┌─────────────────────┐    │
│  │   CTA primaria      │    │  ← zona pollice: 40% inferiore
│  └─────────────────────┘    │
│  [ Nav secondaria ]         │
└─────────────────────────────┘
```

- CTA primarie: **full-width**, min-height **56px** (mobile) / **64px** (tablet).
- Azioni secondarie: sopra la CTA primaria o in header — mai in angolo alto destro su mobile.
- Bottom navigation: sempre raggiungibile; non coprire con FAB senza safe area.

### 4.2 Gerarchia schermata (modello Apple)

Ogni schermata segue **3 livelli**:

1. **Context** — dove sono (apiario, arnia N, giro attivo)
2. **Focus** — cosa devo fare ora (ispeziona telaino 3, conferma visita)
3. **Action** — un solo pulsante primario evidente

### 4.3 Componenti UI standard

Usare il catalogo in `src/components/ui/`:

`Button` · `Card` · `Input` · `Modal` · `Badge` · `EmptyState` · `Skeleton` · `Toast`

**Non duplicare** stili button/input nelle feature: estendere via `className` o varianti del design system.

### 4.4 Feedback e stati

| Stato | Trattamento visivo |
|-------|-------------------|
| Successo | Icona ✓ verde `--meli-hive-healthy` + testo |
| Errore | `--meli-error` + messaggio chiaro, mai solo colore |
| Loading | `Skeleton` o spinner discreto — mai schermo bianco |
| Vuoto | `EmptyState` con emoji naturale + CTA |
| Completato | Opacità 0.85 + check verde + testo barrato opzionale |

---

## 5. Layout responsive

### 5.1 Breakpoint

| Breakpoint | Comportamento |
|------------|---------------|
| `< 768px` | Stack verticale; sidebar nascosta; bottom nav |
| `768px – 1024px` | Tablet: sidebar + content; card 2 colonne dove utile |
| `> 1024px` | Content max `--meli-content-max` (1080px), centrato |

### 5.2 Griglia e allineamento

- Padding orizzontale schermata: **min 1.25rem** mobile, **1.5–2rem** tablet.
- Card e liste: **max-width 520px** per righe singola arnia (leggibilità); eccezione: schermata ispezione 3D (full width controllata).

---

## 6. Schermata principale dell'arnia — riferimento UX

La schermata centrale di MELI è l'**ispezione visiva dell'arnia**. Deve incarnare tutti i principi di questo documento ed è il benchmark per qualità visiva e operativa.

### 6.1 Obiettivo

Permettere all'apicultore di **capire lo stato dell'arnia a colpo d'occhio**, selezionare un telaino, registrarne i dettagli — senza menu complessi.

### 6.2 Layout target

```
┌──────────────────────────────────────────────────────────┐
│  ← Apiario    ARNIA 12    🟢                    [ ✕ ]   │  Header fisso, compatto
├──────────────────────────────┬───────────────────────────┤
│                              │                           │
│                              │   Pannello laterale       │
│     Visualizzazione 3D       │   (dettaglio telaino)     │
│     dell'arnia               │                           │
│                              │   · Covata                │
│     ┌──┐ ┌──┐ ┌──┐          │   · Scorte                │
│     │  │ │  │ │  │ melario  │   · Regina                │
│     └──┘ └──┘ └──┘          │   · Note                  │
│     telaini legno chiaro     │   · Foto                  │
│                              │   · Cronologia telaino    │
│     [ tap = selezione ]      │                           │
│                              │   [ Salva telaino ]       │
│                              │                           │
├──────────────────────────────┴───────────────────────────┤
│              Progress / azioni giro (se attivo)            │
└──────────────────────────────────────────────────────────┘
```

**Tablet:** split view 60/40 (3D | pannello).  
**Smartphone:** 3D full-width; pannello **slide-up sheet** dal bordo inferiore (zona pollice).

### 6.3 Visualizzazione 3D dell'arnia

| Requisito | Specifica |
|-----------|-----------|
| **Prospettiva** | Leggermente angolata (isometrica / 3D soft) — riconoscibile come arnia reale |
| **Telaini** | Legno chiaro (`#e8d5b5` → `#f5e6c8` range); venature sottili; spaziatura visiva tra telaini |
| **Selezione diretta** | Tap su telaino = selezione immediata; bordo `--meli-honey` + glow `--meli-honey-soft` |
| **Melario** | Distinto visivamente (tint leggermente più scura o etichetta “M”) — sopra il corpo |
| **Nido** | Area corpo telaini chiaramente separata dal melario |
| **Stati telaino** | Non ispezionato / ispezionato / alert — bordo o badge, mai solo colore |
| **Performance** | 60fps target; fallback 2D schematico su device deboli |

### 6.4 Pannello laterale dettagli

Si apre **contestualmente** alla selezione telaino — non è un form generico distaccato.

Contenuti (ordine verticale):

1. **Identità** — “Telaino N” + indicatore melario/nido
2. **Campi ispezione** — covata, scorte, regina (pattern choice grid MELI)
3. **Note** — textarea compatta, espandibile
4. **Foto telaino** — thumbnail + aggiungi; griglia max 3 visibili + “altre”
5. **Cronologia telaino** — timeline compatta (ultime 3 voci + “vedi tutto”)
6. **CTA** — “Salva telaino” primaria in fondo al pannello

**Stile pannello:** `.meli-glass--deep`, radius `--meli-radius-xl`, padding `--meli-space-lg`.

### 6.5 Capacità future ( progettare spazio, non implementare ora )

- **Zoom** pinch-to-zoom sulla vista 3D
- **Rotazione** swipe orizzontale o drag per orbitare l'arnia
- **Vista esplosa** — separazione telaini per ispezione virtuale

L'UI attuale deve **non precludere** questi gesti: area 3D libera da overlay permanenti.

### 6.6 Animazioni schermata arnia

| Evento | Animazione |
|--------|------------|
| Selezione telaino | Highlight 200ms + pannello slide-in |
| Deselezione | Fade pannello 150ms |
| Salva telaino | Check verde sul telaino + micro-scale 1.02 → 1 |
| Cambio arnia | Crossfade 280ms |

---

## 7. Pattern schermata per schermata

### 7.1 Dashboard / Home

- Hero compatto: apiario selezionato + briefing
- Intelligence panel: suggerimenti prioritizzati, non lista infinita
- CTA “Inizia giro” — stile hero button (gradient miele, pill, 64px)

### 7.2 Apiario / Giro apiario

- Pulsante **▶ INIZIA GIRO** grande, centrato, impossibile da ignorare
- Lista arnie: numero, colore swatch, ultima visita, ✓ verde se visitata
- Progress: “Arnie visitate: X / Totale” sempre visibile durante il giro
- Termina giro: secondario ma accessibile in basso

### 7.3 Wizard e flussi guidati

- Progress bar in alto (step N/total)
- Un titolo + una domanda per step
- Avanti / Indietro; ultimo step = SALVA maiuscole
- Validazione inline, messaggio errore sotto il campo

### 7.4 Timeline e cronologia

- Card vetro con data, ora, metadata
- Gerarchia: data → stato → dettagli → foto
- Scroll verticale; niente tabelle

---

## 8. Iconografia e contenuti

- **Icone:** Lucide via `src/theme/icons.ts` — stroke 1.75–2, size 18–24
- **Emoji:** consentite per empty state, natura, quick scan (🐝 🍯 🌿) — max 1 per blocco
- **Linguaggio UI:** italiano, imperativo chiaro (“Ispeziona”, “Salva”, “Termina giro”)
- **Numeri arnia:** sempre prominenti — Display, bold, mai sepolti in sottotitoli

---

## 9. Accessibilità

- Touch target ≥ 50px
- Focus visibile su navigazione tastiera (tablet con tastiera)
- `aria-label` su controlli icon-only
- Contrasto WCAG AA minimo; AAA preferito per testo piccolo outdoor
- Non affidarsi solo al colore per stati critici

---

## 10. Checklist per nuove schermate

Prima di considerare una schermata completa, verificare:

- [ ] Usa token `--meli-*` (zero hex sparsi)
- [ ] Tipografia ≥ 16px body; titoli Display
- [ ] Spaziatura ≥ `--meli-space-lg` tra sezioni
- [ ] CTA primaria in zona pollice (mobile)
- [ ] Leggibile in pieno sole (contrasto marrone/crema)
- [ ] Un solo obiettivo principale per schermata
- [ ] Animazioni ≤ 280ms, easing `--meli-ease-out`
- [ ] Stati loading / empty / error gestiti
- [ ] Componenti da `src/components/ui/`
- [ ] Coerente con schermata arnia 3D (se nel modulo arnie/visite)

---

## 11. Riferimenti correlati

| Documento | Contenuto |
|-----------|-----------|
| [UI_GUIDELINES.md](./UI_GUIDELINES.md) | Dettaglio implementativo componenti |
| [design-system.md](./design-system.md) | Indice rapido token e catalogo UI |
| [MELI_PRODUCT_SPEC.md](./MELI_PRODUCT_SPEC.md) | Requisiti prodotto |
| `src/theme/tokens.css` | Source of truth tecnica colori e spacing |

---

## 12. Changelog documento

| Versione | Data | Modifiche |
|----------|------|-----------|
| 1.0 | giugno 2026 | Prima emissione ufficiale — principi generali + schermata arnia 3D |

---

*MELI · Design Reference · RANU / Aspromonte · Uso interno e sviluppo prodotto*
