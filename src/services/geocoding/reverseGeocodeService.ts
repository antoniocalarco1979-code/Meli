export type ReverseGeocodeResult = {
  comune?: string
  provincia?: string
  regione?: string
  indirizzo?: string
  quota?: number
}

type BigDataCloudResponse = {
  city?: string
  locality?: string
  principalSubdivision?: string
  principalSubdivisionCode?: string
  postcode?: string
  localityInfo?: {
    administrative?: { name: string; order: number }[]
    informative?: { name: string; description?: string }[]
  }
}

function pickComune(data: BigDataCloudResponse): string | undefined {
  return data.city?.trim() || data.locality?.trim() || undefined
}

function pickProvincia(data: BigDataCloudResponse): string | undefined {
  const admin = data.localityInfo?.administrative ?? []
  const province = admin.find((entry) => entry.order === 6)?.name
  if (province) return province

  const code = data.principalSubdivisionCode
  if (code?.startsWith('IT-')) return code.slice(3)
  return data.principalSubdivision?.trim() || undefined
}

function pickRegione(data: BigDataCloudResponse): string | undefined {
  const admin = data.localityInfo?.administrative ?? []
  const region = admin.find((entry) => entry.order === 4)?.name
  return region || data.principalSubdivision?.trim() || undefined
}

function pickIndirizzo(data: BigDataCloudResponse): string | undefined {
  const informative = data.localityInfo?.informative ?? []
  const road = informative.find((entry) =>
    entry.description?.toLowerCase().includes('road'),
  )?.name

  if (road) {
    return data.postcode ? `${road}, ${data.postcode}` : road
  }

  const place = informative[0]?.name?.trim()
  if (place && place !== data.city && place !== data.locality) return place
  return undefined
}

/**
 * Reverse geocoding client-side (CORS-friendly, adatto a PWA / mobile web).
 * @see https://www.bigdatacloud.com/free-api/free-reverse-geocode-to-city-api
 */
export async function reverseGeocode(
  latitudine: number,
  longitudine: number,
  quotaFromDevice?: number,
): Promise<ReverseGeocodeResult> {
  const url = new URL('https://api.bigdatacloud.net/data/reverse-geocode-client')
  url.searchParams.set('latitude', String(latitudine))
  url.searchParams.set('longitude', String(longitudine))
  url.searchParams.set('localityLanguage', 'it')

  try {
    const response = await fetch(url.toString())
    if (!response.ok) {
      return { quota: quotaFromDevice }
    }

    const data = (await response.json()) as BigDataCloudResponse
    return {
      comune: pickComune(data),
      provincia: pickProvincia(data),
      regione: pickRegione(data),
      indirizzo: pickIndirizzo(data),
      quota: quotaFromDevice,
    }
  } catch {
    return { quota: quotaFromDevice }
  }
}
