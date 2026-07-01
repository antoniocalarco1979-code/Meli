export type NominatimAddress = {
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

export type ParsedNominatimAddress = {
  comune?: string
  provincia?: string
  regione?: string
  indirizzo?: string
}

export function parseNominatimAddress(address?: NominatimAddress): ParsedNominatimAddress {
  if (!address) return {}

  const road = address.road?.trim()
  const indirizzoParts = road ? [road] : []
  if (address.house_number?.trim()) indirizzoParts.push(address.house_number.trim())

  return {
    comune:
      address.city?.trim() ||
      address.town?.trim() ||
      address.village?.trim() ||
      address.municipality?.trim() ||
      address.hamlet?.trim() ||
      undefined,
    provincia: address.county?.trim() || address.state_district?.trim() || undefined,
    regione: address.state?.trim() || undefined,
    indirizzo: indirizzoParts.length > 0 ? indirizzoParts.join(', ') : undefined,
  }
}
