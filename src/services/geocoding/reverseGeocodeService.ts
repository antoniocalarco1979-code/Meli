import { parseNominatimAddress, type NominatimAddress } from './nominatimAddress'

export type ReverseGeocodeResult = {
  comune?: string
  provincia?: string
  regione?: string
  indirizzo?: string
  quota?: number
}

type NominatimResponse = {
  address?: NominatimAddress
  display_name?: string
}

const NOMINATIM_REVERSE_URL = 'https://nominatim.openstreetmap.org/reverse'

/**
 * Reverse geocoding tramite OpenStreetMap Nominatim.
 * @see https://nominatim.org/release-docs/latest/api/Reverse/
 */
export async function reverseGeocode(
  latitudine: number,
  longitudine: number,
  quotaFromDevice?: number,
): Promise<ReverseGeocodeResult> {
  const url = new URL(NOMINATIM_REVERSE_URL)
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('lat', String(latitudine))
  url.searchParams.set('lon', String(longitudine))
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('accept-language', 'it')

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'it',
      },
    })

    if (!response.ok) {
      return { quota: quotaFromDevice }
    }

    const data = (await response.json()) as NominatimResponse
    const parsed = parseNominatimAddress(data.address)

    return {
      ...parsed,
      quota: quotaFromDevice,
    }
  } catch {
    return { quota: quotaFromDevice }
  }
}
