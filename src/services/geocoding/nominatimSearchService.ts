import { parseNominatimAddress, type NominatimAddress } from './nominatimAddress'

const NOMINATIM_SEARCH_URL = 'https://nominatim.openstreetmap.org/search'
const MIN_INTERVAL_MS = 1100

let lastRequestAt = 0

export type NominatimPlaceSuggestion = {
  id: string
  label: string
  latitudine: number
  longitudine: number
  comune?: string
  provincia?: string
  regione?: string
  indirizzo?: string
}

type NominatimSearchRow = {
  place_id: number
  lat: string
  lon: string
  display_name: string
  address?: NominatimAddress
}

export type NominatimSearchScope = 'street' | 'city' | 'county'

async function nominatimFetch(url: URL): Promise<Response> {
  const wait = Math.max(0, MIN_INTERVAL_MS - (Date.now() - lastRequestAt))
  if (wait > 0) {
    await new Promise((resolve) => window.setTimeout(resolve, wait))
  }
  lastRequestAt = Date.now()

  return fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'it',
    },
  })
}

function buildScopedQuery(query: string, scope: NominatimSearchScope, context?: {
  comune?: string
  provincia?: string
}): string {
  const trimmed = query.trim()
  if (!trimmed) return ''

  if (scope === 'street') {
    const parts = [trimmed]
    if (context?.comune) parts.push(context.comune)
    if (context?.provincia) parts.push(context.provincia)
    parts.push('Italia')
    return parts.join(', ')
  }

  if (scope === 'county') {
    return `${trimmed}, Italia`
  }

  return `${trimmed}, Italia`
}

function rowToSuggestion(row: NominatimSearchRow): NominatimPlaceSuggestion | null {
  const latitudine = Number.parseFloat(row.lat)
  const longitudine = Number.parseFloat(row.lon)
  if (!Number.isFinite(latitudine) || !Number.isFinite(longitudine)) return null

  const parsed = parseNominatimAddress(row.address)

  return {
    id: String(row.place_id),
    label: row.display_name,
    latitudine: Number(latitudine.toFixed(6)),
    longitudine: Number(longitudine.toFixed(6)),
    comune: parsed.comune,
    provincia: parsed.provincia,
    regione: parsed.regione,
    indirizzo: parsed.indirizzo ?? row.address?.road?.trim(),
  }
}

/**
 * Autocomplete luoghi via OpenStreetMap Nominatim.
 * @see https://nominatim.org/release-docs/latest/api/Search/
 */
export async function searchNominatimPlaces(
  query: string,
  scope: NominatimSearchScope,
  context?: { comune?: string; provincia?: string },
  limit = 6,
): Promise<NominatimPlaceSuggestion[]> {
  const q = buildScopedQuery(query, scope, context)
  if (q.length < 2) return []

  const url = new URL(NOMINATIM_SEARCH_URL)
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('q', q)
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('accept-language', 'it')
  url.searchParams.set('countrycodes', 'it')
  url.searchParams.set('limit', String(limit))

  try {
    const response = await nominatimFetch(url)
    if (!response.ok) return []

    const rows = (await response.json()) as NominatimSearchRow[]
    return rows
      .map(rowToSuggestion)
      .filter((item): item is NominatimPlaceSuggestion => Boolean(item))
  } catch {
    return []
  }
}

/** Geocodifica un indirizzo completo → coordinate + campi strutturati. */
export async function geocodeAddressQuery(query: string): Promise<NominatimPlaceSuggestion | null> {
  const results = await searchNominatimPlaces(query, 'street', undefined, 1)
  return results[0] ?? null
}
