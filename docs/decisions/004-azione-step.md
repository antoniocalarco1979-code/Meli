# 004 — Step Azione post-ispezione

**Stato:** Accettata  
**Data:** 2026-06

## Contesto

Dopo l’ispezione l’apicultore decide un’**azione operativa** (melario, nutrizione, trattamento, …). Le “decisioni” generiche (note libere) non bastano per KPI e tracciamento trattamenti.

## Decisione

Step dedicato **`azione`** (⚡) tra opercolatura e decisioni:

| Opzione | Persistenza |
|---------|-------------|
| Aggiungere melario | Solo audit note |
| Togliere melario | Solo audit note |
| Nutrire | Crea trattamento `"Nutrizione"` |
| Trattare | Crea trattamento `"Trattamento"` |
| Controllare regina | Solo audit note |
| Nessuna azione | Solo audit note |
| + Altro… | Testo libero obbligatorio in `azioneAltro` |

Obbligatorio per salvare visita. Step **Decisioni** resta per note + foto opzionali.

`buildSaluteFlagsFromWizard`: `trattare` e `nutrire` contano come `trattamentiEseguiti`. Giro apiario: `reginaNonVista` se regina = `no` o `non_controllata`.

## Conseguenze

- **Pro:** Azioni strutturate per report e salute; “Altro” copre casi edge.
- **Contro:** Nutrire/Trattare senza dettaglio prodotto (solo etichetta generica) — miglioramento futuro: sotto-form o link magazzino.
- **Aperto:** Aggiungere/togliere melario non aggiorna ancora entità arnia o produzione.

## Riferimenti codice

- `VisitAzioneStep.tsx`, `AZIONE_OPTIONS`
- `visitWizardMapper.ts` — `labelAzione`, `resolveTrattamentoFromAzione`
- `visitSaveService.ts`
