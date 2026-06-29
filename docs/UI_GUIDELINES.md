# MELI — UI Guidelines

**Implementazione:** `src/theme/tokens.css` · `src/theme/global.css` · `src/components/ui/`  
**Principio guida:** premium, caldo, naturale — miele, Calabria, campo, iPadOS  
**Ultimo aggiornamento:** giugno 2026

---

## 1. Identità visiva

MELI comunica **professionalità apistica** senza cold tech aesthetic. L'utente deve percepire:
- calore (crema, miele, oro),
- chiarezza operativa (contrasto, gerarchia netta),
- fiducia (vetro, ombre morbide, motion controllato).

**Brand partner:** RANU / Aspromonte — watermark dashboard (`RanuWatermark.tsx`), non invasivo, opacità ~20%.

**Asset brand:**

| Asset | Percorso sorgente | Runtime |
|-------|-------------------|---------|
| Logo MELI | `assets/brand/meli-logo.svg` | bundler |
| Logo RANU | `assets/brand/ranu-logo.svg` | `/ranu-logo.svg` |
| Favicon | `public/favicon.svg` | static |

---

## 2. Palette colori

Definita in `src/theme/tokens.css`. **Usare sempre token CSS — mai hex hardcoded nei componenti feature.**

### 2.1 Primari

| Nome | Token | Hex | Uso |
|------|-------|-----|-----|
| Miele | `--meli-honey` | `#e8960c` | CTA primarie, accenti, icone attive |
| Miele chiaro | `--meli-honey-light` | `#ffb347` | Gradienti, hover |
| Oro | `--meli-gold` | `#c9a227` | Highlight, badge |
| Oro scuro | `--meli-gold-dark` | `#9a7b1a` | Testo enfatizzato |

### 2.2 Neutri caldi

| Nome | Token | Hex | Uso |
|------|-------|-----|-----|
| Crema | `--meli-cream` | `#fff8e7` | Sfondo app |
| Crema soft | `--meli-cream-soft` | `#faf3e0` | Sfondo secondario |
| Marrone | `--meli-brown` | `#3d2c18` | Testo principale |
| Marrone soft | `--meli-brown-soft` | `#5c4528` | Testo secondario |

### 2.3 Semantici

| Nome | Token | Uso |
|------|-------|-----|
| Salvia | `--meli-sage` | Stati OK, natura, empty state |
| Verde mappa | `--meli-map-green` | Mappa apiario, bordi campo |
| Warning | `--meli-hive-warning` | Arnie da controllare |
| Critical | `--meli-hive-critical` | Urgenze sanitarie |

### 2.4 Semaforo arnia / salute

| Token | Hex | Livello |
|-------|-----|---------|
| `--meli-hive-healthy` | `#43a047` | Salute ≥ 70 |
| `--meli-hive-warning` | `#fb8c00` | Salute 40–69 |
| `--meli-hive-critical` | `#e53935` | Salute < 40 |
| `--meli-hive-inactive` | `#9e9e9e` | Arnia inattiva/morta |

Usati in `SaluteSemaforo`, `ArniaCard`, mappa dashboard mock.

---

## 3. Tipografia

Font di sistema — **nessun web font custom** (performance + natività iPadOS):

```css
--meli-font: -apple-system, BlinkMacSystemFont, 'SF Pro Text', …
--meli-font-display: … 'SF Pro Display', …
```

| Elemento | Size | Weight | Note |
|----------|------|--------|------|
| H1 pagina | 1.75–2.25 rem | 700 | `letter-spacing: -0.035em`, display font |
| H2 sezione | 1.125 rem | 700 | Display font |
| Body | 17 px | 400 | Line-height 1.47 |
| Label | 0.6875 rem | 600 | Uppercase, classe `.meli-label` |
| KPI value | 1.5 rem | 700 | Display font |
| Hero apiario | 2+ rem | 700 | Uppercase nome apiario |

**Regola:** testo principale sempre `--meli-brown`, mai `#000` puro.

---

## 4. Spaziatura e layout

### 4.1 Token layout

| Token | Valore | Uso |
|-------|--------|-----|
| `--meli-sidebar-width` | 256 px | Sidebar desktop |
| `--meli-sidebar-collapsed` | 76 px | Sidebar icone-only |
| `--meli-header-height` | 64 px | Header app |
| `--meli-content-max` | 1080 px | Max-width contenuti |
| `--meli-touch-min` | 50 px | **Minimo touch target iPad/guanti** |

