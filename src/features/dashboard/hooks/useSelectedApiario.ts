import { useCallback, useEffect, useState } from 'react'
import { useApiari } from '../../apiari/hooks/useApiari'
import { storageService } from '../../../services/device/storageService'
import { pickDefaultApiarioId } from '../services/pickDefaultApiario'

const STORAGE_KEY = 'selected-apiario-id'
const READY_TIMEOUT_MS = 8_000

export function useSelectedApiario() {
  const { apiari, loading: apiariLoading } = useApiari()
  const [selectedApiarioId, setSelectedApiarioIdState] = useState<string | undefined>()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setReady(true)
    }, READY_TIMEOUT_MS)

    if (apiariLoading) {
      return () => window.clearTimeout(timeout)
    }

    if (apiari.length === 0) {
      setSelectedApiarioIdState(undefined)
      setReady(true)
      window.clearTimeout(timeout)
      return () => window.clearTimeout(timeout)
    }

    let cancelled = false

    void storageService.get<string>(STORAGE_KEY).then((stored) => {
      if (cancelled) return

      const validStored = stored && apiari.some((a) => a.id === stored)
      const nextId = validStored ? stored : pickDefaultApiarioId(apiari)

      setSelectedApiarioIdState(nextId)
      setReady(true)
      window.clearTimeout(timeout)

      if (nextId && nextId !== stored) {
        void storageService.set(STORAGE_KEY, nextId)
      }
    })

    return () => {
      cancelled = true
      window.clearTimeout(timeout)
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
    loading: apiariLoading && !ready,
  }
}
