export type ReverseGeocodeResult = {
  comune?: string
  provincia?: string
  regione?: string
  indirizzo?: string
  quota?: number
}

type NominatimAddress = {
  city?: string
  town?: string
  village?: string
  municipality?: string
  hamlet?: string
  county?: string
  state_district?: string
  state?: string
  road?: string
  house_number?: string
  postcode?: string
}

type NominatimResponse = {
  address?: NominatimAddress
  display_name?: string
}

const NOMINATIM_REVERSE_URL = 'https://nominatim.openstreetmap.org/reverse'

function pickComune(address: NominatimAddress): string | undefined {
  return (
    address.city?.trim() ||
    address.town?.trim() ||
    address.village?.trim() ||
    address.municipality?.trim() ||
    address.hamlet?.trim() ||
    undefined
  )
}

function pickProvincia(address: NominatimAddress): string | undefined {
  return address.county?.trim() || address.state_district?.trim() || undefined
}

function pickRegione(address: NominatimAddress): string | undefined {
  return address.state?.trim() || undefined
}

function pickIndirizzo(address: NominatimAddress): string | undefined {
  const road = address.road?.trim()
  if (!road) return undefined

  const parts = [road]
  if (address.house_number?.trim()) parts.push(address.house_number.trim())
  if (address.postcode?.trim()) parts.push(address.postcode.trim())
  return parts.join(', ')
}

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
    const address = data.address
    if (!address) {
      return { quota: quotaFromDevice }
    }

    return {
      comune: pickComune(address),
      provincia: pickProvincia(address),
      regione: pickRegione(address),
      indirizzo: pickIndirizzo(address),
      quota: quotaFromDevice,
    }
  } catch {
    return { quota: quotaFromDevice }
  }
}
