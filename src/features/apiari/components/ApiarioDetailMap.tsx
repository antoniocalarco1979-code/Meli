import { useMemo } from 'react'
import { MapPin } from 'lucide-react'
import { buildStaticMapUrl } from '../utils/mapProjection'
import './ApiarioDetailMap.css'

type ApiarioDetailMapProps = {
  latitudine: number
  longitudine: number
  nome: string
}

export function ApiarioDetailMap({ latitudine, longitudine, nome }: ApiarioDetailMapProps) {
  const mapUrl = useMemo(
    () => buildStaticMapUrl(latitudine, longitudine, 14),
    [latitudine, longitudine],
  )

  return (
    <div className="apiario-detail-map meli-glass">
      <div className="apiario-detail-map__frame">
        <img src={mapUrl} alt={`Mappa posizione ${nome}`} className="apiario-detail-map__image" />
        <span className="apiario-detail-map__pin" aria-hidden="true">
          <MapPin size={32} strokeWidth={2.2} />
        </span>
      </div>
    </div>
  )
}
