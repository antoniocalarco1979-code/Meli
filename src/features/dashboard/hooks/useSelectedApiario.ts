import { useCallback, useEffect, useState } from 'react'
import { useApiari } from '../../apiari/hooks/useApiari'
import { storageService } from '../../../services/device/storageService'
import { pickDefaultApiarioId } from '../services/pickDefaultApiario'

const STORAGE_KEY = 'selected-apiario-id'

export function useSelectedApiario() {
  const { apiari, loading: apiariLoading } = useApiari()
  const [selectedApiarioId, setSelectedApiarioIdState] = useState<string | undefined>()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (apiariLoading) return

    if (apiari.length === 0) {
      setSelectedApiarioIdState(undefined)
      setReady(true)
      return
    }

    let cancelled = false

    void storageService.get<string>(STORAGE_KEY).then((stored) => {
      if (cancelled) return

      const validStored = stored && apiari.some((a) => a.id === stored)
      const nextId = validStored ? stored : pickDefaultApiarioId(apiari)

      setSelectedApiarioIdState(nextId)
      setReady(true)

      if (nextId && nextId !== stored) {
        void storageService.set(STORAGE_KEY, nextId)
      }
    })

    return () => {
      cancelled = true
    }
  }, [apiari, apiariLoading])

  const setSelectedApiarioId = useCallback(async (id: string) => {
    setSelectedApiarioIdState(id)
    await storageService.set(STORAGE_KEY, id)
  }, [])

  const selectedApiario = apiari.find((a) => a.id === selectedApiarioId)

  return {
    apiari,
    selectedApiario,
    selectedApiarioId,
    setSelectedApiarioId,
    loading: apiariLoading || !ready,
  }
}
