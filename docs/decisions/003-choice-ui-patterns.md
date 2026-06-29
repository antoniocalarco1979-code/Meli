# 003 — Pattern UI per le scelte nel wizard

**Stato:** Accettata  
**Data:** 2026-06

## Contesto

Wireframe prodotto usano convenzioni visive diverse per tipi di risposta sul campo. Serviva coerenza senza un componente monolitico.

## Decisione

`VisitChoiceGrid` espone varianti per step:

| Variante | Simbolo | Uso |
|----------|---------|-----|
| `cards` | Pulsanti grandi | Forza famiglia (default legacy) |
| `radio` | ○ / ● | Regina (telai), covata, scorte, miele, polline, azione |
| `checkbox` | ☐ / ☑ | Opercolatura melario (scelta singola, stile checklist) |
| `status` | 🟢 🔴 🟡 + label | Esito regina: SI / NO / NON CONTROLLATA |

**Stelle:** componente dedicato `VisitStarRating` — lista preset:

```
★★★★★ … ★☆☆☆☆
```

Non auto-avanzamento su step con footer (telai, azione, decisioni). Auto-avanzamento (~180 ms) su scelte rapide singole (scorte, forza, melario, opercolatura).

## Conseguenze

- **Pro:** Wireframe rispettati; accessibilità `radiogroup` / `aria-checked`.
- **Pro:** Estendibile con `icon` opzionale su `VisitChoiceOption`.
- **Contro:** Quattro varianti da mantenere in `visit-engine.css`.

## Riferimenti codice

- `VisitChoiceGrid.tsx`, `visit-engine.css`
- Opzioni in `visitWizard.types.ts` (`REGINA_OPTIONS`, `COVATA_OPTIONS`, …)
