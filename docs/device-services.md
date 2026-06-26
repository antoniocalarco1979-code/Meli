# Device services

Layer **Capacitor-ready** per fotocamera, GPS, notifiche e storage locale. Oggi usa API web; domani si sostituiscono i plugin nativi senza cambiare le feature.

---

## Posizione nel progetto

```
src/services/device/
  cameraService.ts
  gpsService.ts
  notificationService.ts
  storageService.ts
  types.ts
  index.ts
```

Import consigliato:

```ts
import { cameraService, gpsService } from '@/services'
```

`src/platform/` — re-export deprecati per compatibilità (`camera.ts`, `geolocation.ts`).

---

## Servizi

### `cameraService`

| Metodo | Web (oggi) | Capacitor (futuro) |
|--------|------------|---------------------|
| `capturePhoto()` | `<input capture>` + FileReader | `@capacitor/camera` |
| `isAvailable()` | sempre `true` | check permessi |

Tipo ritorno: `CapturedPhoto { path, thumbnail? }`

Usato da: `NuovaVisitaModal`

### `gpsService`

| Metodo | Web | Capacitor |
|--------|-----|-----------|
| `getCurrentPosition()` | `navigator.geolocation` | `@capacitor/geolocation` |

Tipo: `GeoCoordinates { latitudine, longitudine, accuratezza? }`

### `notificationService`

Placeholder per promemoria trattamenti / visite.

| Metodo | Note |
|--------|------|
| `schedule()` | no-op web |
| `cancel()` | no-op web |
| `requestPermission()` | `Notification.requestPermission()` se disponibile |

### `storageService`

Wrapper `localStorage` con namespace `MELI:` — preferenze UI, ultimo apiario selezionato, ecc.

---

## Integrazione Capacitor (checklist)

1. `npm install @capacitor/core @capacitor/camera @capacitor/geolocation @capacitor/local-notifications`
2. Sostituire implementazioni interne in `cameraService.ts` / `gpsService.ts`
3. Mantenere le stesse firme TypeScript — le feature non cambiano
4. Configurare `capacitor.config.ts` e build iOS (iPad)

---

## Principio

```
Feature UI  →  services/device  →  Web API | Capacitor plugin
```

Nessuna chiamata diretta a `navigator.geolocation` o `<input capture>` nelle pagine.
