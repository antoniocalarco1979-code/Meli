# 005 — Onboarding primo avvio (Sprint 1 MVP)

**Stato:** Accettata  
**Data:** 2026-06

## Contesto

Al primo avvio il database è vuoto. Serve un percorso minimo per creare il primo apiario senza dati demo automatici.

## Decisione

1. **Seed demo** solo con `VITE_DEMO_SEED=true`.
2. **`OnboardingGate`**: redirect a `/onboarding` se `apiari.count === 0`.
3. **Benvenuto** con messaggio *"Benvenuto in MELI"* e CTA *"Crea il tuo primo apiario"*.
4. **Form** onboarding: Nome, Località, Note (facoltative) → Dexie via `createApiario`.
5. **Dopo salvataggio**: redirect automatico a `/apiari/:id` (scheda apiario).
6. Se esiste almeno un apiario, onboarding saltato.

Creazione arnia resta fuori da Sprint 1 (form `ArniaForm` disponibile per sprint successivi).

## Riferimenti codice

- `src/features/onboarding/OnboardingPage.tsx`
- `src/app/router/OnboardingGate.tsx`
- `src/features/apiari/components/ApiarioForm.tsx` (`onboarding` prop)
