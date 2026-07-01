import { GeoPointMap, MapPositionEmptyState } from '../../../components/map'
import { hasValidCoordinates } from '../../../utils/mapGeo'
import './ApiarioLocationMap.css'

type ApiarioLocationMapProps = {
  latitudine?: number | null
  longitudine?: number | null
  nome: string
  onSetPosition?: () => void
}

export function ApiarioLocationMap({
  latitudine,
  longitudine,
  nome,
  onSetPosition,
}: ApiarioLocationMapProps) {
  if (!hasValidCoordinates(latitudine, longitudine)) {
    return <MapPositionEmptyState onSetPosition={onSetPosition} />
  }

  return (
    <GeoPointMap
      latitudine={Number(latitudine)}
      longitudine={Number(longitudine)}
      label={nome}
      minHeight={280}
    />
  )
}
