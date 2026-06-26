# Modulo Visite

Le visite **non hanno una pagina dedicata**: il flusso è un modal fullscreen riusabile ovunque serva un'ispezione sul campo.

---

## Entry point

| Origine | Comportamento |
|---------|---------------|
| Scheda arnia (`FloatingVisitButton`) | Apre `NuovaVisitaModal` |
| Apiario (`ApiarioVisiteFlow`) | Lista sequenziale con auto-avanzamento |
| Dashboard (azioni rapide) | Naviga a `/arnie/:id` con `{ openVisita: true }` |

Rotte `/visite/*`: indice placeholder; `/visite/nuova` reindirizza a `/arnie`.

---

## Flusso guidato

```
┌─────────────────────────────────────┐
│  📍 Sei davanti all'Arnia N         │
├─────────────────────────────────────┤
│  Regina presente?     [ SÌ ] [ NO ] │
│  Covata controllata   [ ✓ ]         │
│  Scorte controllate   [ ✓ ]         │
│  Foto telaio          [ 📷 ]        │
│  Concluso             [ ✓ ]         │
├─────────────────────────────────────┤
│              [ SALVA VISITA ]       │
└─────────────────────────────────────┘
```

Step (`VisitaGuidataStep`): `posizione` → `regina` → `covata` → `scorte` → `foto` → `concluso`.

Stato checklist: `VisitaChecklistState` in `visitaGuidataSteps.ts`.

---

## Persistenza

`visitaSaveService.ts` scrive su IndexedDB:

- Record `visite` collegato all'arnia
- Aggiornamento `arnie.forzaFamiglia` (salute)
- Eventuale `foto` (blob via `cameraService`)
- Trattamento se indicato in visita
- Coordinate GPS opzionali (`gpsService`)

Dopo il salvataggio, `liveQuery` aggiorna automaticamente timeline, dashboard KPI e semafori.

---

## Device

- **Foto**: `cameraService.capturePhoto()` — web `input[type=file]` oggi, Capacitor Camera in futuro
- **GPS**: `gpsService.getCurrentPosition()` — Geolocation API web

Vedi [Device services](../device-services.md).

---

## File chiave

```
src/features/arnie/components/
  NuovaVisitaModal.tsx
  NuovaVisitaModal.css
  visitaGuidataSteps.ts
src/features/arnie/services/
  visitaSaveService.ts
src/database/services/
  visiteService.ts
```
