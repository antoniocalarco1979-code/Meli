# Modulo Apiari

Gestione siti apistici e **percorso visite sequenziale** per ispezioni in apiario.

---

## Rotte

| Percorso | Pagina |
|----------|--------|
| `/apiari` | Lista apiari |
| `/apiari/:id` | Dettaglio apiario |

---

## Dettaglio apiario

`ApiarioDetailPage.tsx` mostra:

- Intestazione apiario (nome, località, mappa placeholder)
- **`ApiarioVisiteFlow`** — flusso visite verticale (Sprint sequenziale)

### Percorso visite (`ApiarioVisiteFlow`)

Wireframe operativo sul campo:

```
🐝 Arnia 1    [ VISITA ]
       ↓
🐝 Arnia 2    [ VISITA ]
       ↓
🐝 Arnia 3    [ VISITA ]
       ...
```

Comportamento:

- Lista ordinata per numero arnia (`getArnieEnrichedByApiarioId`)
- Pulsante **VISITA** grande → apre `NuovaVisitaModal` inline
- Dopo **Salva**, avanza automaticamente all'arnia successiva (400 ms)
- Tap sull'etichetta arnia → `/arnie/:id` (scheda completa)
- Semaforo salute accanto a ogni voce

File: `src/features/apiari/components/ApiarioVisiteFlow.tsx`

> `ApiarioArnieList.tsx` esiste ancora (griglia card) ma non è usata nella pagina dettaglio corrente.

---

## Database

Tabella `apiari` — schema v5 in `src/database/schema.ts`.

Campi principali: `nome`, `localita`, `latitudine`, `longitudine`, `fotoCopertina`, `note`.

Seed demo: **Apiario Acquacalda** con 12 arnie.

---

## Dashboard

`useDashboardFlow` e `useDashboardLiveStats` collegano KPI e attività del giorno agli apiari reali in IndexedDB.

Azioni rapide navigano a dettaglio apiario o aprono visita con `openVisita: true`.
