import { useEffect, useState } from 'react'
import { GeoPointMap } from '../../../components/map'
import './ApiarioPosizioneMap.css'

const DEFAULT_CENTER = {
  latitudine: 38.25,
  longitudine: 16.05,
}

const MAP_ZOOM_SAVED = 15
const MAP_ZOOM_DEFAULT = 8

type ApiarioPosizioneMapPickerProps = {
  latitudine?: number
  longitudine?: number
  onDraftChange: (coords: { latitudine: number; longitudine: number }) => void
}

export function ApiarioPosizioneMapPicker({
  latitudine,
  longitudine,
  onDraftChange,
}: ApiarioPosizioneMapPickerProps) {
  const hasSavedCoords = latitudine != null && longitudine != null
  const [draft, setDraft] = useState(() => ({
    latitudine: latitudine ?? DEFAULT_CENTER.latitudine,
    longitudine: longitudine ?? DEFAULT_CENTER.longitudine,
  }))

  useEffect(() => {
    const next = {
      latitudine: latitudine ?? DEFAULT_CENTER.latitudine,
      longitudine: longitudine ?? DEFAULT_CENTER.longitudine,
    }
    setDraft(next)
    onDraftChange(next)
  }, [latitudine, longitudine, onDraftChange])

  const handleDraftChange = (coords: { latitudine: number; longitudine: number }) => {
    setDraft(coords)
    onDraftChange(coords)
  }

  return (
    <div className="apiario-posizione-map">
      <GeoPointMap
        latitudine={draft.latitudine}
        longitudine={draft.longitudine}
        zoom={hasSavedCoords ? MAP_ZOOM_SAVED : MAP_ZOOM_DEFAULT}
        minHeight={280}
        showGoogleMapsButton={false}
        interaction="picker"
        followMarker={false}
        showZoomControls
        onCoordinatesChange={handleDraftChange}
      />
      <p className="apiario-posizione-map__hint">
        Sposta e zooma la mappa, poi tocca un punto per posizionare il marker.
      </p>
    </div>
  )
}
