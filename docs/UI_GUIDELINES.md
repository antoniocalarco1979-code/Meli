# MELI — UI Guidelines · Design System 2.0

**Documento ufficiale del Design System MELI**  
**Versione:** 2.0 · giugno 2026  
**Implementazione:** `src/theme/tokens.css` · `src/theme/global.css` · `src/components/ui/`

> Da questo momento **ogni nuova schermata** e **ogni modifica visiva** deve rispettare questo documento.  
> In caso di conflitto con guide precedenti, **UI_GUIDELINES.md prevale**.

---

## 1. Identità visiva

MELI UI 2.0 è **moderno, premium, Apple-like e molto pulito**.

| Principio | Descrizione |
|-----------|-------------|
| **Dark charcoal** | Sfondo scuro caldo — riduce affaticamento visivo in campo e valorizza gli accenti |
| **Miele & ambra** | Identità apistica; CTA e focus attivo |
| **Verde stato** | Conferme, salute, arnie visitate |
| **Rosso allerta** | Urgenze, errori, criticità sanitarie |
| **Pulizia** | Un obiettivo per schermata; gerarchia netta; zero decorazione superflua |
| **Premium** | Glass scuro, ombre profonde, motion controllato, tipografia di sistema |

**Brand partner:** RANU / Aspromonte — watermark discreto in dashboard.

---

## 2. Palette colori

Definita in `src/theme/tokens.css`. **Usare sempre token CSS — mai hex hardcoded nei componenti.**

### 2.1 Foundation — charcoal

| Token | Hex | Uso |
|-------|-----|-----|
| `--meli-charcoal` | `#1c1c1e` | Sfondo app, body |
| `--meli-charcoal-soft` | `#2c2c2e` | Card, pannelli secondari |
| `--meli-charcoal-elevated` | `#3a3a3c` | Input, campi form, aree rialzate |
| `--meli-charcoal-muted` | `#48484a` | Skeleton, separatori forti |

### 2.2 Accents — miele & ambra

| Token | Hex | Uso |
|-------|-----|-----|
| `--meli-honey` | `#e8960c` | CTA primarie, progress, link attivi |
| `--meli-honey-light` | `#ffb347` | Hover, gradienti, testo accento |
| `--meli-honey-soft` | `rgba(232,150,12,0.18)` | Background selezione, focus ring |
| `--meli-amber` | `#f5a623` | Highlight secondario, badge |
| `--meli-amber-soft` | `rgba(245,166,35,0.16)` | Badge ambra, stati informativi |

### 2.3 Semantic — stato & allerta

| Token | Hex | Uso |
|-------|-----|-----|
| `--meli-status-green` | `#34c759` | Salute OK, ✓ visitato, successo |
| `--meli-status-green-soft` | `rgba(52,199,89,0.16)` | Badge verde, sfondo positivo |
| `--meli-alert-red` | `#ff453a` | Errori, urgenze, pericolo |
| `--meli-alert-red-soft` | `rgba(255,69,58,0.16)` | Toast errore, badge critico |
| `--meli-warning` | `#ff9f0a` | Attenzione, controllo consigliato |

### 2.4 Testo (su sfondo scuro)

| Token | Hex | Uso |
|-------|-----|-----|
| `--meli-text` | `#f5f5f7` | Titoli, body principale |
| `--meli-text-secondary` | `#aeaeb2` | Sottotitoli, label |
| `--meli-text-muted` | `#8e8e93` | Hint, metadata, caption |
| `--meli-text-inverse` | `#1c1c1e` | Testo su CTA miele |

### 2.5 Superfici & overlay

| Token | Uso |
|-------|-----|
| `--meli-surface-hover` | Hover righe, link |
| `--meli-surface-active` | Stato pressed, card attiva |
| `--meli-surface-raised` | Sfondo riga/card leggera |
| `--meli-surface-strong` | Button secondary, badge default |
| `--meli-overlay` | Backdrop modal/dialog |
| `--meli-glass` / `--meli-glass-strong` | Card vetro, pannelli |

### 2.6 Regole colore

