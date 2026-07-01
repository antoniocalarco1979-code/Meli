import { useCallback, useMemo, useState } from 'react'
import type { TelainoVisitaRecord } from '../types/telainoPanel.types'
import { telainoNumeroFromId } from '../types/telainoPanel.types'

type UseTelainoPanelSelectionOptions = {
  telaini: TelainoVisitaRecord[]
}

export function useTelainoPanelSelection({ telaini }: UseTelainoPanelSelectionOptions) {
  const [selectedTelainoId, setSelectedTelainoId] = useState<string | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)

  const selectedTelaino = useMemo(
    () => telaini.find((item) => item.id === selectedTelainoId) ?? null,
    [selectedTelainoId, telaini],
  )

  const openTelaino = useCallback((telainoId: string) => {
    setSelectedTelainoId(telainoId)
    setPanelOpen(true)
  }, [])

  const openTelainoByNumero = useCallback(
    (numero: number) => {
      const record = telaini.find((item) => item.numero === numero)
      if (record) openTelaino(record.id)
    },
    [openTelaino, telaini],
  )

  const openFrame = useCallback(
    (frameId: string) => {
      const numero = telainoNumeroFromId(frameId)
      if (numero > 0) openTelainoByNumero(numero)
    },
    [openTelainoByNumero],
  )

  const closePanel = useCallback(() => {
    setPanelOpen(false)
  }, [])

  return {
    selectedTelainoId,
    selectedTelaino,
    panelOpen,
    openTelaino,
    openTelainoByNumero,
    openFrame,
    closePanel,
  }
}