### 4.2 Padding pagina

| Breakpoint | Padding |
|------------|---------|
| Desktop (≥ 1024 px) | `1.75rem 2rem` |
| Mobile (< 768 px) | `1.25rem 1rem` |
| iPad (768–1024 px) | Intermedio, modal fullscreen con padding generoso |

Gap griglie card: `1.25rem` – `1.65rem`.

### 4.3 Breakpoints

| Range | Comportamento |
|-------|---------------|
| < 768 px | Stack mobile, sidebar orizzontale |
| 768–1024 px | **Range iPad primario** — giro hero, modal visita |
| ≥ 1024 px | Sidebar collapsed, griglia arnie 3+ colonne |
| ≥ 1400 px | Griglia arnie espansa |

Viewport height: `100dvh` per evitare jump barra Safari iOS.

Scroll: `-webkit-overflow-scrolling: touch` su regioni scrollabili.

---

## 5. Border radius

Angoli generosi — identità MELI, mai card squadrate.

| Token | Valore | Uso |
|-------|--------|-----|
| `--meli-radius-sm` | 18 px | Input, icone |
| `--meli-radius-md` | 24 px | Card interne |
| `--meli-radius-lg` | 30 px | Card standard |
| `--meli-radius-xl` | 40 px | Card hero, mappe |
| `--meli-radius-pill` | 999 px | Button, badge, chip |

---

## 6. Ombre

```css
--meli-shadow-sm      /* elementi leggeri */
--meli-shadow-md      /* card standard */
--meli-shadow-lg      /* card hover, modali */
--meli-shadow-button  /* CTA primari */
```

**Regola:** ombre sempre tono marrone/miele a bassa opacità. Mai ombre nere dure.

Hover card standard: `translateY(-4px)` + `--meli-shadow-lg`.

---

## 7. Glassmorphism

Pattern dominante dell'app. Classi globali in `global.css`:

```html
<div class="meli-glass">…</div>
<div class="meli-glass meli-glass--deep">…</div>
```

Proprietà chiave:
- `backdrop-filter: blur(40px) saturate(1.8)`
- bordo bianco semitrasparente,
- gradiente highlight superiore (`::before`),
- sfondo `rgba(255, 255, 255, 0.55–0.72)`.

Token: `--meli-glass`, `--meli-glass-strong`, `--meli-glass-sidebar`.

**Quando usare `--deep`:** card hero, modali, sezioni con contenuto denso sopra sfondo crema.

---

## 8. Componenti UI

Catalogo ufficiale: `src/components/ui/`. **Non introdurre Bootstrap, Tailwind o librerie UI esterne.**

| Componente | Varianti / note | Quando usarlo |
|------------|-----------------|---------------|
| `Button` | `primary`, `secondary`, `ghost`, `danger`; `sm/md/lg` | Tutte le azioni |
| `Card` | Glass default | Contenitori sezione |
| `Section` | Titolo + body | Blocchi feature |
| `Input` / `Textarea` | — | Form apiario, visita |
| `Badge` | Pill | Stati, contatori |
| `Modal` | default, **`fullscreen`** | Visite in campo |
| `ConfirmDialog` | — | Delete apiario/arnia |
| `PageTitle` | — | Intestazione pagine |
| `EmptyState` | Icona 40 px | Moduli placeholder |
| `Loading` | `sm/md/lg` | Suspense lazy routes |
| `SuccessToast` | — | Post-salvataggio visita |
| `FloatingActionButton` | — | Nuova visita scheda arnia |

Barrel export: `src/components/ui/index.ts`.

### 8.1 Button — gerarchia azioni

| Variante | Uso tipico |
|----------|------------|
| `primary` | Inizia Giro, Salva visita, Inizia Giornata |
| `secondary` | Esporta Report, Azioni secondarie |
| `ghost` | Chiudi, Annulla, navigazione soft |
| `danger` | Elimina apiario |

Tap feedback: `scale: 0.97–0.98` via Framer Motion.

### 8.2 Modal fullscreen — visita

Variant `fullscreen` su `Modal`:
- occupa viewport (`100dvh`),
- padding safe-area,
- step indicator in alto,
- CTA Salva sempre visibile in fondo.

