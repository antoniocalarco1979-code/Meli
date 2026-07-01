import { useLiveQuery } from '../../../hooks/useLiveQuery'
import { getProduzioneAnnoCorrenteKg } from '../../../database/services/produzioneService'
import { ensureWorkspaceSeeded } from '../../../demo/ensureWorkspaceSeeded'

export function useHomeProduzioneAnno() {
  const { data, loading } = useLiveQuery(
    () => getProduzioneAnnoCorrenteKg(),
    [],
    { seed: ensureWorkspaceSeeded, fallback: 0 },
  )

  return {
    kgAnno: data ?? 0,
    loading,
  }
}
