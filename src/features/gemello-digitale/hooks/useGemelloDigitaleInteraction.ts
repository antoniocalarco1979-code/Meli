import { useCallback, useMemo, useState } from 'react'
import type {
  GemelloDigitaleModel,
  GemelloDigitaleViewMode,
  GemelloInteractionSnapshot,
  GemelloPanelTarget,
  MelarioGemelloModel,
  TelainoGemelloModel,
} from '../types/gemelloDigitale.types'

type UseGemelloDigitaleInteractionResult = {
  view: GemelloDigitaleViewMode
  liftedMelarioIds: ReadonlySet<string>
  escludiReginaVisible: boolean
  selectedMelarioId: string | null
  selectedTelainoId: string | null
  panelOpen: boolean
  panelTarget: GemelloPanelTarget
  selectedMelario: MelarioGemelloModel | null
  selectedTelaino: TelainoGemelloModel | null
  isMelarioLifted: (id: string) => boolean
  handleMelarioClick: (melario: MelarioGemelloModel) => void
  handleEscludiReginaClick: () => void
  restoreEscludiRegina: () => void
  handleNidoClick: () => void
  handleTelainoClick: (telaino: TelainoGemelloModel) => void
  closePanel: () => void
  backToStack: () => void
  snapshot: GemelloInteractionSnapshot
}

export function useGemelloDigitaleInteraction(
  model: GemelloDigitaleModel,
): UseGemelloDigitaleInteractionResult {
  const [view, setView] = useState<GemelloDigitaleViewMode>('stack')
  const [liftedMelarioIds, setLiftedMelarioIds] = useState<Set<string>>(() => new Set())
  const [escludiReginaVisible, setEscludiReginaVisible] = useState(true)
  const [selectedMelarioId, setSelectedMelarioId] = useState<string | null>(null)
  const [selectedTelainoId, setSelectedTelainoId] = useState<string | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [panelTarget, setPanelTarget] = useState<GemelloPanelTarget>(null)

  const selectedMelario = useMemo(
    () => model.melari.find((m) => m.id === selectedMelarioId) ?? null,
    [model.melari, selectedMelarioId],
  )

  const selectedTelaino = useMemo(
    () => model.nido.telaini.find((t) => t.id === selectedTelainoId) ?? null,
    [model.nido.telaini, selectedTelainoId],
  )

  const isMelarioLifted = useCallback(
    (id: string) => liftedMelarioIds.has(id),
    [liftedMelarioIds],
  )

  const closePanel = useCallback(() => {
    setPanelOpen(false)
    setPanelTarget(null)
    setSelectedMelarioId(null)
    setSelectedTelainoId(null)
  }, [])

  const backToStack = useCallback(() => {
    setView('stack')
    closePanel()
  }, [closePanel])

  const handleMelarioClick = useCallback((melario: MelarioGemelloModel) => {
    setLiftedMelarioIds((current) => {
      const next = new Set(current)
      if (next.has(melario.id)) {
        next.delete(melario.id)
      } else {
        next.add(melario.id)
      }
      return next
    })
    setSelectedMelarioId(melario.id)
    setSelectedTelainoId(null)
    setPanelTarget('melario')
    setPanelOpen(true)
  }, [])

  const handleEscludiReginaClick = useCallback(() => {
    setEscludiReginaVisible(false)
    closePanel()
  }, [closePanel])

  const restoreEscludiRegina = useCallback(() => {
    setEscludiReginaVisible(true)
  }, [])

  const handleNidoClick = useCallback(() => {
    setView('nido')
    closePanel()
  }, [closePanel])

  const handleTelainoClick = useCallback((telaino: TelainoGemelloModel) => {
    setSelectedTelainoId(telaino.id)
    setSelectedMelarioId(null)
    setPanelTarget('telaino')
    setPanelOpen(true)
  }, [])

  const snapshot: GemelloInteractionSnapshot = {
    view,
    liftedMelarioIds: [...liftedMelarioIds],
    escludiReginaVisible,
    selectedMelarioId,
    selectedTelainoId,
    panelOpen,
    panelTarget,
    at: Date.now(),
  }

  return {
    view,
    liftedMelarioIds,
    escludiReginaVisible,
    selectedMelarioId,
    selectedTelainoId,
    panelOpen,
    panelTarget,
    selectedMelario,
    selectedTelaino,
    isMelarioLifted,
    handleMelarioClick,
    handleEscludiReginaClick,
    restoreEscludiRegina,
    handleNidoClick,
    handleTelainoClick,
    closePanel,
    backToStack,
    snapshot,
  }
}

/** @deprecated */
export const useGemelloDigitaleNavigation = useGemelloDigitaleInteraction
