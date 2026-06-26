# Modulo Arnie

Inventario colonie, scheda premium e visita guidata. Target **iPad sul campo** (touch, guanti).

---

## Rotte

| Percorso | Pagina | Descrizione |
|----------|--------|-------------|
| `/arnie` | `ArniePage` | Lista globale con `ArniaCard` |
| `/arnie/:id` | `ArniaDetailPage` | Scheda premium + pulsante visita |

Apertura visita da navigazione:

```ts
navigate(`/arnie/${id}`, { state: { openVisita: true } })
```

---

## Componenti principali

### Lista — `ArniaCard`

Card touch-friendly con:

- Copertina apiario / placeholder
- Numero e nome arnia
- Semaforo salute (`SaluteSemaforo`)
- Ultima visita, regina, produzione anno
- QR code (placeholder)

File: `src/features/arnie/components/ArniaCard.tsx`

### Dettaglio — scheda premium

Ordine sezioni in `ArniaDetail.tsx`:

1. `ArniaHeader` — numero, nome, apiario, QR
2. `HealthCard` — salute circolare 0–100
3. `QueenCard` — regina attuale (anno, colore, origine)
4. `ProductionCard` — kg stagione corrente
5. `UltimaVisitaCard` — riepilogo ultima ispezione
6. `TimelineCard` — cronologia visite
7. `PhotoGallery` — foto da visite
8. `TrattamentiCard` — storico sanitario
9. `FloatingVisitButton` — **Nuova visita** (fisso in basso)

### Visita — `NuovaVisitaModal`

Modal **fullscreen** (non pagina separata). Checklist guidata:

```
📍 Sei davanti all'Arnia N
   Regina? [SÌ] [NO]
   → Covata → Scorte → Foto telaio → Concluso → Salva
```

Step definiti in `visitaGuidataSteps.ts`. Salvataggio via `visitaSaveService.ts` (IndexedDB + aggiornamento salute arnia).

---

## Servizi

| File | Ruolo |
|------|--------|
| `arniaDetailService.ts` | Query arricchite: lista e dettaglio con `HealthSummary`, `QueenSummary`, `ProductionSummary`, timeline |
| `visitaSaveService.ts` | Persistenza visita, foto, forza famiglia, trattamento collegato |
| `arniaFormatters.ts` | Date, etichette produzione, testi UI |

---

## Dati demo

Seed in `src/features/arnie/data/seedArnie.ts`:

- Apiario **Acquacalda**, arnie 1–12
- **Arnia 12** con dati completi (94% salute, regina 2025 Bianca, oxalico, 38 kg)

> Se IndexedDB è precedente alla migrazione v5, cancellare i dati sito dal browser per vedere il seed aggiornato.

---

## Placeholder (prossimi sprint)

- Modifica arnia / sostituzione regina (pulsanti UI presenti, logica da implementare)
- Scanner QR nativo (Capacitor)
- `ArniaTimeline.tsx` — legacy, sostituito da `TimelineCard`
