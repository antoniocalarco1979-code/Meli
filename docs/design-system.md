# Design system

**Riferimento ufficiale:** [UI_GUIDELINES.md](./UI_GUIDELINES.md) (Design System 2.0)

Definito in `src/theme/tokens.css` e `src/theme/global.css`.

## UI 2.0 — Tema

| Token | Uso |
|-------|-----|
| `--meli-charcoal` | Sfondo app |
| `--meli-honey` / `--meli-amber` | Accenti, CTA |
| `--meli-status-green` | Stati positivi |
| `--meli-alert-red` | Errori, urgenze |
| `--meli-text` | Testo principale (chiaro su scuro) |

## Superfici

- **Glass dark** — classi `.meli-glass`, `.meli-glass--deep`
- **Border radius** — `--meli-radius-sm` (12px) … `--meli-radius-xl` (24px)
- **Ombre** — `--meli-shadow-sm`, `--meli-shadow-md`, `--meli-shadow-lg`

## Componenti UI

Catalogo in `src/components/ui/`:

Button, Card, Section, Input, Textarea, Badge, Modal, ConfirmDialog, Toast, FloatingActionButton, PageTitle, EmptyState, Loading, Skeleton.

## Target device

Ottimizzato per **tablet Android** e **smartphone** (touch 50px, bottom nav mobile, sidebar desktop).
