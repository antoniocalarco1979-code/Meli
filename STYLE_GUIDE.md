# MELI — Style Guide

Guida visiva e UX per mantenere coerenza in tutta l'applicazione.

Implementazione: `src/theme/tokens.css`, `src/theme/global.css`, `src/components/ui/`.

---

## Identità

**MELI** — gestione apiari professionale.  
Estetica: premium, calda, naturale. Riferimenti: miele, calabria, campo, iPadOS.

Brand correlato: **RANU** (watermark, partner Aspromonte).

---

## Palette colori

### Primari

| Nome | Token | Hex | Uso |
|------|-------|-----|-----|
| Miele | `--meli-honey` | `#e8960c` | CTA, accenti, icone attive |
| Miele chiaro | `--meli-honey-light` | `#ffb347` | Gradienti, hover |
| Oro | `--meli-gold` | `#c9a227` | Highlight, badge |
| Oro scuro | `--meli-gold-dark` | `#9a7b1a` | Testo enfatizzato |

### Neutri caldi

| Nome | Token | Hex | Uso |
|------|-------|-----|-----|
| Crema | `--meli-cream` | `#fff8e7` | Sfondo app |
| Crema soft | `--meli-cream-soft` | `#faf3e0` | Sfondo secondario |
| Marrone | `--meli-brown` | `#3d2c18` | Testo principale |
| Marrone soft | `--meli-brown-soft` | `#5c4528` | Testo secondario |

### Semantici

| Nome | Token | Uso |
|------|-------|-----|
| Salvia | `--meli-sage` | Stati OK, natura, empty state |
| Verde mappa | `--meli-map-green` | Mappa apiario, bordi campo |
| Warning | `--meli-hive-warning` | Arnie da controllare |
| Critical | `--meli-hive-critical` | Urgenze sanitarie |

---

## Tipografia

Font di sistema (iPadOS / SF Pro):

```css
--meli-font: -apple-system, BlinkMacSystemFont, 'SF Pro Text', …
--meli-font-display: … 'SF Pro Display', …
```

| Elemento | Size | Weight | Note |
|----------|------|--------|------|
| H1 pagina | 1.75–2.25rem | 700 | `letter-spacing: -0.035em` |
| H2 sezione | 1.125rem | 700 | Display font |
| Body | 17px | 400 | Line-height 1.47 |
| Label | 0.6875rem | 600 | Uppercase, `.meli-label` |
| KPI value | 1.5rem | 700 | Display font |

---

## Spaziatura e layout

| Token | Valore | Uso |
|-------|--------|-----|
| `--meli-sidebar-width` | 256px | Sidebar desktop |
| `--meli-header-height` | 64px | Header app |
| `--meli-content-max` | 1080px | Max-width contenuti |
| `--meli-touch-min` | 50px | Target touch iPad |

Padding pagina: `1.75rem 2rem` (desktop), `1.25rem 1rem` (mobile).  
Gap griglie: `1.25rem` – `1.65rem`.

---

## Border radius

| Token | Valore | Uso |
|-------|--------|-----|
| `--meli-radius-sm` | 18px | Input, icone |
| `--meli-radius-md` | 24px | Card interne |
| `--meli-radius-lg` | 30px | Card standard |
| `--meli-radius-xl` | 40px | Card hero, mappe |
| `--meli-radius-pill` | 999px | Button, badge, selector |

---

## Ombre

```css
--meli-shadow-sm    /* elementi leggeri */
--meli-shadow-md    /* card standard */
--meli-shadow-lg    /* card hover, modali */
--meli-shadow-button /* CTA primari */
```

Mai ombre dure o nere pure — sempre tono marrone/miele con bassa opacità.

---

## Glassmorphism

Classi globali:

```html
<div class="meli-glass">…</div>
<div class="meli-glass meli-glass--deep">…</div>
```

Proprietà chiave:
- `backdrop-filter: blur(40px) saturate(1.8)`
- Bordo bianco semitrasparente
- Gradiente highlight in alto (::before)
- Sfondo `rgba(255, 255, 255, 0.55–0.72)`

---

## Componenti UI

Usare sempre i componenti in `src/components/ui/`:

| Componente | Quando usarlo |
|------------|---------------|
| `Button` | Azioni (`primary`, `secondary`, `ghost`, `danger`) |
| `Card` | Contenitori con vetro |
| `Section` | Blocchi con titolo + body |
| `Input` / `Textarea` | Form |
| `Badge` | Stati, contatori |
| `Modal` | Dialoghi |
| `PageTitle` | Intestazione pagine feature |
| `EmptyState` | Liste vuote |
| `Loading` | Suspense / fetch |
| `FloatingActionButton` | Azione primaria flottante |

Non usare Bootstrap, Tailwind o librerie UI esterne.

---

## Icone

**Lucide React** — stroke `1.65`, size:

| Contesto | Size |
|----------|------|
| Sidebar | 24px |
| Header actions | 22px |
| Card / KPI | 20–26px |
| Empty state | 40px |

---

## Animazioni

**Framer Motion** — preferire:

```typescript
transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
```

- Hover card: `y: -4`, ombra `--meli-shadow-lg`
- Tap button: `scale: 0.97–0.98`
- Stagger children: `0.05–0.08s`
- Evitare animazioni eccessive su liste lunghe

---

## Stati arnia (mappa)

| Stato | Colore | Significato |
|-------|--------|-------------|
| `healthy` | Verde | Colonia OK |
| `warning` | Arancio | Da verificare |
| `critical` | Rosso | Intervento urgente |
| `inactive` | Grigio | Non operativa |

---

## Watermark RANU

- Testo centrale, opacità ~20%
- Gradiente marrone/oro
- Non deve competere con i contenuti (`pointer-events: none`, `z-index: 0`)
- Asset: `assets/brand/ranu-logo.svg`, runtime: `/ranu-logo.svg`

---

## Do / Don't

### ✅ Do

- Usare token CSS, mai colori hardcoded
- Mantenere contrasto leggibile su crema
- Testare su iPad 768×1024 e 1024×768
- Riutilizzare componenti UI esistenti

### ❌ Don't

- Introdurre nuovi font web pesanti
- Usare nero `#000` per testo
- Angoli squadrati (< 12px) su card
- Logica business nei componenti UI

---

## Asset brand

| File | Percorso |
|------|----------|
| Logo MELI | `assets/brand/meli-logo.svg` |
| Logo RANU | `assets/brand/ranu-logo.svg` |
| Favicon | `public/favicon.svg` |

---

*Ultimo aggiornamento: giugno 2025*
