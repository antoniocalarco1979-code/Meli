# 002 — Ispezione per telaio con stelle

**Stato:** Accettata  
**Data:** 2026-06

## Contesto

In ispezione reale si estraggono telai uno alla volta e si annota cosa si vede su ciascuno (covata, miele, polline, regina). I quattro step separati (regina / covata / miele / polline) non modellavano questa granularità.

## Decisione

Introdurre lo step **`ispezione_telai`** con lista cumulativa:

- Ogni riga: `Telaio N` → tipo → valutazione
- Tipi: Covata, Miele, Polline, Regina vista
- Covata / Miele / Polline: **stelle 1–5** (preset lista, non stelle singole tap)
- Regina vista: esito semaforo SI / NO / NON CONTROLLATA (ADR 003)

**Completamento step:** almeno un telaio per ogni tipo obbligatorio.

**Sintesi visita:** da telai si derivano i campi aggregati salvati in visita:

| Telai (max stelle) | Campo wizard |
|--------------------|--------------|
| Covata 4–5★ | `compatta` |
| Covata 2–3★ | `discontinua` |
| Covata 1★ | `assente` |
| Miele/Polline 4–5★ | `presente` |
| 3★ | `scarso` |
| 1–2★ | `assente` |
| Regina: almeno un SI | `regina = si` |

Audit note include elenco telai riga per riga.

## Conseguenze

- **Pro:** Traccia fedele al lavoro sul telaio; riepilogo leggibile.
- **Contro:** Mapping stelle → enum è euristico; da validare con apicultori.
- **Contro:** Quattro telai minimi possono sembrare rigidi su arnie piccole.

## Riferimenti codice

- `src/features/visite/services/visitTelaiMapper.ts`
- `src/features/visite/components/visit-engine/VisitTelaiStep.tsx`
- `VisitStarRating.tsx`, `VisitTelaioEntry` in `visitWizard.types.ts`
