# Design system

Riferimento completo: [UI_GUIDELINES.md](./UI_GUIDELINES.md).

Definito in `src/theme/tokens.css` e `src/theme/global.css`.

## Palette

| Token | Uso |
|-------|-----|
| `--meli-honey` | Accenti primari, CTA |
| `--meli-cream` | Sfondo, superfici calde |
| `--meli-gold` | Highlight, icone attive |
| `--meli-brown` | Testo principale |
| `--meli-sage` | Stati positivi, natura |

## Superfici

- **Glassmorphism** — classi `.meli-glass`, `.meli-glass--deep`
- **Border radius** — `--meli-radius-sm` … `--meli-radius-xl`
- **Ombre** — `--meli-shadow-sm`, `--meli-shadow-md`, `--meli-shadow-lg`

## Componenti UI

Catalogo in `src/components/ui/`:

Button, Card, Section, Input, Textarea, Badge, Modal, FloatingActionButton, PageTitle, EmptyState, Loading.

## Target device

Ottimizzato per **iPad** (touch 50px, sidebar 256px, layout fluido 768–1024px).