- Contrasto minimo **4.5:1** per body text; **7:1** per etichette critiche outdoor.
- Stati: **icona + testo + colore** — mai solo colore.
- Legacy `--meli-brown`, `--meli-cream` mappati ai token 2.0 per compatibilità.

---

## 3. Tipografia

Font di sistema Apple-like — **nessun web font custom**:

```css
--meli-font: -apple-system, BlinkMacSystemFont, 'SF Pro Text', …
--meli-font-display: … 'SF Pro Display', …
--meli-font-mono: ui-monospace, 'SF Mono', Menlo, monospace
```

| Livello | Font | Peso | Size | Uso |
|---------|------|------|------|-----|
| **Large Title** | Display | 700 | 28–34px | Hero, titolo schermata |
| **Title 1** | Display | 700 | 22–26px | Sezioni principali |
| **Title 2** | Display | 700 | 18–20px | Card title, modal title |
| **Headline** | Text | 600 | 17px | Enfasi inline |
| **Body** | Text | 400 | 17px | Contenuto, note |
| **Callout** | Text | 400 | 16px | Descrizioni secondarie |
| **Subhead** | Text | 600 | 15px | Label form |
| **Footnote** | Text | 400 | 13px | Hint, timestamp |
| **Caption** | Text | 600 | 12px | Badge, metadata uppercase |

**Regole:**
- Letter-spacing negativo su titoli (`-0.025em` … `-0.035em`).
- Label form: uppercase opzionale con tracking `0.06em` (classe `.meli-label`).
- Numero arnia: sempre **Display 800**, mai ridotto sotto 18px.

---

## 4. Pulsanti

Componente: `Button` · classi `ui-button`

### Varianti

| Variante | Classe | Aspetto | Uso |
|----------|--------|---------|-----|
| **Primary** | `--primary` | Gradiente miele→ambra, testo scuro | SALVA, INIZIA GIRO, azione principale |
| **Secondary** | `--secondary` | `--meli-surface-strong`, bordo glass | Annulla, azioni secondarie |
| **Ghost** | `--ghost` | Trasparente, testo muted | Link-style, toolbar |
| **Danger** | `--danger` | Gradiente rosso allerta | Elimina, azioni distruttive |

### Dimensioni

| Size | Min-height | Uso |
|------|------------|-----|
| `sm` | 40px | Inline, toolbar |
| `md` | 50px | Default form |
| `lg` | 56px | CTA principali mobile |
| `full` | — | Width 100% |

### Comportamento

- Border-radius: `--meli-radius-pill`
- Active: `scale(0.98)`
- Disabled: opacity `0.45`
- Ombra primary: `--meli-shadow-button`
- **Un solo primary per schermata**

---

## 5. Card

Componenti: `Card` · classi `ui-card` · superficie `.meli-glass`

### Struttura

```
┌─────────────────────────────┐
│  [Badge]          [Action]  │  ← header opzionale
│  Title                      │
│  Subtitle / metadata        │
│  ─────────────────────────  │
│  Content                    │
│  [CTA]                      │  ← footer opzionale
└─────────────────────────────┘
```

### Stile

| Proprietà | Valore |
|-----------|--------|
| Background | `--meli-charcoal-soft` o `.meli-glass` |
| Border | `1px solid --meli-border` |
| Radius | `--meli-radius-xl` (24px) |
| Shadow | `--meli-shadow-sm` … `--meli-shadow-md` |
| Padding | `sm` 1rem · `md` 1.35rem · `lg` 1.75rem |

### Stati

- **Default:** bordo `--meli-border`
- **Hover:** `--meli-surface-hover` (liste cliccabili)
- **Active/Selected:** bordo `--meli-border-accent` + glow `--meli-honey-soft`
- **Done:** check verde `--meli-status-green` + opacity 0.9

---

## 6. Menu laterale (Sidebar)

Componente: `Sidebar` · classe `.sidebar`

| Elemento | Stile |
|----------|-------|
| Background | `--meli-glass-sidebar` + blur heavy |
| Larghezza | 256px (76px collapsed tablet) |
| Logo | 52×52px, gradiente miele, radius md |
| Link default | `--meli-text-secondary`, radius md |
| Link hover | `--meli-surface-hover`, translateX 2px |
| Link active | `--meli-honey-soft`, testo `--meli-honey-light`, bordo accent |
| Footer | Separatore `--meli-border` |

