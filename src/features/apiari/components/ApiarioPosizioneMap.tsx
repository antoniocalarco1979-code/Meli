import { GeoPointMap } from '../../../components/map'
import './ApiarioPosizioneMap.css'

const MAP_ZOOM = 15

type ApiarioPosizioneMapProps = {
  latitudine: number
  longitudine: number
  onCoordinatesChange: (coords: { latitudine: number; longitudine: number }) => void
  onCoordinatesCommit?: (coords: { latitudine: number; longitudine: number }) => void
}

export function ApiarioPosizioneMap({
  latitudine,
  longitudine,
  onCoordinatesChange,
  onCoordinatesCommit,
}: ApiarioPosizioneMapProps) {
  return (
    <div className="apiario-posizione-map">
      <GeoPointMap
        latitudine={latitudine}
        longitudine={longitudine}
        zoom={MAP_ZOOM}
        minHeight={260}
        showGoogleMapsButton
        interactive
        onCoordinatesChange={onCoordinatesChange}
        onCoordinatesCommit={onCoordinatesCommit}
      />
      <p className="apiario-posizione-map__hint">
        Trascina il pin o tocca la mappa per affinare la posizione.
      </p>
    </div>
  )
}