**Non usare modal default** per flussi campo — troppo piccolo su iPad con guanti.

---

## 9. Icone

**Lucide React** — stroke `1.65`.

| Contesto | Size |
|----------|------|
| Sidebar | 24 px |
| Header actions | 22 px |
| Card / KPI | 20–26 px |
| Empty state | 40 px |

Mapping sidebar (`config.ts`): Dashboard, Apiari (MapPin), Arnie (Hexagon), Visite (CalendarDays), Regine (Crown), Trattamenti (Shield), Produzione (Droplets), Magazzino (Package), Report (BarChart3).

---

## 10. Animazioni

**Framer Motion** — easing brand:

```typescript
transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
```

Token CSS: `--meli-ease`, `--meli-ease-out`.

| Pattern | Valore |
|---------|--------|
| Page enter | opacity 0→1, 400 ms |
| Card hover | `y: -4`, shadow lg |
| Button tap | `scale: 0.97–0.98` |
| Stagger children | delay 0.05–0.08 s |
| Health ring | animazione score su `HealthCard` |

**Evitare:** animazioni pesanti su liste lunghe (28+ arnie). Preferire transizioni sul solo step attivo del giro.

---

## 11. Pattern schermata per feature

### 11.1 Dashboard

- Watermark RANU centrale, z-index 0, `pointer-events: none`.
- KPI row con glass card.
- **INIZIA GIORNATA** — bottone hero centrato, size lg.
- Mappa e meteo — card xl radius.

### 11.2 Giro apiario

- Hero uppercase nome apiario + emoji 🐝.
- Lista ordinata `<ol>` — un solo item espanso.
- Row compatta: `🐝 ARNIA N` + ✓ se completata.
- Card espansa: semaforo stato, data relativa, CTA **[VISITA]** full-width.

### 11.3 Scheda arnia premium

Classe wrapper: `.arnia-premium`. Stack verticale card glass:
- Header con copertina e badge stato,
- Health ring animato,
- Sezioni con titolo `.meli-label`,
- FAB fisso bottom-right (non coprire contenuto — padding-bottom su scroll).

### 11.4 Placeholder moduli

`FeaturePage` + `EmptyState` con icona modulo e testo "Sezione in sviluppo". Mantenere coerenza glass — non lasciare pagine bianche.

---

## 12. Accessibilità e uso in campo

| Requisito | Implementazione |
|-----------|-----------------|
| Touch ≥ 50 px | `--meli-touch-min`, `ArniaCard`, bottoni lg |
| Contrasto sole | Testo marrone su crema, semafori saturi |
| Guanti | No gesture complesse, no swipe obbligatorio |
| Safe area iPad | `env(safe-area-inset-*)` in `MainLayout` |
| Focus visibile | Mantenere outline su input form |

**Futuro (FUTURE_IDEAS):** modalità alto contrasto sole, haptic feedback su Capacitor.

---

## 13. Do / Don't

### ✅ Do

- Usare token CSS per colori, radius, ombre.
- Riutilizzare componenti `src/components/ui/`.
- Testare su iPad 768×1024 e 1024×768 prima di merge UI.
- Mantenere logica business nei services, non nei componenti UI.
- Usare `PageTitle` + `Section` per nuove pagine feature.

### ❌ Don't

- Introdurre font web pesanti o librerie UI esterne.
- Usare `#000` per testo o ombre nere pure.
- Angoli < 12 px su card.
- Modal piccolo per flussi visita.
- Hardcodare colori semaforo — usare token `--meli-hive-*`.
- Duplicare stili glass — estendere `.meli-glass`.

---

## 14. Checklist nuova feature UI

Prima di aprire PR con UI nuova, verificare:

- [ ] Token CSS usati, zero hex sparsi
- [ ] Touch target ≥ 50 px su azioni primarie
- [ ] Testato breakpoint iPad 768–1024 px
- [ ] Componenti da `src/components/ui/`
- [ ] Empty state se lista vuota
- [ ] Loading state se fetch async
- [ ] Motion ≤ 450 ms, no stagger su liste > 20 item
- [ ] Safe area rispettata su modal fullscreen

---

*Riferimento rapido token: `docs/design-system.md`. Flussi UX: [USER_FLOW.md](./USER_FLOW.md).*