**Mobile (<1024px):** sidebar nascosta; navigazione via bottom nav.

---

## 7. Navbar

### Header app (`.app-header`)

| Elemento | Stile |
|----------|-------|
| Altezza | `--meli-header-height` (64px) |
| Background | `.meli-glass` o trasparente su charcoal |
| Titolo | Display 700, `--meli-text` |
| Sottotitolo | 13px, `--meli-text-muted` |
| Icon button | 44×44px, radius sm, hover `--meli-honey-soft` |

### Bottom nav (`.bottom-nav`)

| Elemento | Stile |
|----------|-------|
| Altezza | 72px + safe area |
| Background | `--meli-glass-sidebar` |
| Item default | `--meli-text-muted` |
| Item active | Label `--meli-honey-light`, emoji scale 1.08 |
| Border top | `--meli-border` |

**Visibilità:** bottom nav solo mobile/tablet (<1025px).

---

## 8. Dialog

Componenti: `Modal` · `ConfirmDialog`

### Modal (`.ui-modal`)

| Proprietà | Valore |
|-----------|--------|
| Overlay | `--meli-overlay` + blur 8px |
| Dialog max-width | 520px |
| Radius | `--meli-radius-xl` |
| Background dialog | `.meli-glass--deep` |
| Titolo | Display 700, 20px |
| Close button | 40px circle, hover `--meli-honey-soft` |
| Body padding | 1.25–1.5rem |

### Confirm dialog (`.ui-confirm`)

| Proprietà | Valore |
|-----------|--------|
| Max-width | 400px |
| Allineamento | Centrato |
| Azioni | Primary + Ghost, gap 0.75rem |

**Regole:** titolo chiaro; messaggio max 2 righe; azione distruttiva = variant danger.

---

## 9. Form

Componenti: `Input` · `Textarea`

| Elemento | Stile |
|----------|-------|
| Label | 13px, 600, `--meli-text-secondary` |
| Field bg | `--meli-charcoal-elevated` |
| Field border | `--meli-border-glass` |
| Field radius | `--meli-radius-md` |
| Min-height input | `--meli-touch-min` (50px) |
| Focus | Bordo `--meli-border-accent` + ring `--meli-honey-soft` |
| Error | Bordo `--meli-alert-red`, testo `--meli-alert-red` |
| Hint | 12px, `--meli-text-muted` |

### Layout form

- Gap label→field: `--meli-space-xs`
- Gap tra campi: `--meli-space-lg`
- CTA submit: full-width, size lg, variant primary

---

## 10. Badge

Componente: `Badge` · classe `ui-badge`

| Variante | Background | Testo | Uso |
|----------|------------|-------|-----|
| `default` | `--meli-surface-strong` | secondary | Neutro |
| `honey` | `--meli-honey-soft` | `--meli-honey-light` | In evidenza |
| `gold` | `--meli-amber-soft` | `--meli-amber-light` | Premium, oro |
| `sage` | `--meli-status-green-soft` | `--meli-status-green-light` | OK, attivo |
| `danger` | `--meli-alert-red-soft` | `--meli-alert-red-light` | Critico |

- Radius: `--meli-radius-pill`
- Font: 12px, weight 700
- Padding: `0.25rem 0.65rem`

---

## 11. Notifiche (Toast)

Componente: `ToastContainer` · classe `ui-toast-stack`

| Tipo | Background | Bordo | Icona |
|------|------------|-------|-------|
| **Success** | `--meli-glass-strong` | `--meli-border-glass` | Verde gradient |
| **Error** | `--meli-alert-red-soft` | rosso 25% | Rosso gradient |
| **Info** | `--meli-honey-soft` | miele 20% | Miele gradient |

- Posizione: centro schermo (overlay non bloccante)
- Radius: `--meli-radius-xl`
- Durata consigliata: 3–4s
- Messaggio: Display 700, 16px, `--meli-text`

---

## 12. Timeline

Componenti: `TimelineCard` · `VisitaTimelineItem`

### Struttura card

```
● ─── Data · Ora
│     Stato · Regina · Covata
│     Azioni · Note
│     [Foto thumbnails]
```

