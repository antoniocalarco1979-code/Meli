# Decisioni architetturali e prodotto (ADR)

Registro delle decisioni significative per MELI. Ogni file è un **ADR** (Architecture Decision Record): contesto, decisione, conseguenze.

Formato: `NNN-titolo-breve.md` — numerazione crescente, immutabile una volta accettata.

| # | Decisione | Stato | Data |
|---|-----------|-------|------|
| [001](./001-visit-engine-field-protocol.md) | Protocollo campo nel Visit Wizard | Accettata | 2026-06 |
| [002](./002-telai-inspection.md) | Ispezione per telaio con stelle | Accettata | 2026-06 |
| [003](./003-choice-ui-patterns.md) | Pattern UI scelte (radio, status, checkbox) | Accettata | 2026-06 |
| [004](./004-azione-step.md) | Step Azione post-ispezione | Accettata | 2026-06 |
| [005](./005-onboarding-first-launch.md) | Onboarding primo avvio | Accettata | 2026-06 |

## Quando aggiungere un ADR

- Cambio di flusso utente non ovvio dal codice
- Trade-off prodotto vs tecnico (es. inferenza vs input esplicito)
- Scelta di modello dati o mapping verso IndexedDB
- Pattern UI ripetuto su più step

## Template

```markdown
# NNN — Titolo

**Stato:** Proposta | Accettata | Deprecata  
**Data:** YYYY-MM

## Contesto
…

## Decisione
…

## Conseguenze
…
```
