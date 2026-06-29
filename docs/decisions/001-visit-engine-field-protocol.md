# 001 — Protocollo campo nel Visit Wizard

**Stato:** Accettata  
**Data:** 2026-06

## Contesto

L’apicultore sul campo segue un rituale fisico prima di aprire l’arnia: arrivo, DPI, affumicatore, attrezzatura, apertura, estrazione telai. Il wizard visita originale (6 step: regina → covata → scorte → foto → note → salva) non rispecchiava questo flusso operativo.

## Decisione

Sostituire il wizard breve con un **protocollo guidato a step** allineato al wireframe sul campo:

1. Preparazione (5 step “Continua”: arrivo → attrezzatura)
2. Estrazione telaio
3. Ispezione telai (vedi ADR 002)
4. Scorte, forza, melario, opercolatura (condizionale)
5. Azione (vedi ADR 004)
6. Decisioni (note + foto opzionali)
7. Salva → arnia successiva (giro apiario)

Implementazione: `VisitWizard` fullscreen, step dinamici (`getActiveWizardSteps`), swipe orizzontale, barra progresso.

## Conseguenze

- **Pro:** UX aderente al lavoro reale; meno salti cognitivi sul campo.
- **Pro:** Step preparazione non persistono in DB (solo UX).
- **Contro:** Wizard più lungo (~12–14 step); richiede disciplina per completare il giro.
- **Tecnico:** `useVisitWizard` naviga per `stepId`, non solo indice, per gestire step condizionali (opercolatura se melario).

## Riferimenti codice

- `src/features/visite/types/visitWizard.types.ts` — `VISIT_WIZARD_STEPS`
- `src/features/visite/hooks/useVisitWizard.ts`
- `src/features/visite/components/visit-engine/VisitWizard.tsx`