| Elemento | Stile |
|----------|-------|
| Container | `.meli-glass`, radius xl, padding lg |
| Linea verticale | 2px, `--meli-border` o `--meli-honey` se attiva |
| Dot attivo | `--meli-honey`, glow soft |
| Dot passato | `--meli-status-green` |
| Data | Display 700, `--meli-text` |
| Metadata | Caption, `--meli-text-muted` |
| Foto | Radius sm, bordo `--meli-border` |

### Animazione

- Entrata item: fade + slide Y 10px, 350ms, stagger 40ms

---

## 13. Grafici

Componente: `ProduzioneChart` e futuri chart

| Elemento | Stile |
|----------|-------|
| Container | Card glass, padding lg |
| Asse / griglia | `--meli-border`, opacity 0.5 |
| Barre / linee | `--meli-honey` → `--meli-amber` gradient |
| Valori positivi | `--meli-status-green` |
| Valori negativi / alert | `--meli-alert-red` |
| Label assi | Caption, `--meli-text-muted` |
| Tooltip | `--meli-charcoal-elevated`, radius md, shadow lg |
| Area fill | `--meli-honey-soft` |

**Regole:** max 2 colori dati per grafico; legenda sempre visibile; numeri in `--meli-font-mono` opzionale.

---

## 14. Icone

Barrel: `src/theme/icons.ts` — **Lucide React**

| Regola | Valore |
|--------|--------|
| Stroke width | 1.75 – 2 |
| Size inline | 18 – 20px |
| Size button | 22 – 24px |
| Size hero | 26 – 28px |
| Colore default | `--meli-text-secondary` |
| Colore attivo | `--meli-honey-light` |
| Colore success | `--meli-status-green` |
| Colore danger | `--meli-alert-red` |

**Emoji:** consentite in empty state e bottom nav (max 1 per blocco). Non mischiare emoji + Lucide nello stesso controllo.

**Import:** sempre da `theme/icons`, mai direttamente da `lucide-react` nei componenti feature.

---

## 15. Spacing & layout

| Token | Valore |
|-------|--------|
| `--meli-space-xs` | 0.5rem |
| `--meli-space-sm` | 0.75rem |
| `--meli-space-md` | 1rem |
| `--meli-space-lg` | 1.35rem |
| `--meli-space-xl` | 1.65rem |
| `--meli-space-2xl` | 2rem |
| `--meli-content-max` | 1080px |

- Padding schermata: min 1.25rem mobile, 1.5–2rem tablet
- Gap sezioni: min `--meli-space-xl`
- Touch target: min `--meli-touch-min` (50px)

---

## 16. Motion

| Tipo | Durata | Easing |
|------|--------|--------|
| Tap feedback | 150ms | ease |
| Transizione UI | 200–280ms | `--meli-ease-out` |
| Entrata schermata | 350–450ms | `--meli-ease-out` |
| Modal open | 280ms | `--meli-ease-out` |

**Vietato:** loop infiniti, parallax, blur animato su grandi superfici.

---

## 17. Checklist nuova schermata

- [ ] Token `--meli-*` only (zero hex sparsi)
- [ ] Sfondo charcoal; testo chiaro
- [ ] Un CTA primary evidente
- [ ] Form/input conformi §9
- [ ] Card conformi §5
- [ ] Stati loading / empty / error
- [ ] Touch ≥ 50px
- [ ] Icone da `theme/icons`
- [ ] Motion ≤ 280ms funzionale

---

## 18. Riferimenti

| Risorsa | Path |
|---------|------|
| Token CSS | `src/theme/tokens.css` |
| Global + glass | `src/theme/global.css` |
| Componenti UI | `src/components/ui/` |
| Design Reference (UX) | `docs/DESIGN_REFERENCE.md` |
| Product Spec | `docs/MELI_PRODUCT_SPEC.md` |

---

## Changelog

| Versione | Data | Note |
|----------|------|------|
| 2.0 | giugno 2026 | UI 2.0 — dark charcoal, miele, ambra, verde, rosso |
| 1.x | — | Tema crema/chiaro (deprecato) |

---

*MELI · UI Guidelines 2.0 · RANU / Aspromonte*
