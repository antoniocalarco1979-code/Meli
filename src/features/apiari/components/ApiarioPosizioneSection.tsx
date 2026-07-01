import { Loader2, MapPin, Navigation } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { NominatimAutocomplete } from '../../../components/geocoding/NominatimAutocomplete'
import { GeoPointMap, MapPositionEmptyState } from '../../../components/map'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import {
  reverseGeocode,
  type NominatimPlaceSuggestion,
} from '../../../services/geocoding'
import { DEFAULT_GEO_OPTIONS, gpsService } from '../../../services/device'
import type { ApiarioPosizioneMode, ApiarioPosizioneState } from '../types/apiarioPosizione.types'
import { ApiarioPosizioneMapPicker } from './ApiarioPosizioneMapPicker'
import { ApiarioPosizioneSummary } from './ApiarioPosizioneSummary'
import './ApiarioPosizioneSection.css'

type ApiarioPosizioneSectionProps = {
  value: ApiarioPosizioneState
  onChange: (value: ApiarioPosizioneState) => void
  onError?: (message: string) => void
}

export function ApiarioPosizioneSection({
  value,
  onChange,
  onError,
}: ApiarioPosizioneSectionProps) {
  const [gpsLoading, setGpsLoading] = useState(false)
  const [geocodeLoading, setGeocodeLoading] = useState(false)
  const [gpsNotice, setGpsNotice] = useState<string | null>(null)
  const [mapDraft, setMapDraft] = useState<{ latitudine: number; longitudine: number } | null>(
    null,
  )
  const valueRef = useRef(value)
  valueRef.current = value

  const setMode = (mode: ApiarioPosizioneMode) => {
    onChange({ ...value, mode })
  }

  const patch = (partial: Partial<ApiarioPosizioneState>) => {
    onChange({ ...value, ...partial })
  }

  const applyReverseGeocode = useCallback(
    async (
      latitudine: number,
      longitudine: number,
      mode: ApiarioPosizioneMode,
      quotaFromDevice?: number,
    ) => {
      setGeocodeLoading(true)
      try {
        const geo = await reverseGeocode(latitudine, longitudine, quotaFromDevice)
        const current = valueRef.current
        onChange({
          ...current,
          mode,
          latitudine,
          longitudine,
          comune: geo.comune ?? current.comune,
          provincia: geo.provincia ?? current.provincia,
          regione: geo.regione ?? current.regione,
          indirizzo: geo.indirizzo ?? current.indirizzo,
          quota: geo.quota ?? current.quota,
        })
      } finally {
        setGeocodeLoading(false)
      }
    },
    [onChange],
  )

  const handleAcquireGps = async () => {
    setGpsNotice(null)

    if (!gpsService.isSupported()) {
      const message =
        'Geolocalizzazione non disponibile su questo dispositivo. Usa inserimento manuale.'
      setGpsNotice(message)
      onError?.(message)
      setMode('manual')
      return
    }

    setGpsLoading(true)

    const result = await gpsService.getCurrentPositionResult(DEFAULT_GEO_OPTIONS)
    setGpsLoading(false)

    if (!result.ok) {
      setGpsNotice(result.message)
      onError?.(result.message)
      if (result.code === 'permission_denied' || result.code === 'unsupported') {
        setMode('manual')
      }
      return
    }

    onChange({
      ...valueRef.current,
      mode: 'gps',
      latitudine: result.coords.latitudine,
      longitudine: result.coords.longitudine,
      quota: result.coords.quota ?? valueRef.current.quota,
    })

    await applyReverseGeocode(
      result.coords.latitudine,
      result.coords.longitudine,
      'gps',
      result.coords.quota,
    )
  }

  const handleMapConfirm = async () => {
    const draft =
      mapDraft ??
      (value.latitudine != null && value.longitudine != null
        ? { latitudine: value.latitudine, longitudine: value.longitudine }
        : null)

    if (!draft) return

    onChange({
      ...valueRef.current,
      mode: 'map',
      latitudine: draft.latitudine,
      longitudine: draft.longitudine,
    })

    await applyReverseGeocode(draft.latitudine, draft.longitudine, 'map')
  }

  const applyManualSuggestion = (
    suggestion: NominatimPlaceSuggestion,
    field: 'street' | 'city' | 'county',
  ) => {
    const current = valueRef.current
    onChange({
      ...current,
      mode: 'manual',
      latitudine: suggestion.latitudine,
      longitudine: suggestion.longitudine,
      comune:
        field === 'city'
          ? suggestion.comune ?? current.comune
          : suggestion.comune ?? current.comune,
      provincia:
        field === 'county'
          ? suggestion.provincia ?? current.provincia
          : suggestion.provincia ?? current.provincia,
      regione: suggestion.regione ?? current.regione,
      indirizzo:
        field === 'street'
          ? suggestion.indirizzo ?? suggestion.label.split(',')[0]?.trim()
          : current.indirizzo,
    })
  }

  const hasMapCoords = value.latitudine != null && value.longitudine != null
  const gpsBusy = gpsLoading || geocodeLoading

  return (
    <section className="apiario-posizione meli-glass meli-glass--deep" aria-labelledby="apiario-posizione-title">
      <header className="apiario-posizione__header">
        <MapPin size={20} aria-hidden="true" />
        <h3 id="apiario-posizione-title" className="apiario-posizione__title">
          Posizione Apiario
        </h3>
      </header>

      <div className="apiario-posizione__modes" role="tablist" aria-label="Modalità posizione">
        <button
          type="button"
          role="tab"
          aria-selected={value.mode === 'gps'}
          className={`apiario-posizione__mode${value.mode === 'gps' ? ' apiario-posizione__mode--active' : ''}`}
          onClick={() => {
            setGpsNotice(null)
            setMode('gps')
          }}
        >
          <Navigation size={16} aria-hidden="true" />
          📍 Usa la mia posizione
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={value.mode === 'map'}
          className={`apiario-posizione__mode${value.mode === 'map' ? ' apiario-posizione__mode--active' : ''}`}
          onClick={() => {
            setGpsNotice(null)
            setMode('map')
          }}
        >
          🗺️ Scegli sulla mappa
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={value.mode === 'manual'}
          className={`apiario-posizione__mode${value.mode === 'manual' ? ' apiario-posizione__mode--active' : ''}`}
          onClick={() => {
            setGpsNotice(null)
            setMode('manual')
          }}
        >
          ✍️ Inserimento manuale
        </button>
      </div>

      {value.mode === 'gps' && (
        <div className="apiario-posizione__gps">
          <Button
            type="button"
            variant="secondary"
            size="md"
            className="apiario-posizione__gps-btn"
            onClick={() => void handleAcquireGps()}
            disabled={gpsBusy}
          >
            {gpsBusy ? (
              <Loader2 size={18} className="apiario-posizione__spin" aria-hidden="true" />
            ) : (
              <Navigation size={18} aria-hidden="true" />
            )}
            {gpsLoading
              ? 'Rilevamento posizione…'
              : geocodeLoading
                ? 'Recupero comune e provincia…'
                : '📍 Usa la mia posizione'}
          </Button>

          {gpsNotice && (
            <p className="apiario-posizione__notice" role="alert">
              {gpsNotice}
            </p>
          )}

          {!hasMapCoords && (
            <MapPositionEmptyState
              onSetPosition={() => void handleAcquireGps()}
              actionLabel="📍 Usa la mia posizione"
            />
          )}

          {hasMapCoords && (
            <>
              <GeoPointMap
                latitudine={value.latitudine!}
                longitudine={value.longitudine!}
                zoom={15}
                minHeight={260}
                showGoogleMapsButton
                interaction="view"
              />
              <ApiarioPosizioneSummary value={value} />
            </>
          )}
        </div>
      )}

      {value.mode === 'map' && (
        <div className="apiario-posizione__map">
          <ApiarioPosizioneMapPicker
            latitudine={value.latitudine}
            longitudine={value.longitudine}
            onDraftChange={setMapDraft}
          />

          <Button
            type="button"
            variant="secondary"
            size="md"
            className="apiario-posizione__confirm-btn"
            onClick={() => void handleMapConfirm()}
            disabled={geocodeLoading}
          >
            {geocodeLoading ? (
              <>
                <Loader2 size={18} className="apiario-posizione__spin" aria-hidden="true" />
                Recupero comune e provincia…
              </>
            ) : (
              'Conferma posizione'
            )}
          </Button>

          {hasMapCoords && <ApiarioPosizioneSummary value={value} />}
        </div>
      )}

      {value.mode === 'manual' && (
        <div className="apiario-posizione__manual">
          {gpsNotice && (
            <p className="apiario-posizione__notice" role="alert">
              {gpsNotice}
            </p>
          )}

          <NominatimAutocomplete
            label="Via"
            value={value.indirizzo ?? ''}
            onValueChange={(indirizzo) => patch({ indirizzo })}
            onSelect={(suggestion) => applyManualSuggestion(suggestion, 'street')}
            scope="street"
            context={{ comune: value.comune, provincia: value.provincia }}
            placeholder="Cerca via o contrada…"
            hint="Autocomplete OpenStreetMap Nominatim"
          />

          <div className="apiario-posizione__row">
            <NominatimAutocomplete
              label="Comune"
              value={value.comune ?? ''}
              onValueChange={(comune) => patch({ comune })}
              onSelect={(suggestion) => applyManualSuggestion(suggestion, 'city')}
              scope="city"
              placeholder="Cerca comune…"
            />
            <NominatimAutocomplete
              label="Provincia"
              value={value.provincia ?? ''}
              onValueChange={(provincia) => patch({ provincia })}
              onSelect={(suggestion) => applyManualSuggestion(suggestion, 'county')}
              scope="county"
              placeholder="Cerca provincia…"
            />
          </div>

          <Input
            label="Regione"
            value={value.regione ?? ''}
            onChange={(e) => patch({ regione: e.target.value })}
            placeholder="Compilata automaticamente dalla selezione"
          />

          <Input
            label="Quota (m)"
            type="number"
            value={value.quota ?? ''}
            onChange={(e) =>
              patch({
                quota: e.target.value ? Number.parseInt(e.target.value, 10) : undefined,
              })
            }
            placeholder="Es. 650"
          />

          {hasMapCoords && (
            <>
              <GeoPointMap
                latitudine={value.latitudine!}
                longitudine={value.longitudine!}
                zoom={15}
                minHeight={240}
                showGoogleMapsButton
                interaction="view"
              />
              <ApiarioPosizioneSummary value={value} />
            </>
          )}
        </div>
      )}
    </section>
  )
}
