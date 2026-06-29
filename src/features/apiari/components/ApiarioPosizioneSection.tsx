import { Loader2, MapPin, Navigation } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { reverseGeocode } from '../../../services/geocoding'
import { gpsService } from '../../../services/device'
import type { ApiarioPosizioneMode, ApiarioPosizioneState } from '../types/apiarioPosizione.types'
import { ApiarioPosizioneMap } from './ApiarioPosizioneMap'
import './ApiarioPosizioneSection.css'

const hasGeolocation =
  typeof navigator !== 'undefined' && 'geolocation' in navigator

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
  const valueRef = useRef(value)
  valueRef.current = value

  const setMode = (mode: ApiarioPosizioneMode) => {
    onChange({ ...value, mode })
  }

  const patch = (partial: Partial<ApiarioPosizioneState>) => {
    onChange({ ...value, ...partial })
  }

  const applyReverseGeocode = useCallback(
    async (latitudine: number, longitudine: number, quotaFromDevice?: number) => {
      setGeocodeLoading(true)
      try {
        const geo = await reverseGeocode(latitudine, longitudine, quotaFromDevice)
        const current = valueRef.current
        onChange({
          ...current,
          mode: 'gps',
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
    if (!hasGeolocation) {
      onError?.('Geolocalizzazione non disponibile su questo dispositivo. Usa inserimento manuale.')
      setMode('manual')
      return
    }

    setGpsLoading(true)

    const coords = await gpsService.getCurrentPosition({ enableHighAccuracy: true })
    setGpsLoading(false)

    if (!coords) {
      onError?.('Impossibile ottenere la posizione. Verifica i permessi o inserisci i dati manualmente.')
      return
    }

    await applyReverseGeocode(coords.latitudine, coords.longitudine, coords.quota)
  }

  const handleMapMove = (coords: { latitudine: number; longitudine: number }) => {
    patch(coords)
  }

  const handleMapCommit = (coords: { latitudine: number; longitudine: number }) => {
    patch(coords)
    void applyReverseGeocode(coords.latitudine, coords.longitudine, valueRef.current.quota)
  }

  const hasMapCoords = value.latitudine != null && value.longitudine != null

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
          onClick={() => setMode('gps')}
        >
          <Navigation size={16} aria-hidden="true" />
          Usa posizione GPS
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={value.mode === 'manual'}
          className={`apiario-posizione__mode${value.mode === 'manual' ? ' apiario-posizione__mode--active' : ''}`}
          onClick={() => setMode('manual')}
        >
          Inserisci manualmente
        </button>
      </div>

      {value.mode === 'gps' ? (
        <div className="apiario-posizione__gps">
          <Button
            type="button"
            variant="secondary"
            size="md"
            className="apiario-posizione__gps-btn"
            onClick={() => void handleAcquireGps()}
            disabled={gpsLoading || geocodeLoading}
          >
            {gpsLoading || geocodeLoading ? (
              <Loader2 size={18} className="apiario-posizione__spin" aria-hidden="true" />
            ) : (
              <Navigation size={18} aria-hidden="true" />
            )}
            {gpsLoading
              ? 'Acquisizione GPS…'
              : geocodeLoading
                ? 'Recupero indirizzo…'
                : hasMapCoords
                  ? 'Aggiorna posizione GPS'
                  : 'Acquisisci posizione GPS'}
          </Button>

          {!hasGeolocation && (
            <p className="apiario-posizione__notice">
              Geolocalizzazione non supportata. Passa a inserimento manuale.
            </p>
          )}

          {hasMapCoords && (
            <>
              <ApiarioPosizioneMap
                latitudine={value.latitudine!}
                longitudine={value.longitudine!}
                onCoordinatesChange={handleMapMove}
                onCoordinatesCommit={handleMapCommit}
              />
              <dl className="apiario-posizione__summary">
                <div>
                  <dt>Coordinate</dt>
                  <dd>
                    {value.latitudine}, {value.longitudine}
                  </dd>
                </div>
                {value.comune && (
                  <div>
                    <dt>Comune</dt>
                    <dd>{value.comune}</dd>
                  </div>
                )}
                {value.provincia && (
                  <div>
                    <dt>Provincia</dt>
                    <dd>{value.provincia}</dd>
                  </div>
                )}
                {value.regione && (
                  <div>
                    <dt>Regione</dt>
                    <dd>{value.regione}</dd>
                  </div>
                )}
                {value.quota != null && (
                  <div>
                    <dt>Quota</dt>
                    <dd>{value.quota} m</dd>
                  </div>
                )}
                {value.indirizzo && (
                  <div className="apiario-posizione__summary-wide">
                    <dt>Indirizzo</dt>
                    <dd>{value.indirizzo}</dd>
                  </div>
                )}
              </dl>
            </>
          )}
        </div>
      ) : (
        <div className="apiario-posizione__manual">
          <Input
            label="Comune"
            value={value.comune ?? ''}
            onChange={(e) => patch({ comune: e.target.value })}
            placeholder="Es. San Roberto"
          />
          <div className="apiario-posizione__row">
            <Input
              label="Provincia"
              value={value.provincia ?? ''}
              onChange={(e) => patch({ provincia: e.target.value })}
              placeholder="Es. RC"
            />
            <Input
              label="Regione"
              value={value.regione ?? ''}
              onChange={(e) => patch({ regione: e.target.value })}
              placeholder="Es. Calabria"
            />
          </div>
          <Input
            label="Indirizzo"
            value={value.indirizzo ?? ''}
            onChange={(e) => patch({ indirizzo: e.target.value })}
            placeholder="Via, contrada o punto di accesso"
          />
          <div className="apiario-posizione__row">
            <Input
              label="Latitudine"
              value={value.latitudine ?? ''}
              onChange={(e) =>
                patch({
                  latitudine: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                })
              }
              placeholder="Es. 38.123456"
              inputMode="decimal"
            />
            <Input
              label="Longitudine"
              value={value.longitudine ?? ''}
              onChange={(e) =>
                patch({
                  longitudine: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                })
              }
              placeholder="Es. 16.123456"
              inputMode="decimal"
            />
          </div>
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
        </div>
      )}
    </section>
  )
}
