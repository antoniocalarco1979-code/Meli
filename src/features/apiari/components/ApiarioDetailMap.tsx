import { ApiarioLocationMap } from './ApiarioLocationMap'
import './ApiarioDetailMap.css'

type ApiarioDetailMapProps = {
  latitudine: number
  longitudine: number
  nome: string
}

/** @deprecated Usa ApiarioLocationMap — mantenuto per compatibilità import. */
export function ApiarioDetailMap({ latitudine, longitudine, nome }: ApiarioDetailMapProps) {
  return (
    <ApiarioLocationMap latitudine={latitudine} longitudine={longitudine} nome={nome} />
  )
}
