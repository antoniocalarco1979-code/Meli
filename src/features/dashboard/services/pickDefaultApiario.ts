import type { ApiarioView } from '../../apiari/types'

export function pickDefaultApiarioId(apiari: ApiarioView[]): string | undefined {
  return apiari.find((a) => a.nome.includes('Acquacalda'))?.id ?? apiari[0]?.id
}
